import SearchController from "@/components/search/SearchController";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results - Agamjot Singh Portfolio Index",
  description: "Dynamic query results matching Agamjot's technical competencies, experience, and academic record.",
};

export default function SearchPage() {
  return <SearchController />;
}
