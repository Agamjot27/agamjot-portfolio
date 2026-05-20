import { redirect } from "next/navigation";

export default function ProjectsRedirect() {
  redirect("/search?q=projects");
}
