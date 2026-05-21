import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolioData";
import { ExternalLink, ArrowLeft, Folder, Layers, ShieldCheck, Sparkles } from "lucide-react";

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

  return (
    <main className="page-container py-10">
      <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-theme-secondary">Project details</p>
            <h1 className="text-3xl font-semibold text-theme-primary">{project.title}</h1>
            <p className="mt-2 text-sm text-theme-muted max-w-2xl">{project.description}</p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-theme-custom bg-theme-surface px-4 py-2 text-sm text-theme-primary transition hover:border-theme-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6 rounded-3xl border border-theme-custom bg-theme-elevated p-6 shadow-sm">
            <div className="rounded-3xl border border-theme-custom bg-theme-surface p-6">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-theme-secondary">
                <span>{project.category}</span>
                <span className="h-1 w-1 rounded-full bg-theme-secondary" />
                <span>{project.role}</span>
                {project.duration ? <><span className="h-1 w-1 rounded-full bg-theme-secondary" /><span>{project.duration}</span></> : null}
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-theme-primary">
                <p>{project.longDescription}</p>
                <p>
                  This page explains the architecture, stack, and key delivery points before opening the repository.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-theme-custom bg-theme-surface p-6">
                <div className="flex items-center gap-2 text-theme-secondary text-xs uppercase tracking-[0.24em]">
                  <Layers className="h-4 w-4" /> Tech stack
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="project-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-theme-custom bg-theme-surface p-6">
                <div className="flex items-center gap-2 text-theme-secondary text-xs uppercase tracking-[0.24em]">
                  <ShieldCheck className="h-4 w-4" /> Highlights
                </div>
                <ul className="mt-4 space-y-3 text-sm text-theme-primary">
                  {project.keyFeatures.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Sparkles className="mt-1 h-4 w-4 text-theme-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {project.metrics && project.metrics.length > 0 ? (
              <div className="rounded-3xl border border-theme-custom bg-theme-surface p-6">
                <p className="text-theme-secondary text-xs uppercase tracking-[0.24em]">Impact metrics</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl bg-theme-elevated p-4">
                      <p className="text-xs text-theme-secondary">{metric.label}</p>
                      <p className="mt-1 text-xl font-semibold text-theme-primary">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6 rounded-3xl border border-theme-custom bg-theme-surface p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-theme-secondary text-xs uppercase tracking-[0.24em]">
                <Folder className="h-4 w-4" /> Repository & demo
              </div>
              <div className="space-y-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-theme-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-theme-primary/90"
                >
                  <ExternalLink className="h-4 w-4" /> View GitHub repository
                </a>
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-theme-custom bg-theme-elevated px-4 py-3 text-sm font-semibold text-theme-primary transition hover:border-theme-primary"
                  >
                    <ExternalLink className="h-4 w-4" /> Open demo
                  </a>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-theme-custom bg-theme-elevated p-6">
              <p className="text-theme-secondary text-xs uppercase tracking-[0.24em]">Architecture summary</p>
              <div className="mt-4 space-y-3 text-sm text-theme-primary">
                {project.keyFeatures.map((feature) => (
                  <div key={feature} className="space-y-1">
                    <p className="font-medium">{feature}</p>
                    <p className="text-theme-secondary">A concise explanation of the project architecture and how this feature contributes to the end-to-end system.</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
