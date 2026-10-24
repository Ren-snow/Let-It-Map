import { PostCreateScreen } from "@/features/post/screens/PostCreateScreen";

type PlaceParams = {
  placeId?: string;
  name?: string;
  address?: string;
  lat?: string;
  lng?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PlaceParams>;
}) {
  return <PostCreateScreen searchParams={await searchParams} />;
}
