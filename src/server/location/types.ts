/** A location together with the posts pinned to it — the shape the map needs. */
export type LocationWithPosts = {
  id: string;
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  posts: {
    id: string;
    title: string;
    userName: string | null;
  }[];
};
