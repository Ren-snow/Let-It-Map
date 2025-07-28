import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import SignInButton from "@/components/ui/SignInButton";
import Link from "next/link";

export default async function PostsPage() {
    const session = await auth();
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
            <div>
                <h1>Dashboard</h1>
                <Link href={'/posts/new'}>
                    <Button variant="customIndigo">
                        New Post
                    </Button>
                </Link>
            </div>
        </div>
    );
}
