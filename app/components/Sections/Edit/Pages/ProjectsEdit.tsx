"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import useProjectsEdit from "@/app/hooks/useProjectsEdit";
import LinksList from "../ProjectsPage/LinksList";
import ArtworkGrid from "../ProjectsPage/ArtworkGrid";
import { useTranslation } from "react-i18next";

const ProjectsEdit: React.FC = () => {
  const {
    projectsSection,
    tempLinks,
    tempArtWork,
    toggleVisibility,
    setType,
    addLink,
    addArtwork,
    saveLink,
    deleteLink,
    reorderLinks,
    saveArtwork,
    deleteArtwork,
    reorderArtwork,
  } = useProjectsEdit();
  const { t } = useTranslation("common");

  if (!projectsSection) return null;

  const { data, visible } = projectsSection;
  const { type } = data as any;

  return (
    <dl
      className={cn(
        "flex flex-col gap-3 rounded bg-gray-100 dark:bg-gray-900",
        visible ? "opacity-100" : "opacity-40"
      )}
    >
      <dt className="flex items-center justify-between text-gray-900 dark:text-gray-100 font-semibold text-lg p-2">
        <h3>{t("navbar.projects")}</h3>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-md bg-gray-200 dark:bg-gray-800 p-1">
            {["all", "links", "artwork"].map((opt) => {
              const active = type === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setType(opt as any)}
                  className={`px-3 mx-1 py-1 cursor-pointer rounded-md text-sm font-medium transition ${
                    active
                      ? "bg-white dark:bg-neutral-700 text-black dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-300/50"
                  }`}
                >
                  {opt === "all" ? t("section.projects.types.all") : opt === "links" ? t("section.projects.types.links") : t("section.projects.types.artwork")}
                </button>
              );
            })}
          </div>

          <button
            onClick={toggleVisibility}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
          title={visible ? t("section.hideToggle.hide") : t("section.hideToggle.show")}
          >
            {visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
      </dt>

      {(type === "links" || type === "all") && (
        <LinksList
          items={tempLinks}
          onAdd={addLink}
          onSave={saveLink}
          onDelete={deleteLink}
          onReorder={reorderLinks}
        />
      )}

      {(type === "artwork" || type === "all") && (
        <ArtworkGrid
          items={tempArtWork}
          onAdd={addArtwork}
          onSave={saveArtwork}
          onDelete={deleteArtwork}
          onReorder={reorderArtwork}
        />
      )}
    </dl>
  );
};

export default ProjectsEdit;
