import type { Metadata } from "next";
import { projects, siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Projects",
  description: `Things ${siteConfig.fullName} has built.`,
};

export default function ProjectsPage() {
  return (
    <ul className="flex flex-col">
      {projects.map((project, i) => {
        const showYear =
          !!project.year &&
          (i === 0 || projects[i - 1].year !== project.year);
        return (
          <li key={project.name}>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group flex gap-4 py-2.5"
            >
              <span className="w-10 shrink-0 font-mono text-[12px] leading-[22px] tabular-nums text-muted-dark">
                {showYear ? project.year : ""}
              </span>
              <div className="min-w-0">
                <h2 className="text-[15px] font-medium leading-[22px] text-foreground group-hover:opacity-70">
                  {project.name}
                </h2>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">
                  {project.description}
                </p>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
