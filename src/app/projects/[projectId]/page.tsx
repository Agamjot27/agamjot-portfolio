import { notFound } from "next/navigation";
import { projects } from "@/data/portfolioData";
import ProjectExperience from "@/components/projects/ProjectExperience";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    projectId: project.id,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    notFound();
  }

  return <ProjectExperience project={project} />;
}
