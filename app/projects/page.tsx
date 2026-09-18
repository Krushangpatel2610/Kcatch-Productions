// app/projects/page.tsx
// KCATCH Projects Page
// Route: /projects

import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ProjectsHero } from "@/components/projects/projects-hero";
import { ProjectArchive } from "@/components/projects/project-archive";
import { ProjectsTransition } from "@/components/projects/projects-transition";
import { ProjectsCTA } from "@/components/projects/projects-cta";

export const metadata: Metadata = {
  title: "KCATCH Media | Projects",
  description:
    "A collection of ideas that made people look — KCATCH Media project showcase.",
};

export default function ProjectsPage() {
  return (
    <SiteShell>
      <ProjectsHero />
      <ProjectArchive />
      <ProjectsTransition />
      <ProjectsCTA />
    </SiteShell>
  );
}
