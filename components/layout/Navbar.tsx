"use client";

import { Session } from "next-auth";
import Link from "next/link";
import SignOutButton from "../ui/SignOutButton";
import SignInButton from "../ui/SignInButton";

export default function Navbar({ session }: { session: Session | null }) {
    return (
        <nav className="bg-indigo-900 shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-6 lg:px-8">
                <Link href={"/"} className="font-bold text-white">
                    Let It Map
                </Link>
                <div className="flex items-center space-x-4 text-white">
                    <Link
                        href={"/map"}
                        className="hover:text-gray-400 transition-colors"
                    >
                        Map
                    </Link>
                    {session ? (
                        <>
                            <Link
                                href={"/posts"}
                                className="hover:text-gray-400 transition-colors"
                            >
                                Posts
                            </Link>
                            <SignOutButton />
                        </>
                    ) : (
                        <SignInButton />
                    )}
                </div>
            </div>
        </nav>
    );
}
