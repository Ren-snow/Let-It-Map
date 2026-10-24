import { dbClient, withTransaction } from "@/server/transaction";
import type { CreatePostInput } from "@/server/schema/post";
import type { PaginatedResult } from "@/types/common";
import * as locationService from "@/server/location/service";
import * as postRepo from "./repository";
import type { PostDetail, PostWithDetails } from "./types";

const DEFAULT_PAGE_SIZE = 20;

/** Postgres rejects a malformed uuid outright, so screen it before querying. */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function list({
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  userId,
}: {
  page?: number;
  pageSize?: number;
  userId?: string;
}): Promise<PaginatedResult<PostWithDetails>> {
  const [data, total] = await Promise.all([
    postRepo.findMany(dbClient, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      userId,
    }),
    postRepo.countAll(dbClient, { userId }),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / pageSize) };
}

/** Absence is a normal outcome for a read, so this returns null rather than throwing. */
export async function get(id: string): Promise<PostDetail | null> {
  if (!UUID_PATTERN.test(id)) return null;
  return postRepo.findById(dbClient, id);
}

export async function create(
  userId: string,
  input: CreatePostInput,
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    const locationId = await locationService.findOrCreate(tx, input.location);

    return postRepo.insert(tx, {
      userId,
      locationId,
      title: input.title,
      description: input.description,
    });
  });
}
