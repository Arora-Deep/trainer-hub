/**
 * BigBlueButton integration placeholder.
 *
 * When the BBB integration goes live, expose the following secrets via
 * Lovable Cloud edge functions:
 *   - BBB_SERVER_URL       e.g. https://bbb.cloudadda.com/bigbluebutton/api
 *   - BBB_SHARED_SECRET    Shared secret from `bbb-conf --secret`
 *
 * The frontend should never see the shared secret — all checksums must
 * be computed inside an edge function. The functions below describe
 * the eventual API surface only; right now they return placeholder URLs.
 */

export interface BBBMeetingRequest {
  meetingId: string;
  name: string;
  attendeePW?: string;
  moderatorPW?: string;
  welcome?: string;
  record?: boolean;
  muteOnStart?: boolean;
  guestPolicy?: "ALWAYS_ACCEPT" | "ASK_MODERATOR";
}

export interface BBBJoinRequest {
  meetingId: string;
  fullName: string;
  role: "moderator" | "viewer";
}

/** Placeholder — wired to an edge function later. */
export function bbbCreateMeetingUrl(_req: BBBMeetingRequest): string {
  return "#bbb-create-pending";
}

/** Placeholder — wired to an edge function later. */
export function bbbJoinUrl(_req: BBBJoinRequest): string {
  return "#bbb-join-pending";
}

export const BBB_INTEGRATION_STATUS = "pending" as const;
