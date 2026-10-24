"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import {
  createPostAction,
  type CreatePostState,
} from "@/server/post/actions";
import { Modal } from "@/components/ui/Modal";
import { PlaceAutocompleteInput } from "./PlaceAutocompleteInput";
import type { PlaceDetails } from "@/hooks/usePlacePredictions";

export function CreatePostForm({
  initialPlace,
}: {
  initialPlace?: PlaceDetails | null;
}) {
  const [state, formAction, isPending] = useActionState<
    CreatePostState,
    FormData
  >(createPostAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<{
    title: string;
    description: string;
    locationName: string;
    locationAddress: string;
  } | null>(null);
  const confirmed = useRef(false);

  // After a rejected submit, restore the place the user had already picked
  // instead of making them search for it again.
  const seededPlace: PlaceDetails | null = state?.values?.placeId
    ? {
        placeId: state.values.placeId,
        name: state.values.locationName,
        address: state.values.locationAddress,
        lat: Number(state.values.latitude),
        lng: Number(state.values.longitude),
      }
    : (initialPlace ?? null);

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={(e) => {
          // Allow submit only after user confirms in the modal
          if (confirmed.current) {
            confirmed.current = false;
            return;
          }
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          setPreview({
            title: fd.get("title") as string,
            description: fd.get("description") as string,
            locationName: fd.get("locationName") as string,
            locationAddress: fd.get("locationAddress") as string,
          });
        }}
        className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        {state?.error && (
          <div className="mb-6 rounded-xl bg-accent-light px-4 py-3 text-sm text-accent">
            {state.error}
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
              defaultValue={state?.values?.title}
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
              defaultValue={state?.values?.description}
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
              defaultValue={state?.values?.locationName}
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
              defaultValue={state?.values?.locationAddress}
              placeholder="e.g. 3 Abbey Road, St John's Wood, London NW8 9AY"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-faint transition-colors focus:border-accent focus:outline-none"
            />
          </div> */}

          <PlaceAutocompleteInput initialPlace={seededPlace} />
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
            disabled={isPending}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? "Creating..." : "Create Post"}
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
                  {preview.locationName}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Location Address</dt>
                <dd className="mt-0.5 text-muted">
                  {preview.locationAddress || "-"}
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
                  setPreview(null);
                  confirmed.current = true;
                  formRef.current?.requestSubmit();
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
