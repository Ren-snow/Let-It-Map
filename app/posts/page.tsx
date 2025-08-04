import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInButton from "@/components/ui/SignInButton";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PostsPage() {
    const session = await auth();
    const posts = await prisma.post.findMany({
        include: {
            location: true,
        },
        where: {
            userId: session?.user?.id,
        },
    });

    const sortedPosts = [...posts].sort((a, b) => {
        const dateA = new Date(a.date ?? a.createdAt).getTime();
        const dateB = new Date(b.date ?? b.createdAt).getTime();
        return dateB - dateA;
    });

    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
                Please Sign In.
                <SignInButton />
            </div>
        );
    }
    return (
        <div className="space-y-6 container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Post List</h1>
                <Link href={"/posts/new"}>
                    <Button variant="customIndigo">New Post</Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome back, {session.user?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        {posts.length === 0
                            ? "Let's visit a Beatles spot and create your first post!"
                            : `Total posts: ${posts.length}`}
                    </p>
                </CardContent>
            </Card>
            <div>
                <h2 className="text-xl font-semibold mb-4">All Your Posts</h2>
                {posts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <h3 className="text-xl font-medium mb-2">
                                No posts yet.
                            </h3>
                            <p className="text-center mb-4 max-w-md">
                                Create your first post.
                            </p>
                            <Link href={"/posts/new"}>
                                <Button variant="customIndigo">New Post</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedPosts.slice(0, 6).map((post, key) => (
                            <Link key={key} href={`/posts/${post.id}`}>
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
                )}
            </div>
        </div>
    );
}
