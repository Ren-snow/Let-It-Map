"use client";

import { useState } from "react";
import { loginWithGitHub, loginWithGoogle } from "@/lib/auth-actions";
import { LogIn } from "lucide-react";

export default function SignInButton() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button
                className="flex items-center justify-center gap-2 cursor-pointer bg-white text-indigo-900 font-bold p-2 rounded-sm transition border border-white hover:bg-indigo-900 hover:text-white"
                onClick={() => setIsOpen(true)}
            >
                Sign In
                <LogIn />
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-50/50 flex items-center justify-center z-50 ">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h2 className="text-lg font-bold mb-4 text-center">
                            Sign in
                        </h2>
                        <button
                            className="w-full bg-gray-800 text-white py-2 rounded mb-2 hover:bg-gray-700 flex items-center justify-center gap-2 cursor-pointer"
                            onClick={() => loginWithGitHub()}
                        >
                            Sign in with GitHub
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="w-6 h-6"
                            >
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303   3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61 -.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.084-.729.084-.729   1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.304 3.495.997   .108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93   0-1.31.47-2.38 1.236-3.22-.135-.303-.54-1.523.105-3.176 0 0   1.005-.322 3.3 1.23a11.52 11.52 0 0 1 3-.405c1.02.005   2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23  .645 1.653.24 2.873.12 3.176.765.84 1.23 1.91   1.23 3.22 0 4.61-2.805 5.625-5.475 5.92 .42.36.81 1.096.81 2.215 0 1.6-.015 2.885-.015   3.28 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
                            </svg>
                        </button>
                        <button
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400 flex items-center justify-center gap-2 cursor-pointer"
                            onClick={() => loginWithGoogle()}
                        >
                            Sign in with Google
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 533.5 544.3"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path d="M533.5 278.4c0-18.3-1.6-36-4.7-53.2H272v100.8h146.9c-6.3 34.2-25 63.2-53.3 82.5v68.6h86.1c50.4-46.4 79.8-114.8 79.8-198.7z" />
                                <path d="M272 544.3c72.4 0 133.3-23.9 177.7-64.9l-86.1-68.6c-23.9 16-54.4 25.5-91.6 25.5-70.5 0-130.2-47.5-151.5-111.5H32.4v70.1C76.7 488.3 169.3 544.3 272 544.3z" />
                                <path d="M120.5 326.8c-5.6-16.8-8.8-34.7-8.8-53s3.2-36.2 8.8-53v-70.1H32.4C11.7 196 0 233.5 0 272s11.7 76 32.4 106.8l88.1-52z" />
                                <path d="M272 107.7c39.5-.6 75.1 13.6 103.1 39.8l77.4-77.4C405.1 24.2 344.1 0 272 0 169.3 0 76.7 56 32.4 145.7l88.1 52c21.3-64 81-111.5 151.5-111.5z" />
                            </svg>
                        </button>
                        <button
                            className="mt-4 w-full py-2 rounded text-gray-600 cursor-pointer border border-gray-900 hover:text-gray-900 "
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
}
