// components/projects/project-archive-item.tsx
// Single project row in the archive.
// Delegates to ProjectScene with variant="archive".

import { type Project } from "@/content/projects";
import { ProjectScene } from "@/components/home/project-scene";
import { Reveal } from "@/components/motion/reveal";

type ProjectArchiveItemProps = {
  project: Project;
  index: number;
  total: number;
};

export function ProjectArchiveItem({
  project,
  index,
  total,
}: ProjectArchiveItemProps) {
  return (
    <Reveal direction="up" delay={Math.min(index * 0.05, 0.3)}>
      <ProjectScene
        project={project}
        index={index}
        total={total}
        variant="archive"
      />
    </Reveal>
  );
}
