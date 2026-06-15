/**
 * BigBlueButton integration placeholder.
 *
 * When the BBB integration goes live, expose the following secrets via
 * Lovable Cloud edge functions:
 *   - BBB_SERVER_URL       e.g. https://bbb.cloudadda.com/bigbluebutton/api
 *   - BBB_SHARED_SECRET    Shared secret from `bbb-conf --secret`
 *
 * Edge functions to add later:
 *   - bbb-create     POST  → creates a meeting on the BBB server
 *   - bbb-join       GET   → returns signed join URL for a user
 *   - bbb-end        POST  → forcibly ends a meeting
 *   - bbb-recordings GET   → lists / deletes recordings
 *
 * Until then, every helper here returns a mock URL or a placeholder.
 * Nothing in the UI talks to a real server.
 */

export interface BBBCreateRequest {
  meetingId: string;
  name: string;
  attendeePW?: string;
  moderatorPW?: string;
  welcome?: string;
  record?: boolean;
  muteOnStart?: boolean;
  guestPolicy?: "ALWAYS_ACCEPT" | "ASK_MODERATOR";
  maxParticipants?: number;
  duration?: number;
}

export interface BBBJoinRequest {
  meetingId: string;
  fullName: string;
  role: "moderator" | "viewer";
  userID?: string;
  avatarURL?: string;
}

export interface BBBRecording {
  recordID: string;
  meetingID: string;
  name: string;
  startTime: number;
  endTime: number;
  playbackUrl: string;
}

/** Placeholder — wired to `bbb-create` edge function later. */
export function bbbCreateMeetingUrl(req: BBBCreateRequest): string {
  return `#bbb-create-${req.meetingId}`;
}

/** Placeholder — wired to `bbb-join` edge function later. */
export function bbbJoinUrl(req: BBBJoinRequest): string {
  return `#bbb-join-${req.meetingId}-${req.role}`;
}

/** Placeholder — wired to `bbb-end` edge function later. */
export function bbbEndMeetingUrl(meetingId: string): string {
  return `#bbb-end-${meetingId}`;
}

/** Placeholder — wired to `bbb-recordings` edge function later. */
export function bbbRecordingsUrl(meetingId: string): string {
  return `#bbb-recordings-${meetingId}`;
}

export const BBB_INTEGRATION_STATUS = "pending" as const;
