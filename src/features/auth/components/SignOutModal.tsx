"use client";

import { handleSignOut } from "@/server/api/actions/auth";
import { Modal } from "@/components/ui/Modal";

export function SignOutModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center gap-6 px-8 py-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-light text-accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3h-9m9 0-3-3m3 3-3 3"
            />
          </svg>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">Sign Out</h2>
          <p className="mt-1.5 text-sm text-muted">
            Are you sure you want to sign out?
          </p>
        </div>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSignOut()}
            className="flex-1 cursor-pointer rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Sign Out
          </button>
        </div>
      </div>
    </Modal>
  );
}
