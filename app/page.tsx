import React from "react";
import { Map as MapIcon, BookOpenText, PenLine } from "lucide-react";
import { auth } from "@/auth";
import SignInButton from "@/components/ui/SignInButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <section className="relative bg-gradient-to-b from-white to-blue-50 py-20 md:py-32">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Let It Map, <br />
                                and Share Your Journey
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-8">
                                Post legendary spots, explore fan experiences,
                                and get inspired for your next pilgrimage.
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1440 320"
                            className="w-full h-24"
                            preserveAspectRatio="none"
                        >
                            <path
                                fill="white"
                                d="M0,160 C480,320 960,0 1440,160 L1440,320 L0,320 Z"
                            ></path>
                        </svg>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Many Ways to Explore
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-6 rounded-lg border border-gray-100 shadow-sm bg-white">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                    <MapIcon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Explore the Map
                                </h3>
                                <p className="text-gray-600">
                                    Find Beatles landmarks around the world and
                                    see where history was made.
                                </p>
                            </div>
                            <div className="p-6 rounded-lg border border-gray-100 shadow-sm bg-white">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                                    <BookOpenText className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Read Fans’ Stories
                                </h3>
                                <p className="text-gray-600">
                                    Discover experiences, memories, and
                                    impressions shared by fellow fans.
                                </p>
                            </div>
                            <div className="p-6 rounded-lg border border-gray-100 shadow-sm bg-white">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                    <PenLine className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Share Your Own Journey
                                </h3>
                                <p className="text-gray-600">
                                    Post your favorite Beatles spots and
                                    contribute to the community map.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24 bg-indigo-900">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Come Together on Let It Map
                        </h2>
                        <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
                            Sign in to share your own stories, connect with
                            fans, and leave your mark on the map.
                        </p>
                        {session ? (
                            <>
                                <Link
                                    href={"/posts/new"}
                                    className="hover:text-gray-400 transition-colors"
                                >
                                    <Button className="border border-white bg-white text-indigo-900 cursor-pointer hover:bg-indigo-950 hover:text-white">
                                        Create Your Post
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="flex justify-center">
                                <SignInButton />
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
