"use client";
import { Loading } from "@/app/components/Loading";
import useProjectsEdit from "@/app/hooks/useProjectsEdit";
import { ProjectLink } from "@/models/user";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { ProjectNotFound } from "./projectNotFound";

export default function ProyectoDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
const { projectsSection } = useProjectsEdit();
const { slug } = use(params);
const { t, ready} = useTranslation("common");
const [mounted, setMounted] = React.useState(false);

React.useEffect(() => {
  setMounted(true);
}, []);

if (!mounted || !ready) {
  return <Loading />;
}  

const project: ProjectLink = projectsSection.data.links.find(
  (project: ProjectLink) => {
    return project.slug === slug;
  }
);

if (!project) {
  return <ProjectNotFound t={t} />;
}
  

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* BACK TO HOME */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300
             hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={18} className="relative top-[1px]" />
        <span>{t("slug.back")}</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {t("slug.title")}: {project.title}
      </h1>

      <div className="w-full rounded-xl overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800">
        <img
          src={project.cover}
          alt="Thumbnail"
          className="w-full h-72 object-contain"
        />
      </div>

      <div className="mt-10">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          {project.description}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* FRONTEND */}
        {project.tools.frontend && project.tools.frontend.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-3">
              Frontend
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tools.frontend.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* BACKEND */}
        {project.tools.backend && project.tools.backend.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-3">
              Backend
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tools.backend.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* DATABASE */}
        {project.tools.database && project.tools.database.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-3">
              {t("slug.database")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tools.database.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTÓN */}
      <div className="mt-14">
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="
            inline-block px-6 py-3 rounded-lg font-medium 
            bg-blue-600 text-white hover:bg-blue-700 
            dark:bg-blue-500 dark:hover:bg-blue-600
          "
        >
          {t("slug.button")}
        </a>
      </div>
    </div>
  );
}
