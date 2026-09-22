"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import { uploadImage } from "@/lib/imageUpload";
import type { Event } from "@/types/event";

interface EventFormProps {
  initialEvent?: Event | null;
  onSubmit: (
    event: Omit<Event, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel?: () => void;
}

export default function EventForm({
  initialEvent,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [date, setDate] = useState(initialEvent?.date ?? "");
  const [duration, setDuration] = useState(initialEvent?.duration ?? "");
  const [description, setDescription] = useState(
    initialEvent?.description ?? ""
  );
  const [tags, setTags] = useState(initialEvent?.tags.join(", ") ?? "");
  const [status, setStatus] = useState<Event["status"]>(
    initialEvent?.status ?? "upcoming"
  );
  const [location, setLocation] = useState(initialEvent?.location ?? "");

  const imageUrl = initialEvent?.imageUrl ?? "";
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [redirectUrl, setRedirectUrl] = useState(
    initialEvent?.redirectUrl ?? ""
  );
  const [socialLinks, setSocialLinks] = useState(
    initialEvent?.socialLinks.join("\n") ?? ""
  );

  const [loading, setLoading] = useState(false);

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);

    try {
      let finalImageUrl = imageUrl.trim();

      if (imageFile) {
        finalImageUrl = await uploadImage(
          imageFile,
          "events"
        );
      }

      await onSubmit({
        title: title.trim(),
        date: date.trim(),
        duration: duration.trim(),
        description: description.trim(),

        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        status,
        location: location.trim(),

        imageUrl: finalImageUrl,

        redirectUrl: redirectUrl.trim(),

        socialLinks: socialLinks
          .split("\n")
          .map((link) => link.trim())
          .filter(Boolean),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">
          {initialEvent ? "Edit Event" : "Add Event"}
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          {initialEvent
            ? "Update the event details."
            : "Create a new NeurOnyx event."}
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        />
      </div>

      {/* Date + Duration */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Date
          </label>

          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="15 September 2026"
            required
            className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Duration
          </label>

          <input
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            placeholder="2 hours"
            required
            className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={5}
          required
          className="w-full resize-none rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Tags
        </label>

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="AI, Workshop, Competition"
          className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        />

        <p className="mt-1 text-xs text-zinc-600">
          Separate tags with commas.
        </p>
      </div>

      {/* Status */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Status
        </label>

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as Event["status"]
            )
          }
          className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        >
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Location
        </label>

        <input
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          required
          className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        />
      </div>

      {/* Event Image */}
      <div>
        <label
          htmlFor="image"
          className="mb-2 block text-sm font-medium"
        >
          Event Image
        </label>

        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full cursor-pointer rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-400 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-zinc-200"
        />

        <p className="mt-2 text-xs text-zinc-600">
          JPG, PNG, WEBP. Maximum 5MB.
        </p>

        {(imagePreview || imageUrl) && (
          <div className="mt-5">
            <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500">
              Image Preview
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={imagePreview || imageUrl}
                alt="Event preview"
                className="h-48 w-full rounded-lg border border-zinc-800 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

              {imageFile && (
                <p className="text-sm text-zinc-500">
                  New image selected. It will be uploaded
                  when you save the event.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Redirect URL */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Redirect URL
        </label>

        <input
          type="url"
          value={redirectUrl}
          onChange={(e) =>
            setRedirectUrl(e.target.value)
          }
          placeholder="https://..."
          className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        />
      </div>

      {/* Social Links */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Social Links
        </label>

        <textarea
          value={socialLinks}
          onChange={(e) =>
            setSocialLinks(e.target.value)
          }
          rows={4}
          placeholder={
            "https://instagram.com/...\nhttps://linkedin.com/..."
          }
          className="w-full resize-none rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        />

        <p className="mt-1 text-xs text-zinc-600">
          One URL per line.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading
            ? imageFile
              ? "Uploading..."
              : "Saving..."
            : initialEvent
              ? "Update Event"
              : "Create Event"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}