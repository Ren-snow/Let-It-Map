"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import BaseMap from "@/components/map/BaseMap";
import { Post, Location } from "@prisma/client";
import { Session } from "next-auth";

type MapClientProps = {
    posts: (Post & { location: Location })[];
    session: Session | null;
};

export default function MapClient({ posts, session }: MapClientProps) {
    const [selectedPosts, setSelectedPosts] = useState<
        (Post & { location: Location })[]
    >([]);
    const [mapCenter, setMapCenter] = useState(
        posts.length > 0
            ? { lat: posts[0].location.lat, lng: posts[0].location.lng }
            : { lat: 53.405471, lng: -2.979881 }
    );
    return (
        <div className="space-y-6 container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Map</h1>
                {session && (
                    <>
                        <Link href={"/posts/new"}>
                            <Button variant="customIndigo">
                                <Plus />
                                Add Your Post
                            </Button>
                        </Link>
                    </>
                )}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Click on a marker to view posts from that location.
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        {posts.length === 0
                            ? "No posts yet."
                            : `Total posts: ${posts.length}`}
                    </p>
                </CardContent>
            </Card>
            <div>
                <BaseMap
                    center={mapCenter} 
                    zoom={12}
                    posts={posts}
                    onMarkerClick={(postsAtMarker) => {
                        setMapCenter({
                            lat: postsAtMarker.location.lat,
                            lng: postsAtMarker.location.lng,
                        });
                        setSelectedPosts(
                            posts.filter(
                                (p) =>
                                    p.location.lat ===
                                        postsAtMarker.location.lat &&
                                    p.location.lng ===
                                        postsAtMarker.location.lng
                            )
                        );
                    }}
                />
                {selectedPosts.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Posts at this address ({selectedPosts.length})
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedPosts.map((post) => (
                                <Link key={post.id} href={`/posts/${post.id}?from=map`}>
                                    <Card className="h-full hover:shadow-md transition">
                                        <CardHeader className="line-clamp-2 font-semibold">
                                            {post.title}
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-500 line-clamp-3 mb-2">
                                                {post.location.address}
                                            </p>
                                            <p className="text-sm text-gray-500 line-clamp-1">
                                                {`Date: ${
                                                    post.date
                                                        ? new Date(
                                                              post.date
                                                          ).toLocaleDateString()
                                                        : new Date(
                                                              post.createdAt
                                                          ).toLocaleDateString()
                                                }`}
                                            </p>
                                            <p className="text-sm text-gray-500 line-clamp-1">
                                                User ID: {post.userId}{" "}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
