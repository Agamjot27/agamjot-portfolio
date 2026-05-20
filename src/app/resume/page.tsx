import { redirect } from "next/navigation";

export default function ResumeRedirect() {
  redirect("/search?q=resume");
}
