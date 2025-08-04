"use client";

import AddressInput from "@/components/map/AddressInput";
import MapSelector from "@/components/map/MapSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createPost } from "@/lib/actions/create-post";
import { UploadButton } from "@/lib/upload-thing";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import Image from "next/image";
import { useState, useTransition } from "react";

const libraries: Libraries = ["places"];

export default function NewPost() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries,
    });

    const [selectedLocation, setSelectedLocation] = useState<{
        address: string;
        lat: number;
        lng: number;
    } | null>(null);

    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    if (loadError)
        return (
            <div className="flex items-center justify-center h-screen text-red-600 text-lg font-semibold">
                Error loading the map
            </div>
        );

    if (!isLoaded)
        return (
            <div className="flex items-center justify-center h-screen text-gray-700 text-xl font-semibold">
                Loading map…
            </div>
        );

    const handleAddressSelect = (address: string, lat: number, lng: number) => {
        setSelectedLocation({ address, lat, lng });
    };

    return (
        <div className="max-w-lg mx-auto mt-10 flex flex-col gap-8">
            <MapSelector selectedLocation={selectedLocation} />
            <Card>
                <CardHeader className="font-bold">New Post</CardHeader>
                <CardContent>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);

                            if (imageUrl) formData.append("imageUrl", imageUrl);
                            if (selectedLocation) {
                                formData.set(
                                    "address",
                                    selectedLocation.address
                                ); 
                                formData.set(
                                    "lat",
                                    selectedLocation.lat.toString()
                                );
                                formData.set(
                                    "lng",
                                    selectedLocation.lng.toString()
                                );
                            }
                            startTransition(() => {
                                createPost(formData); 
                            });
                        }}
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
                                onClientUploadComplete={(res) => {
                                    if (res && res[0].ufsUrl) {
                                        setImageUrl(res[0].ufsUrl);
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    console.error("Upload error: ", error);
                                }}
                            />
                        </div>

                        <Button
                            variant="customIndigo"
                            type="submit"
                            className="font-bold"
                            disabled={isPending}
                        >
                            {isPending ? "Posting..." : "Post"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
