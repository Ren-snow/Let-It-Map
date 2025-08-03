"use client";

import { Post, Location } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { FilePenLine } from "lucide-react";

interface PostWithLocation extends Post {
  location: Location;
}
interface PostPageClientProps {
    post: PostWithLocation;
}
// interface PostPageClientProps {
//     post: Post;
// }

export default function PostPageClient({ post }: PostPageClientProps) {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {post.imageUrl && (
                <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        className="object-cover"
                        fill
                        priority
                    />
                </div>
            )}
            <div className="bg-white shadow rounded-lg p-6 flex flex-col gap-8">
              <div className="rounded-lg flex flex-row justify-between items-start">
                <div className="text-4xl font-extrabold text-gray-900 mb-2 md:mb-0">
                    <h1 className="mb-2 line-clamp-3">{post.title}</h1>
                    <div className="flex items-center text-lg font-medium text-gray-500">
                        <div className="text-base font-medium text-gray-500">
                            {post.date ? (
                                <>
                                    <p>{`Visited on: ${new Date(
                                        post.date
                                    ).toLocaleDateString()}`}</p>
                                    <p>{`Created on: ${new Date(
                                        post.createdAt
                                    ).toLocaleDateString()}`}</p>
                                </>
                            ) : (
                                <p>{`Created on: ${new Date(
                                    post.createdAt
                                ).toLocaleDateString()}`}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <Link href={`/posts/${post.id}`}>
                        <Button variant="customIndigo">
                            <FilePenLine />
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col items-start justify-between gap-3">
                <div className="flex flex-col items-start justify-between">
                    <h2 className="font-bold text-lg">Address</h2>
                    <p>{post.location?.address}</p>
                </div>
                {post.content && (
                    <div className="flex flex-col items-start justify-between">
                        <h2 className="font-bold text-lg">Your Comment</h2>
                        <p>{post.content}</p>
                    </div>
                )}
            </div>
            </div>
            
        </div>
    );
}
