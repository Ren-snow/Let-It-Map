"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import * as postService from "@/server/post/service";
import { createPostInput } from "@/server/schema/post";

type CreatePostValues = {
  title: string;
  description: string;
  locationName: string;
  locationAddress: string;
  placeId: string;
  latitude: string;
  longitude: string;
};

export type CreatePostState =
  | {
      error: string;
      values: CreatePostValues;
    }
  | undefined;

const emptyValues: CreatePostValues = {
  title: "",
  description: "",
  locationName: "",
  locationAddress: "",
  placeId: "",
  latitude: "",
  longitude: "",
};

function readValues(formData: FormData): CreatePostValues {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    locationName: String(formData.get("locationName") ?? ""),
    locationAddress: String(formData.get("locationAddress") ?? ""),
    placeId: String(formData.get("placeId") ?? ""),
    latitude: String(formData.get("latitude") ?? ""),
    longitude: String(formData.get("longitude") ?? ""),
  };
}

// _prevState is required by useActionState but unused here
export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "Authentication required", values: emptyValues };
  }

  const values = readValues(formData);

  const parsed = createPostInput.safeParse({
    title: values.title,
    description: values.description,
    location: {
      placeId: values.placeId,
      name: values.locationName,
      address: values.locationAddress,
      latitude: values.latitude,
      longitude: values.longitude,
    },
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }

  await postService.create(userId, parsed.data);

  // "/" is the map screen and is prerendered, so a new pin needs it invalidated too.
  revalidatePath("/");
  revalidatePath("/posts");
  redirect("/posts");
}
