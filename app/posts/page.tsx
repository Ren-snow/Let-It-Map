import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import SignInButton from "@/components/ui/SignInButton";

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
                <Button className="bg-indigo-900 text-white cursor-pointer">New Post</Button>
            </div>
        </div>
    );
}
