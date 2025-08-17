import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInButton from "@/components/ui/SignInButton";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import BaseMap from "@/components/map/BaseMap";

export default async function MapPage() {
    const session = await auth();
    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
                Please Sign In.
                <SignInButton />
            </div>
        );
    }
    const posts = await prisma.post.findMany({
        include: {
            location: true,
        },
    });

    return (
        <div className="space-y-6 container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Map</h1>
                <Link href={"/posts/new"}>
                    <Button variant="customIndigo">
                        <Plus />
                        Add Post
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Click on a marker to view posts from that location.</CardTitle>
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
                    center={
                        posts.length > 0
                            ? {
                                  lat: posts[0].location.lat,
                                  lng: posts[0].location.lng,
                              }
                            : { lat: 53.405471, lng: -2.979881 }
                    }
                    zoom={12}
                    posts={posts}
                />
            </div>
        </div>
    );
}
