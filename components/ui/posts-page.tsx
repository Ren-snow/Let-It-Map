"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Post, Location } from "@prisma/client";

type PostWithLocation = Post & { location: Location };

type Props = {
    posts: PostWithLocation[];
};

export default function PostsPageClient({ posts }: Props) {
    const sortedPosts = [...posts].sort((a, b) => {
        const dateA = new Date(a.date ?? a.createdAt).getTime();
        const dateB = new Date(b.date ?? b.createdAt).getTime();
        return dateB - dateA;
    });

    const [postsSectionNum, setPostsSectionNum] = useState(1);
    const POSTS_PER_PAGE = 6;

    const start = (postsSectionNum - 1) * POSTS_PER_PAGE;
    const end = postsSectionNum * POSTS_PER_PAGE;
    const visiblePosts = sortedPosts.slice(start, end);

    const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

    return (
        <div className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visiblePosts.map((post, key) => (
                    <Link key={key} href={`/posts/${post.id}?from=posts`}>
                        <Card className="h-full hover:shadow-md transition">
                            <CardHeader className="line-clamp-1 font-semibold">
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
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
            {sortedPosts.length >= 6 && (
                <div className="w-full flex justify-center gap-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPostsSectionNum(i + 1)}
                            className="cursor-pointer px-2 py-1 rounded bg-indigo-900 text-white shadow-none "
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
