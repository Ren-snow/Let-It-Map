"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { ReactNode } from "react";
import { useLoadScript, Libraries } from "@react-google-maps/api";
const libraries: Libraries = ["places"];

type Post = {
    id: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    title: string;
};

type Props = {
    center: { lat: number; lng: number };
    zoom?: number;
    height?: string;
    posts?: Post[];
    children?: ReactNode;
    onMarkerClick?: (postsAtMarker: Post[]) => void;
};

function BaseMap({ center, posts = [], children, onMarkerClick }: Props) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries,
    });
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
    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={center}
            zoom={12}
        >
            {posts.map((post) => (
                <Marker
                    key={post.id}
                    position={{
                        lat: post.location.lat,
                        lng: post.location.lng,
                    }}
                    title={post.title}
                    onClick={() => {
                        if (onMarkerClick) {
                            onMarkerClick([post]);
                        }
                    }}
                />
            ))}
            {children}
        </GoogleMap>
    );
}

export default BaseMap;
