import { dbClient, withTransaction } from "@/server/transaction";
import { ForbiddenError } from "@/server/errors";
import type { CreatePostInput, UpdatePostInput } from "@/server/schema/post";
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

/**
 * Editing is limited to what the author wrote; the place stays as chosen.
 * A post that is missing and a post belonging to someone else are the same
 * answer on purpose — neither is something this user may edit.
 */
export async function update(
  userId: string,
  postId: string,
  input: UpdatePostInput,
): Promise<{ id: string }> {
  const updated = UUID_PATTERN.test(postId)
    ? await postRepo.updateOwned(dbClient, { id: postId, userId, values: input })
    : null;

  if (!updated) {
    throw new ForbiddenError("That post does not exist, or is not yours to edit");
  }

  return updated;
}

export async function remove(
  userId: string,
  postId: string,
): Promise<{ id: string }> {
  const deleted = UUID_PATTERN.test(postId)
    ? await postRepo.deleteOwned(dbClient, { id: postId, userId })
    : null;

  if (!deleted) {
    throw new ForbiddenError("That post does not exist, or is not yours to delete");
  }

  return deleted;
}
