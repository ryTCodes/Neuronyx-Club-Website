"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import { uploadImage } from "@/lib/imageUpload";
import type { TeamMember } from "@/types/team";

interface TeamMemberFormProps {
  initialMember?: TeamMember | null;
  onSubmit: (
    member: Omit<TeamMember, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel?: () => void;
}

export default function TeamMemberForm({
  initialMember,
  onSubmit,
  onCancel,
}: TeamMemberFormProps) {
  const [name, setName] = useState(initialMember?.name ?? "");
  const [role, setRole] = useState<TeamMember["role"]>(
    initialMember?.role ?? "Member"
  );

  const [team, setTeam] = useState<TeamMember["Team"] | "">(
    initialMember?.Team ?? ""
  );

  const executiveTeams = [
    "PRESIDENT",
    "VICE PRESIDENT",
    "SECRETARY",
    "TREASURER",
    "JOINT TREASURER",
  ] as const;

  const getRoleOptions = (
    selectedTeam: TeamMember["Team"] | ""
  ): TeamMember["role"][] => {
    if (
      selectedTeam &&
      executiveTeams.includes(selectedTeam as (typeof executiveTeams)[number])
    ) {
      return [
        "President",
        "Vice President",
        "Secretary",
        "Treasurer",
        "Joint Treasurer",
      ];
    }

    return ["Lead", "Member"];
  };

  const imageUrl = initialMember?.imageUrl ?? "";
  const [imageFile, setImageFile] =
    useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [linkedin, setLinkedin] = useState(initialMember?.linkedin ?? "");
  const [github, setGithub] = useState(initialMember?.github ?? "");

  const [teamError, setTeamError] = useState("");
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

    if (!team) {
      setTeamError("Please select a team.");
      return;
    }

    setTeamError("");
    setLoading(true);

    try {
      let finalImageUrl = imageUrl.trim();

      if (imageFile) {
        finalImageUrl = await uploadImage(
          imageFile,
          "team"
        );
      }

      await onSubmit({
        name: name.trim(),
        role,
        Team: team,
        imageUrl: finalImageUrl,
        linkedin: linkedin.trim() || undefined,
        github: github.trim() || undefined,
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
          {initialMember
            ? "Edit Team Member"
            : "Add Team Member"}
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          {initialMember
            ? "Update the team member details."
            : "Add a new NeurOnyx team member."}
        </p>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
        >
          Name
        </label>

        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        />
      </div>

      {/* Role + Team */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium"
          >
            Role
          </label>

          <select
            id="role"
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value as TeamMember["role"]
              )
            }
            className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
          >
            {getRoleOptions(team).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Team */}
        <div>
          <label
            htmlFor="team"
            className="mb-2 block text-sm font-medium"
          >
            Team
          </label>

          <select
            id="team"
            value={team}
            onChange={(e) => {
              const nextTeam = e.target.value as TeamMember["Team"];
              setTeam(nextTeam);
              setTeamError("");

              const nextRoleOptions = getRoleOptions(nextTeam);
              if (!nextRoleOptions.includes(role)) {
                setRole(nextRoleOptions[0]);
              }
            }}
            required
            className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
          >
            <option value="" disabled>
              Select Team
            </option>

            <option value="HOD CSE AIML">
              HOD CSE AIML
            </option>

            <option value="FACULTY CO-ORDINATOR">
              FACULTY CO-ORDINATOR
            </option>

            <option value="PRESIDENT">
              PRESIDENT
            </option>

            <option value="VICE PRESIDENT">
              VICE PRESIDENT
            </option>

            <option value="SECRETARY">
              SECRETARY
            </option>

            <option value="TREASURER">
              TREASURER
            </option>

            <option value="JOINT TREASURER">
              JOINT TREASURER
            </option>

            <option value="TECHNICAL">
              TECHNICAL
            </option>

            <option value="DESIGN">
              DESIGN
            </option>

            <option value="DATA">
              DATA
            </option>

            <option value="MEDIA">
              MEDIA
            </option>
          </select>

          {teamError && (
            <p className="mt-2 text-sm text-red-400">
              {teamError}
            </p>
          )}
        </div>
      </div>

      {/* Profile Image */}
      <div>
        <label
          htmlFor="image"
          className="mb-2 block text-sm font-medium"
        >
          Profile Image
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

        {/* Image Preview */}
        {(imagePreview || imageUrl) && (
          <div className="mt-5">
            <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500">
              Image Preview
            </p>

            <div className="flex items-center gap-4">
              <img
                src={imagePreview || imageUrl}
                alt="Team member preview"
                className="h-32 w-32 rounded-full border border-zinc-800 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div>
                <p className="text-sm text-zinc-400">
                  {imageFile
                    ? "New image selected"
                    : "Current profile image"}
                </p>

                {imageFile && (
                  <p className="mt-1 text-xs text-zinc-600">
                    The image will be uploaded when you save.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LinkedIn */}
      <div>
        <label
          htmlFor="linkedin"
          className="mb-2 block text-sm font-medium"
        >
          LinkedIn URL
        </label>

        <input
          id="linkedin"
          type="url"
          value={linkedin}
          onChange={(e) =>
            setLinkedin(e.target.value)
          }
          placeholder="https://linkedin.com/in/..."
          className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        />
      </div>

      {/* GitHub */}
      <div>
        <label
          htmlFor="github"
          className="mb-2 block text-sm font-medium"
        >
          GitHub URL
        </label>

        <input
          id="github"
          type="url"
          value={github}
          onChange={(e) =>
            setGithub(e.target.value)
          }
          placeholder="https://github.com/..."
          className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-white"
        />
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
            : initialMember
              ? "Update Member"
              : "Create Member"}
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