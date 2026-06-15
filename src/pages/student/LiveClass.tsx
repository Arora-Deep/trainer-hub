import { Navigate } from "react-router-dom";
import { useMeetingStore, CURRENT_STUDENT_ID, CURRENT_STUDENT_BATCH_ID } from "@/stores/meetingStore";

/**
 * Legacy /student/live-class route — redirects to the user's current live
 * meeting (if any), else to the next upcoming one, else to the schedule.
 * The proper meeting experience lives at /student/meeting/:id.
 */
export default function StudentLiveClass() {
  const live = useMeetingStore((s) => s.getLiveNowForStudent(CURRENT_STUDENT_ID, CURRENT_STUDENT_BATCH_ID));
  const next = useMeetingStore((s) => s.getUpNextForStudent(CURRENT_STUDENT_ID, CURRENT_STUDENT_BATCH_ID));
  const target = live ?? next;
  return <Navigate to={target ? `/student/meeting/${target.id}` : "/student/schedule"} replace />;
}
