"use client";

import { useCallback, useEffect, useState } from "react";

import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import TeamMemberForm from "@/components/TeamMemberForm";

import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
  updateTeamMember,
} from "@/lib/teamService";

import type { TeamMember } from "@/types/team";

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] =
    useState<TeamMember | null>(null);
  const [error, setError] = useState("");

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTeamMembers();

      setMembers(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        const data = await getTeamMembers();
        if (!ignore) {
          setMembers(data);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError("Failed to load team members.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreate(
    member: Omit<TeamMember, "id" | "createdAt" | "updatedAt">
  ) {
    try {
      setError("");

      await createTeamMember(member);

      setShowForm(false);
      await loadMembers();
    } catch (error) {
      console.error(error);
      setError("Failed to create team member.");
    }
  }

  async function handleUpdate(
    member: Omit<TeamMember, "id" | "createdAt" | "updatedAt">
  ) {
    if (!editingMember) return;

    try {
      setError("");

      await updateTeamMember(editingMember.id, member);

      setEditingMember(null);
      setShowForm(false);

      await loadMembers();
    } catch (error) {
      console.error(error);
      setError("Failed to update team member.");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team member?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteTeamMember(id);

      await loadMembers();
    } catch (error) {
      console.error(error);
      setError("Failed to delete team member.");
    }
  }

  function handleAdd() {
    setEditingMember(null);
    setShowForm(true);
  }

  function handleEdit(member: TeamMember) {
    setEditingMember(member);
    setShowForm(true);
  }

  function handleCancel() {
    setEditingMember(null);
    setShowForm(false);
  }

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#38BDF8] font-bold">
                Content Management
              </p>

              <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Team Members
              </h1>

              <p className="mt-1 text-sm text-zinc-400">
                Create, edit and manage NeurOnyx team members.
              </p>
            </div>

            {!showForm && (
              <button
                onClick={handleAdd}
                className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                + Add Member
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          {showForm ? (
            <div className="mt-8 max-w-3xl">
              <TeamMemberForm
                key={editingMember?.id ?? "new"}
                initialMember={editingMember}
                onSubmit={
                  editingMember
                    ? handleUpdate
                    : handleCreate
                }
                onCancel={handleCancel}
              />
            </div>
          ) : (
            <div className="mt-8">
              {/* Loading */}
              {loading ? (
                <p className="text-zinc-500">
                  Loading team members...
                </p>
              ) : members.length === 0 ? (
                /* Empty State */
                <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
                  <h2 className="text-xl font-semibold">
                    No team members yet
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    Add your first team member to get started.
                  </p>
                </div>
              ) : (
                /* Team Members */
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
                    >
                      {/* Member Header */}
                      <div className="flex items-start gap-4">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="h-20 w-20 shrink-0 rounded-full border border-zinc-800 object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-xs text-zinc-600">
                            No Image
                          </div>
                        )}

                        <div className="min-w-0">
                          <h2 className="text-xl font-semibold">
                            {member.name}
                          </h2>

                          <p className="mt-1 text-sm text-zinc-400">
                            {member.role}
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            {member.Team}
                          </p>
                        </div>
                      </div>

                      {/* Social Links */}
                      {(member.linkedin || member.github) && (
                        <div className="mt-5 flex flex-wrap gap-3">
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-zinc-400 transition hover:text-white"
                            >
                              LinkedIn
                            </a>
                          )}

                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-zinc-400 transition hover:text-white"
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-6 flex gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(member.id)
                          }
                          className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:bg-red-950/40"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}