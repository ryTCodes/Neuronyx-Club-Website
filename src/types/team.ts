export interface TeamMember {
  id: string;
  name: string;
  role:
    | "Lead"
    | "Member"
    | "President"
    | "Vice President"
    | "Secretary"
    | "Treasurer"
    | "Joint Treasurer";
  Team:
    | "HOD CSE AIML"
    | "FACULTY CO-ORDINATOR"
    | "PRESIDENT"
    | "VICE PRESIDENT"
    | "SECRETARY"
    | "TREASURER"
    | "JOINT TREASURER"
    | "TECHNICAL"
    | "DESIGN"
    | "DATA"
    | "MEDIA";
  imageUrl: string;
  linkedin?: string;
  github?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}
