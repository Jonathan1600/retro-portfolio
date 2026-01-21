"use client";

import { useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Retro Portfolio",
    description:
      "A nostalgic portfolio website styled like a 90s operating system. Built with Next.js and Tailwind CSS.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    link: "#",
    github: "#",
  },
  {
    id: 2,
    title: "Task Manager Pro",
    description:
      "A productivity application for managing daily tasks with drag-and-drop functionality and due date reminders.",
    technologies: ["React", "Node.js", "MongoDB"],
    link: "#",
    github: "#",
  },
  {
    id: 3,
    title: "Pixel Art Generator",
    description:
      "Create and edit pixel art with a simple, intuitive interface. Export your creations as PNG or GIF.",
    technologies: ["Canvas API", "JavaScript", "HTML5"],
    link: "#",
    github: "#",
  },
  {
    id: 4,
    title: "Chat Application",
    description:
      "Real-time messaging app with rooms, file sharing, and emoji support. Built with WebSockets.",
    technologies: ["Socket.io", "Express", "React"],
    link: "#",
    github: "#",
  },
];

const desktopIcons = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jonathan-calderon-silberman/",
    icon: "/linkedin-96.png",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Jonathan1600",
    icon: "/github-96.png",
  },
];

export default function HomePage() {
  const [activeWindow, setActiveWindow] = useState<number | null>(null);

  return (
    <div className="bg-ps1-light-grey flex min-h-screen flex-col bg-[url(../../public/church.png)]">
      <header className="window-border-inset bg-ps1-dark-grey z-50 flex h-12 w-full items-center gap-2 px-2">
        <div className="text-s font-bold">
          Jonathan Calderon&apos;s Portfolio Page
        </div>
        <div className="ml-auto text-xs font-bold">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </header>
      <section className="flex-1 overflow-auto p-4">
        <div className="mb-6 flex flex-wrap gap-4">
          {desktopIcons.map((icon) => (
            <a
              key={icon.id}
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              className="window-border flex w-24 flex-col items-center gap-2 bg-[#c0c0c0]/80 p-3 text-xs font-bold text-black transition hover:-translate-y-1 hover:shadow-[0_4px_0_0_#7a7a7a]"
            >
              <span className="flex h-12 w-12 items-center justify-center text-lg">
                {icon.icon.endsWith(".png") ? (
                  <img
                    src={icon.icon}
                    alt={`${icon.label} icon`}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  icon.icon
                )}
              </span>
              <span className="text-center leading-tight">{icon.label}</span>
            </a>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectWindow
              key={project.id}
              project={project}
              isActive={activeWindow === project.id}
              onActivate={() => setActiveWindow(project.id)}
              onClose={() => setActiveWindow(null)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

interface ProjectWindowProps {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
}

function ProjectWindow({
  project,
  isActive,
  onActivate,
  onClose,
}: ProjectWindowProps) {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return null;
  }

  return (
    <div
      className={`window-border bg-[#c0c0c0] ${isActive ? "z-40" : "z-10"} cursor-pointer`}
      onClick={onActivate}
    >
      <div
        className={`${
          isActive ? "bg-windows-blue" : "bg-ps1-dark-grey"
        } flex items-center justify-between px-2 py-1 text-sm font-bold text-white`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs">📁</span>
          <span>{project.title}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(true);
              onClose();
            }}
            className="window-button flex h-6 w-6 items-center justify-center text-xs font-bold"
            title="Minimize"
          >
            _
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              //placeholder
            }}
            className="window-button flex h-6 w-6 items-center justify-center text-xs font-bold"
            title="Maximize"
          >
            □
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(true);
              onClose();
            }}
            className="window-button flex h-6 w-6 items-center justify-center text-xs font-bold"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="min-h-[200px] bg-[#c0c0c0] p-4">
        <div className="window-border-inset bg-white p-4">
          <p className="mb-4 text-sm text-black">{project.description}</p>

          <div className="mb-4">
            <div className="mb-2 text-xs font-bold text-black">
              Technologies:
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="window-button px-2 py-1 text-xs text-black"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="window-button px-3 py-1 text-xs text-black"
                onClick={(e) => e.stopPropagation()}
              >
                View Project →
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="window-button px-3 py-1 text-xs text-black"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
