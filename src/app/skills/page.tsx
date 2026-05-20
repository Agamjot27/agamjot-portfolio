import { redirect } from "next/navigation";

export default function SkillsRedirect() {
  redirect("/search?q=skills");
}
