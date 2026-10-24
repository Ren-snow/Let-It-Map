"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { Modal } from "@/components/ui/Modal";
import { PlaceAutocompleteInput } from "./PlaceAutocompleteInput";
import type { PlaceDetails } from "@/hooks/usePlacePredictions";

type Draft = {
  title: string;
  description: string;
  location: {
    placeId: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
};

function readDraft(form: HTMLFormElement): Draft {
  const fd = new FormData(form);
  const value = (name: string) => String(fd.get(name) ?? "");

  return {
    title: value("title"),
    description: value("description"),
    location: {
      placeId: value("placeId"),
      name: value("locationName"),
      address: value("locationAddress"),
      latitude: Number(value("latitude")),
      longitude: Number(value("longitude")),
    },
  };
}

export function CreatePostForm({
  initialPlace,
}: {
  initialPlace?: PlaceDetails | null;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(draft: Draft) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.api.posts.$post({ json: draft });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "Could not create the post");
        return;
      }

      // The feed is a server component, so refresh before navigating to it.
      router.push("/posts");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPreview(readDraft(e.currentTarget));
        }}
        className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        {error && (
          <div className="mb-6 rounded-xl bg-accent-light px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Abbey Road Studios"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              maxLength={2000}
              rows={5}
              placeholder="Share your experience at this place..."
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent focus:outline-none resize-none"
            />
          </div>

          {/* Location Name */}
          {/* <div>
            <label
              htmlFor="locationName"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Location Name
            </label>
            <input
              id="locationName"
              name="locationName"
              type="text"
              required
              placeholder="e.g. Abbey Road, London"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent focus:outline-none"
            />
          </div> */}

          {/* Location Address */}
          {/* <div>
            <label
              htmlFor="locationAddress"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Address
              <span className="ml-1.5 text-faint font-normal">(optional)</span>
            </label>
            <input
              id="locationAddress"
              name="locationAddress"
              type="text"
              placeholder="e.g. 3 Abbey Road, St John's Wood, London NW8 9AY"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent focus:outline-none"
            />
          </div> */}

          <PlaceAutocompleteInput initialPlace={initialPlace ?? null} />
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <Link
            href="/posts"
            className="rounded-xl px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-foreground/5 active:scale-[0.98]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>

      {preview && (
        <Modal onClose={() => setPreview(null)}>
          <div className="px-8 py-10">
            <h3 className="font-serif text-xl tracking-tight text-foreground text-center">
              Confirm Post
            </h3>
            <p className="mt-2 text-sm text-muted text-center">
              Please review your post before publishing.
            </p>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-foreground">Title</dt>
                <dd className="mt-0.5 text-muted">{preview.title}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Description</dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-muted">
                  {preview.description}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Location Name</dt>
                <dd className="mt-0.5 text-muted">
                  {preview.location.name}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Location Address</dt>
                <dd className="mt-0.5 text-muted">
                  {preview.location.address || "-"}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-xl px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-foreground/5 active:scale-[0.98]"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  const draft = preview;
                  setPreview(null);
                  void submit(draft);
                }}
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/25 active:scale-[0.98]"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
