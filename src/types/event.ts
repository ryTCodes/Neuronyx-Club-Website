export interface Event {
  id: string;
  title: string;
  date: string;
  duration: string;
  description: string;
  tags: string[];
  status: "upcoming" | "ongoing" | "completed";
  location: string;
  imageUrl: string;
  redirectUrl: string;
  socialLinks: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
}