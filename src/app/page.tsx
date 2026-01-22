"use client";

import { useState, useEffect, useRef } from "react";

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
    github: "https://github.com/Jonathan1600/retro-portfolio",
  },
  {
    id: 2,
    title: "Time To Visually Complete",
    description:
      "An open source library to measure when the page has fully finished loading for users. Developed while working @ Dropbox with React, Node.js ",
    technologies: ["React", "Node.js", "Jest", "playwright"],
    link: "https://www.npmjs.com/package/@dropbox/ttvc",
    github: "https://github.com/dropbox/ttvc",
  },
  {
    id: 3,
    title: "YouTube Remover",
    description:
      "Chrome extension made to remove some youtube features that are frustrating or a distraction. Some of this features include Shorts, AI boxes, or Sponsored Content",
    technologies: ["TypeScript", "CSS", "HTML5", "ChromeWebStore"],
    link: "https://chromewebstore.google.com/detail/kelkmkggmhffjdkhcfoiioffiogodhhb?utm_source=item-share-cb",
    github: "https://github.com/Jonathan1600/youtube-remover",
  },
  {
    id: 4,
    title: "Hearthstone Cards Viewer",
    description:
      "Hearthsone Card Viewer pulling directly from the Blizzard API to get up to date card lists.",
    technologies: ["Javascript", "React", "Redux", "Axios"],
    link: "https://hearthstone-cards.vercel.app/",
    github: "https://github.com/Jonathan1600/hearthstone-cards",
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
  {
    id: "email",
    label: "Email",
    href: "mailto:jonathancalderonsilberman@gmail.com",
    icon: "/gmail-96.png",
  },
];

export default function HomePage() {
  const [activeWindow, setActiveWindow] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [windowPositions, setWindowPositions] = useState<Record<number, { x: number; y: number }>>({});

  const copyEmail = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const email = "jonathancalderonsilberman@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      setToast(`email pasted to clipboard ${email}`);
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Failed to copy email to clipboard");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="bg-ps1-light-grey flex min-h-screen flex-col bg-[url(../../public/church.png)]">
      <header className="window-border z-50 flex h-8 w-full items-center gap-2 bg-white px-2">
        <div className="text-s font-normal">
          Jonathan Calderon&apos;s Portfolio Page
        </div>
        <div className="ml-auto text-xs font-bold">
          {new Date().toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="text-xs font-bold">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </header>
      <section className="relative flex flex-1 overflow-auto">
        <div className="absolute left-4 top-4 z-10" style={{ width: "96px" }}>
          {desktopIcons.map((icon, index) => (
            <DraggableIcon
              key={icon.id}
              icon={icon}
              initialY={index * 120}
              position={iconPositions[icon.id]}
              onPositionChange={(x, y) => {
                setIconPositions((prev) => ({ ...prev, [icon.id]: { x, y } }));
              }}
              onEmailClick={copyEmail}
            />
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4 pl-32">
          <div className="relative min-h-full">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                 <ProjectWindow
                   key={project.id}
                   project={project}
                   isActive={activeWindow === project.id}
                   onActivate={() => setActiveWindow(project.id)}
                   onClose={() => setActiveWindow(null)}
                   position={windowPositions[project.id]}
                   onPositionChange={(x, y) => {
                     setWindowPositions((prev) => ({ ...prev, [project.id]: { x, y } }));
                   }}
                   onResetPosition={() => {
                     setWindowPositions((prev) => {
                       const newPositions = { ...prev };
                       delete newPositions[project.id];
                       return newPositions;
                     });
                   }}
                 />
              ))}
            </div>
          </div>
        </div>
      </section>

      {toast && (
        <div className="fixed right-4 bottom-4 z-50 rounded bg-black/90 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

interface DraggableIconProps {
  icon: { id: string; label: string; href: string; icon: string };
  initialY: number;
  position?: { x: number; y: number };
  onPositionChange: (x: number, y: number) => void;
  onEmailClick: (e?: React.MouseEvent) => void;
}

function DraggableIcon({
  icon,
  initialY,
  position,
  onPositionChange,
  onEmailClick,
}: DraggableIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const iconRef = useRef<HTMLAnchorElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const clickAllowedRef = useRef(true);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        const sectionElement = iconRef.current?.closest("section");
        const sectionRect = sectionElement?.getBoundingClientRect();
        if (sectionRect) {
          const distance = Math.sqrt(
            Math.pow(e.clientX - startPosRef.current.x, 2) +
            Math.pow(e.clientY - startPosRef.current.y, 2)
          );
          if (distance > 5) {
            setHasMoved(true);
            clickAllowedRef.current = false;
          }
          if (hasMoved || distance > 5) {
            const x = e.clientX - sectionRect.left - dragOffset.x;
            const y = e.clientY - sectionRect.top - dragOffset.y;
            onPositionChange(x, y);
          }
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setTimeout(() => {
          setHasMoved(false);
          clickAllowedRef.current = true;
        }, 100);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, onPositionChange, hasMoved]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation();
    if (e.button !== 0) return;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    clickAllowedRef.current = true;
    const rect = iconRef.current?.getBoundingClientRect();
    const sectionElement = iconRef.current?.closest("section");
    const sectionRect = sectionElement?.getBoundingClientRect();
    if (rect && sectionRect) {
      const currentX = position ? position.x : 0;
      const currentY = position ? position.y : initialY;
      setDragOffset({
        x: e.clientX - sectionRect.left - currentX,
        y: e.clientY - sectionRect.top - currentY,
      });
      setIsDragging(true);
      setHasMoved(false);
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    if (!clickAllowedRef.current || hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (icon.id === "email") {
      e.preventDefault();
      onEmailClick(e);
    }
  };

  const style = position
    ? { position: "absolute" as const, left: `${position.x}px`, top: `${position.y}px`, zIndex: 10 }
    : { position: "absolute" as const, left: "0px", top: `${initialY}px`, zIndex: 10 };

  return (
    <a
      ref={iconRef}
      href={icon.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={`window-border flex w-24 flex-col items-center gap-2 bg-[#c0c0c0]/80 p-3 text-xs font-bold text-black transition hover:-translate-y-1 hover:shadow-[0_4px_0_0_#7a7a7a] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={style}
    >
      <span className="flex h-12 w-12 items-center justify-center text-lg pointer-events-none">
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
      <span className="text-center leading-tight pointer-events-none">{icon.label}</span>
    </a>
  );
}

interface ProjectWindowProps {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
  position?: { x: number; y: number };
  onPositionChange: (x: number, y: number) => void;
  onResetPosition: () => void;
}

function ProjectWindow({
  project,
  isActive,
  onActivate,
  onClose,
  position,
  onPositionChange,
  onResetPosition,
}: ProjectWindowProps) {
  const [minimized, setMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        const sectionElement = windowRef.current?.closest("section");
        const sectionRect = sectionElement?.getBoundingClientRect();
        if (sectionRect) {
          const x = e.clientX - sectionRect.left - dragOffset.x;
          const y = e.clientY - sectionRect.top - dragOffset.y;
          onPositionChange(x, y);
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, onPositionChange]);

  if (minimized) {
    return null;
  }

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const rect = windowRef.current?.getBoundingClientRect();
    const sectionElement = windowRef.current?.closest("section");
    const sectionRect = sectionElement?.getBoundingClientRect();
    if (rect && sectionRect) {
      const currentX = position ? position.x : rect.left - sectionRect.left;
      const currentY = position ? position.y : rect.top - sectionRect.top;
      setDragOffset({
        x: e.clientX - sectionRect.left - currentX,
        y: e.clientY - sectionRect.top - currentY,
      });
      setIsDragging(true);
      onActivate();
    }
  };

  const style = position
    ? { position: "absolute" as const, left: `${position.x}px`, top: `${position.y}px`, width: "400px" }
    : undefined;

  return (
    <div
      ref={windowRef}
      className={`window-border bg-[#c0c0c0] ${isActive ? "z-40" : "z-10"} ${isDragging ? "cursor-grabbing" : ""}`}
      onClick={onActivate}
      style={style}
    >
      <div
        className={`${
          isActive ? "bg-windows-blue" : "bg-ps1-dark-grey"
        } flex items-center justify-between px-2 py-1 text-sm font-bold text-white ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleTitleBarMouseDown}
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
              onResetPosition();
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
