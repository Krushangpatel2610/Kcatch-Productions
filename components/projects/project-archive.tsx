"use client";
// components/projects/project-archive.tsx
// Full project list with category filtering.

import { useState } from "react";
import {
  type ProjectCategory,
  filterProjectsByCategory,
} from "@/content/projects";
import { ProjectFilters } from "./project-filters";
import { ProjectArchiveItem } from "./project-archive-item";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";

export function ProjectArchive() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("ALL");

  const filtered = filterProjectsByCategory(activeCategory);

  return (
    <section
      className="bg-kc-black"
      aria-label="Project archive"
      data-section="project-archive"
    >
      <Container className="py-12 md:py-16">
        {/* Filters */}
        <Reveal direction="up">
          <div className="mb-10">
            <ProjectFilters
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </Reveal>

        {/* Project list */}
        <div
          role="list"
          aria-label={`${filtered.length} projects in ${activeCategory}`}
        >
          {filtered.length === 0 ? (
            <p className="font-body text-kc-muted text-sm py-12 text-center">
              No projects in this category yet.
            </p>
          ) : (
            filtered.map((project, i) => (
              <div role="listitem" key={project.id}>
                <ProjectArchiveItem
                  project={project}
                  index={i}
                  total={filtered.length}
                />
              </div>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
