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
    description: "A nostalgic portfolio website styled like a 90s operating system. Built with Next.js and Tailwind CSS.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    link: "#",
    github: "#",
  },
  {
    id: 2,
    title: "Task Manager Pro",
    description: "A productivity application for managing daily tasks with drag-and-drop functionality and due date reminders.",
    technologies: ["React", "Node.js", "MongoDB"],
    link: "#",
    github: "#",
  },
  {
    id: 3,
    title: "Pixel Art Generator",
    description: "Create and edit pixel art with a simple, intuitive interface. Export your creations as PNG or GIF.",
    technologies: ["Canvas API", "JavaScript", "HTML5"],
    link: "#",
    github: "#",
  },
  {
    id: 4,
    title: "Chat Application",
    description: "Real-time messaging app with rooms, file sharing, and emoji support. Built with WebSockets.",
    technologies: ["Socket.io", "Express", "React"],
    link: "#",
    github: "#",
  },
];

export default function HomePage() {
  const [activeWindow, setActiveWindow] = useState<number | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#008080] flex flex-col">
      {/* Taskbar Header */}
      <div className="bg-[#c0c0c0] window-border-inset w-full h-12 flex items-center px-2 gap-2 z-50">
        <div className="relative">
          <button
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className="window-button px-4 py-1 font-bold text-sm flex items-center gap-2"
          >
            <span>Start</span>
            <span className="text-xs">▼</span>
          </button>
          {startMenuOpen && (
            <div className="absolute bottom-full left-0 mb-1 bg-[#c0c0c0] window-border w-64 py-1">
              <div className="px-4 py-2 hover:bg-[#000080] hover:text-white cursor-pointer">
                Programs
              </div>
              <div className="px-4 py-2 hover:bg-[#000080] hover:text-white cursor-pointer">
                Documents
              </div>
              <div className="px-4 py-2 hover:bg-[#000080] hover:text-white cursor-pointer">
                Settings
              </div>
              <div className="px-4 py-2 hover:bg-[#000080] hover:text-white cursor-pointer">
                Find
              </div>
              <div className="px-4 py-2 hover:bg-[#000080] hover:text-white cursor-pointer">
                Help
              </div>
              <div className="px-4 py-2 hover:bg-[#000080] hover:text-white cursor-pointer">
                Run...
              </div>
              <div className="border-t border-gray-600 my-1"></div>
              <div className="px-4 py-2 hover:bg-[#000080] hover:text-white cursor-pointer">
                Shut Down...
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 flex items-center gap-2">
          {projects.slice(0, 3).map((project) => (
            <button
              key={project.id}
              onClick={() => setActiveWindow(project.id)}
              className={`window-button px-3 py-1 text-sm ${
                activeWindow === project.id ? "bg-[#000080] text-white" : ""
              }`}
            >
              {project.title}
            </button>
          ))}
        </div>
        <div className="text-xs font-bold">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Desktop Icons Area */}
        <div className="mb-8">
          <div className="inline-flex flex-col items-center gap-2 cursor-pointer hover:bg-black/10 p-2">
            <div className="w-16 h-16 bg-[#c0c0c0] window-border flex items-center justify-center text-4xl">
              🖥️
            </div>
            <span className="text-white text-sm font-semibold drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">
              My Computer
            </span>
          </div>
        </div>

        {/* Project Windows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={activeWindow === project.id}
              onActivate={() => setActiveWindow(project.id)}
              onClose={() => setActiveWindow(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
}

function ProjectCard({ project, isActive, onActivate, onClose }: ProjectCardProps) {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return null;
  }

  return (
    <div
      className={`bg-[#c0c0c0] window-border ${isActive ? "z-40" : "z-10"} cursor-pointer`}
      onClick={onActivate}
    >
      {/* Title Bar */}
      <div
        className={`${
          isActive ? "bg-[#000080]" : "bg-[#808080]"
        } text-white px-2 py-1 flex items-center justify-between text-sm font-bold`}
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
            className="window-button w-6 h-6 flex items-center justify-center text-xs font-bold"
            title="Minimize"
          >
            _
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Maximize - placeholder
            }}
            className="window-button w-6 h-6 flex items-center justify-center text-xs font-bold"
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
            className="window-button w-6 h-6 flex items-center justify-center text-xs font-bold"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-4 bg-[#c0c0c0] min-h-[200px]">
        <div className="window-border-inset bg-white p-4">
          <p className="text-sm text-black mb-4">{project.description}</p>
          
          <div className="mb-4">
            <div className="font-bold text-xs mb-2 text-black">Technologies:</div>
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
