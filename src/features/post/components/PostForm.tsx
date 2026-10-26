"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { PlaceAutocompleteInput } from "./PlaceAutocompleteInput";
import type { PlaceDetails } from "@/hooks/usePlacePredictions";

export type PostDraft = {
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

/** Editing never changes the place, so the form shows it read-only instead. */
export type PlaceField =
  | { editable: true; initial: PlaceDetails | null }
  | { editable: false; name: string; address: string };

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent focus:outline-none";
const label = "mb-1.5 block text-sm font-medium text-foreground";

function readDraft(form: HTMLFormElement): PostDraft {
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

export function PostForm({
  place,
  initialValues,
  submitLabel,
  pendingLabel,
  cancelHref,
  onSubmit,
}: {
  place: PlaceField;
  initialValues?: { title: string; description: string };
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
  /** Resolves to an error message, or null when it worked. */
  onSubmit: (draft: PostDraft) => Promise<string | null>;
}) {
  const [preview, setPreview] = useState<PostDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeLabel = place.editable
    ? { name: place.initial?.name ?? "", address: place.initial?.address ?? "" }
    : { name: place.name, address: place.address };

  async function submit(draft: PostDraft) {
    setIsSubmitting(true);
    setError(null);
    setError(await onSubmit(draft));
    setIsSubmitting(false);
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
          <div>
            <label htmlFor="title" className={label}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={100}
              defaultValue={initialValues?.title}
              placeholder="e.g. Abbey Road Studios"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="description" className={label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              maxLength={2000}
              rows={5}
              defaultValue={initialValues?.description}
              placeholder="Share your experience at this place..."
              className={`${field} resize-none`}
            />
          </div>

          {place.editable ? (
            <PlaceAutocompleteInput initialPlace={place.initial} />
          ) : (
            <div>
              <span className={label}>Location</span>
              <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-alt px-4 py-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{place.name}</p>
                  <p className="truncate text-xs text-muted">{place.address}</p>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-faint">
                The place cannot be changed. Create a new post to write about
                somewhere else.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <Link
            href={cancelHref}
            className="rounded-xl px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-foreground/5 active:scale-[0.98]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/25 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? pendingLabel : submitLabel}
          </button>
        </div>
      </form>

      {preview && (
        <Modal onClose={() => setPreview(null)}>
          <div className="px-8 py-10">
            <h3 className="text-center font-serif text-xl tracking-tight text-foreground">
              Confirm Post
            </h3>
            <p className="mt-2 text-center text-sm text-muted">
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
                <dt className="font-medium text-foreground">Location</dt>
                <dd className="mt-0.5 text-muted">
                  {preview.location.name || placeLabel.name || "-"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Address</dt>
                <dd className="mt-0.5 text-muted">
                  {preview.location.address || placeLabel.address || "-"}
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
