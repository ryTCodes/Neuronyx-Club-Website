"use client";

import { useCallback, useEffect, useState } from "react";

import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminLayout from "@/components/AdminLayout";
import EventForm from "@/components/EventForm";

import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "@/lib/eventService";

import type { Event } from "@/types/event";

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] =
    useState<Event | null>(null);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();

      setEvents(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        const data = await getEvents();
        if (!ignore) {
          setEvents(data);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError("Failed to load events.");
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
    event: Omit<Event, "id" | "createdAt" | "updatedAt">
  ) {
    try {
      setError("");

      await createEvent(event);

      setShowForm(false);
      await loadEvents();
    } catch (error) {
      console.error(error);
      setError("Failed to create event.");
    }
  }

  async function handleUpdate(
    event: Omit<Event, "id" | "createdAt" | "updatedAt">
  ) {
    if (!editingEvent) return;

    try {
      setError("");

      await updateEvent(editingEvent.id, event);

      setEditingEvent(null);
      setShowForm(false);

      await loadEvents();
    } catch (error) {
      console.error(error);
      setError("Failed to update event.");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteEvent(id);

      await loadEvents();
    } catch (error) {
      console.error(error);
      setError("Failed to delete event.");
    }
  }

  function handleEdit(event: Event) {
    setEditingEvent(event);
    setShowForm(true);
  }

  function handleAdd() {
    setEditingEvent(null);
    setShowForm(true);
  }

  function handleCancel() {
    setEditingEvent(null);
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
                Events
              </h1>

              <p className="mt-1 text-sm text-zinc-400">
                Create, edit and manage NeurOnyx events.
              </p>
            </div>

            {!showForm && (
              <button
                onClick={handleAdd}
                className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                + Add Event
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
              <EventForm
                key={editingEvent?.id ?? "new"}
                initialEvent={editingEvent}
                onSubmit={
                  editingEvent
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
                  Loading events...
                </p>
              ) : events.length === 0 ? (
                /* Empty State */
                <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
                  <h2 className="text-xl font-semibold">
                    No events yet
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    Create your first event to get started.
                  </p>
                </div>
              ) : (
                /* Events List */
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
                    >
                      {/* Event Image */}
                      {event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-48 sm:h-64 w-full object-cover"
                        />
                      )}

                      {/* Event Content */}
                      <div className="p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                          <div>
                            {/* Title + Status */}
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="text-xl font-semibold">
                                {event.title}
                              </h2>

                              <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                                {event.status}
                              </span>
                            </div>

                            {/* Date + Location */}
                            <p className="mt-2 text-sm text-zinc-500">
                              {event.date} · {event.location}
                            </p>

                            {/* Description */}
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                              {event.description}
                            </p>

                            {/* Tags */}
                            {event.tags.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {event.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={() =>
                                handleEdit(event)
                              }
                              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(event.id)
                              }
                              className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:bg-red-950/40"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
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