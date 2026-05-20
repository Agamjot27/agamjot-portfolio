import SearchController from "@/components/search/SearchController";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agamjot Singh | AI & Frontend Engineer Search",
  description: "Search for Agamjot Singh's projects, experience, skills, and resume in a Google-style interactive portfolio search engine.",
  openGraph: {
    title: "Agamjot Singh | AI & Frontend Engineer Search",
    description: "Search for Agamjot's computer vision and web engineering projects.",
    type: "website",
  }
};

export default function Home() {
  return <SearchController />;
}
