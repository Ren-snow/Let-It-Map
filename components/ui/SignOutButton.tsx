"use client";

import { logout } from "@/lib/auth-actions";

export default function SignOutButton() {
    return (
        <button
            className="bg-white text-indigo-900 font-bold p-2 rounded-sm cursor-pointer transition border border-white hover:bg-indigo-900 hover:text-white"
            onClick={logout}
        >
            Sign Out
        </button>
    );
}
