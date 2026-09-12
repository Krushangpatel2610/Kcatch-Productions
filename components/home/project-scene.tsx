// components/home/project-scene.tsx
// Reusable project scene component.
// Used in FeaturedWorkSection (horizontal scroll) and Projects archive.
//
// Variants:
//   "featured" — large cinematic horizontal scene
//   "archive"  — editorial row on Projects page
//   "compact"  — small thumbnail (future use)

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Project } from "@/content/projects";
import { HandwrittenNote } from "@/components/graphics/handwritten-note";
import { KcatchImage } from "@/components/ui/kcatch-image";

type ProjectSceneProps = {
  project: Project;
  index: number;
  total?: number;
  variant?: "featured" | "archive" | "compact";
  className?: string;
};

// ---------------------------------------------------------------------------
// Tag chip
// ---------------------------------------------------------------------------
function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-kc-white/30 text-kc-white/80 font-body text-[10px] uppercase tracking-widest px-2.5 py-1">
      {label}
    </span>
  );
}


// ---------------------------------------------------------------------------
// Featured variant — horizontal scroll scene
// ---------------------------------------------------------------------------
function FeaturedScene({ project, index, className }: ProjectSceneProps) {
  return (
    <article
      className={cn("relative w-full h-full flex flex-col md:flex-row", className)}
      data-scene={project.id}
      aria-label={`Project: ${project.client}`}
    >
      {/* Left: project info */}
      <div className="relative z-10 flex flex-col justify-between p-8 md:p-12 md:w-[35%] lg:w-[30%]">
        <div>
          {/* Project number */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-display text-kc-yellow text-6xl md:text-7xl leading-none">
              {project.number}
            </span>
            <div className="w-8 h-[1px] bg-kc-muted/40" aria-hidden="true" />
          </div>

          {/* Client name */}
          <h3 className="font-display text-kc-white text-3xl md:text-4xl uppercase mb-1">
            {project.client}
          </h3>
          {project.subtitle && (
            <p className="font-hand text-kc-muted text-base mb-4">
              {project.subtitle}
            </p>
          )}

          {/* Description */}
          <p className="font-body text-kc-muted text-sm leading-relaxed mb-6 max-w-xs">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/projects#${project.id}`}
          className="inline-flex items-center gap-3 bg-kc-yellow text-kc-black font-body text-xs uppercase tracking-widest px-5 py-3 mt-8 w-fit hover:bg-transparent hover:text-kc-yellow hover:border-kc-yellow border border-kc-yellow transition-all duration-300 group focus-visible:outline-kc-yellow"
          aria-label={`View ${project.client} project`}
        >
          VIEW PROJECT
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Right: main image */}
      <div className="relative flex-1 overflow-hidden">
        {/* Main hero image slot */}
        <KcatchImage
          src={project.heroImage}
          alt={`${project.client} campaign visual`}
          placeholderLabel={project.client}
          className="absolute inset-0"
          fill
          priority={index === 0}
        />

        {/* Annotation overlay */}
        {project.annotation && (
          <div
            className="absolute bottom-8 right-8 z-10 text-right"
            aria-hidden="true"
          >
            <HandwrittenNote
              text={project.annotation}
              rotation={-2}
              size="md"
              color="white"
            />
          </div>
        )}

        {/* Supporting image (peek from edge) */}
        {project.supportingImages?.[0] && (
          <div className="absolute top-8 right-8 w-32 h-40 md:w-40 md:h-52 z-10 shadow-2xl">
            <KcatchImage
              src={project.supportingImages[0]}
              alt={`${project.client} supporting visual`}
              placeholderLabel="SUPPORTING"
              className="w-full h-full"
              fill
            />
          </div>
        )}
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Archive variant — used on Projects page
// ---------------------------------------------------------------------------
function ArchiveScene({ project, className }: ProjectSceneProps) {
  return (
    <article
      id={project.id}
      className={cn("group relative grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_auto] gap-6 md:gap-8 items-center py-8 border-b border-kc-line hover:border-kc-yellow/40 transition-colors", className)}
      aria-label={`Project: ${project.client}`}
    >
      {/* Number + category */}
      <div className="flex md:flex-col items-baseline md:items-start gap-3 md:gap-1 min-w-[80px]">
        <span className="font-display text-kc-yellow text-4xl md:text-5xl leading-none">
          {project.number}
        </span>
        <span className="font-body text-kc-muted text-[10px] uppercase tracking-widest">
          {project.category}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="font-display text-kc-white text-2xl md:text-3xl uppercase mb-1 group-hover:text-kc-yellow transition-colors">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="font-hand text-kc-muted text-sm mb-2">
            {project.subtitle}
          </p>
        )}
        <p className="font-body text-kc-muted text-sm leading-relaxed max-w-sm">
          {project.description}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>

      {/* Image slot */}
      <div className="hidden md:block">
        <div className="relative h-32 lg:h-40 w-64 lg:w-80 overflow-hidden">
          <KcatchImage
            src={project.heroImage}
            alt={`${project.client} campaign visual`}
            placeholderLabel={project.client}
            fill
            className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
      </div>

      {/* CTA arrow */}
      <Link
        href={`/projects#${project.id}`}
        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-kc-white/30 text-kc-white hover:border-kc-yellow hover:text-kc-yellow hover:bg-kc-yellow hover:text-kc-black transition-all duration-300 group-hover:border-kc-yellow group-hover:translate-x-1 focus-visible:outline-kc-yellow flex-shrink-0"
        aria-label={`View ${project.client} project`}
      >
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function ProjectScene({
  project,
  index,
  variant = "featured",
  className,
}: ProjectSceneProps) {
  if (variant === "archive") {
    return <ArchiveScene project={project} index={index} className={className} />;
  }
  return (
    <FeaturedScene
      project={project}
      index={index}
      className={className}
    />
  );
}
