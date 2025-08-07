"use client";

import AddressInput from "@/components/map/AddressInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UploadButton } from "@/lib/upload-thing";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import type { Post, Location } from "@prisma/client";
import { useState, useTransition } from "react";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import { updatePost } from "@/lib/actions/update-post";
import Link from "next/link";

interface PostWithLocation extends Post {
    location: Location;
}

interface EditFormProps {
    post: PostWithLocation;
}

const libraries: Libraries = ["places"];

export default function EditForm({ post }: EditFormProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries,
    });

    const [address, setAddress] = useState(post.location.address);
    const [lat, setLat] = useState(post.location.lat);
    const [lng, setLng] = useState(post.location.lng);

    const [isPending, startTransition] = useTransition();

    const handleAddressSelect = (
        selectedAddress: string,
        selectedLat: number,
        selectedLng: number
    ) => {
        setAddress(selectedAddress);
        setLat(selectedLat);
        setLng(selectedLng);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        formData.set("address", address);
        formData.set("lat", lat.toString());
        formData.set("lng", lng.toString());

        if (imageUrl) {
            formData.set("imageUrl", imageUrl);
        }

        formData.set("postId", post.id);

        startTransition(() => {
            updatePost(post.id, formData).catch((err) => {
                console.error("Error:", err);
            });
        });
    };

    const [imageUrl, setImageUrl] = useState<string | null>(
        post.imageUrl ?? null
    );

    if (loadError) {
        return (
            <div className="flex items-center justify-center h-screen text-red-600 text-lg font-semibold">
                Error fetching the API
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-700 text-xl font-semibold">
                Loading…
            </div>
        );
    }
    return (
        <div className="max-w-lg mx-auto mt-10 flex flex-col gap-8">
            <Card>
                <CardHeader className="font-bold">Edit Post</CardHeader>
                <CardContent>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label
                                htmlFor=""
                                className="block font-medium text-gray-700 mb-1"
                            >
                                Place Name
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={post.title}
                                placeholder="Abbey Road..."
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Address
                                <span className="text-red-500">*</span>
                            </label>

                            <AddressInput
                                onSelectAddress={handleAddressSelect}
                                initialAddress={post.location.address}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor=""
                                className="block font-medium text-gray-700 mb-1"
                            >
                                Visited On
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={
                                    post?.date
                                        ? post.date.toISOString().split("T")[0]
                                        : ""
                                }
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor=""
                                className="block font-medium text-gray-700 mb-1"
                            >
                                My Experience
                            </label>
                            <textarea
                                defaultValue={post?.content ?? ""}
                                name="description"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label>Place Image</label>

                            {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    alt="Image Preview"
                                    className="w-full mb-4 object-cover rounded-xl"
                                    width={300}
                                    height={200}
                                />
                            )}
                            <UploadButton
                                endpoint="imageUploader"
                                content={{ button: <div>Change Image</div> }}
                                onClientUploadComplete={(res) => {
                                    if (
                                        res &&
                                        res.length > 0 &&
                                        res[0].ufsUrl
                                    ) {
                                        setImageUrl(res[0].ufsUrl);
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    console.error("Upload error: ", error);
                                }}
                            />
                        </div>

                        <div className="flex flex-col justify-center gap-3 items-center">
                            <Button
                                variant="customIndigo"
                                type="submit"
                                className="font-bold w-full"
                                disabled={isPending}
                            >
                                <RefreshCw />
                                {isPending ? "Updating..." : "Update"}
                            </Button>
                            <Link href={`/posts/${post.id}`} className="w-full">
                                <Button
                                    className="font-bold border w-full border-indigo-900 cursor-pointer bg-white hover:brightness-90"
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
