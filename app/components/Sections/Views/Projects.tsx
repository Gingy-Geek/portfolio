"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import ModalGallery from "../Gallery/ModalGallery";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Projects = () => {
  const [selected, setSelected] = React.useState<any>(null);
  const { user } = useAppContext();
  const projectsSection = user.sections.find((sec) => sec.id === "projects");
  const { t } = useTranslation("common");

  if (!projectsSection) return null;

  const { type, links, artWork } = projectsSection.data;

  return (
    <dl className="flex flex-col gap-3">
      {/* TITLE */}
      <dt className="text-gray-900 dark:text-gray-100 font-semibold text-lg px-2">
        <h3>{t("navbar.projects")}</h3>
      </dt>

      {/* ======================== LINKS ======================== */}
      {(type === "links" || type === "all") && (
        <dd className="text-sm leading-relaxed">
          <h6 className="px-2 text-gray-600 dark:text-gray-400">
            {t("section.projects.types.links")}
          </h6>

          <div className="flex flex-col gap-4 mt-2">
            {links.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                {t("status.noData")}
              </div>
            ) : (
              links.map((item: any) => (
                <div
                  key={item.id}
                  className={cn(
                    "transition-colors duration-200 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-2"
                  )}
                >
                  <Link
                    href={`/proyectos/${item.slug}`}
                    className={cn(
                      "flex-1 flex gap-4 items-center",
                      "max-md:flex-col max-md:items-start max-md:gap-2"
                    )}
                  >
                    <img
                      alt="project icon"
                      src={item.icon}
                      width={20}
                      height={20}
                    />

                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-1">
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(item.link, "_blank");
                          }}
                          className="flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {item.title}
                          </span>
                          <ArrowUpRight className="w-5 h-5" />
                        </span>

                        <p className="text-xs ml-2">{item.year}</p>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {item.subtitle}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </dd>
      )}

      {type === "all" && (
        <hr className="border-gray-300 dark:border-gray-700 my-4" />
      )}

      {/* ======================== ARTWORK ======================== */}
      {(type === "artwork" || type === "all") && (
        <dd
          className={cn(
            "text-gray-600 dark:text-gray-400 text-sm leading-relaxed",
            "px-2"
          )}
        >
          <h6 className="text-gray-600 dark:text-gray-400">
            {t("section.projects.types.artwork")}
          </h6>

          {/* === GALERÍA === */}
          <div className="h-120 overflow-y-auto pr-2 mt-2">
            {artWork.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                {t("status.noData")}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {artWork.map((img: any) => (
                  <div
                    key={img.id}
                    className="aspect-square rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800"
                  >
                    <img
                      src={img.image}
                      alt={img.title}
                      onClick={() => setSelected(img)}
                      className="w-full h-full object-cover cursor-pointer transition-all hover:opacity-80"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <ModalGallery selected={selected} onClose={() => setSelected(null)} />
        </dd>
      )}
    </dl>
  );
};

export default Projects;
