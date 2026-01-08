"use client";
import { ProjectArtwork } from "@/models/user";
import { useTranslation } from "next-i18next";
import React from "react";



interface Props {
  selected: ProjectArtwork | null;
  onClose: () => void;
}

const ModalGallery: React.FC<Props> = ({ selected, onClose }) => {
  const { t } = useTranslation("common");
  
  if (!selected) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/60 backdrop-blur-sm
        flex items-center justify-center
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          bg-white dark:bg-neutral-900 
          text-black dark:text-white 
          rounded-xl overflow-hidden
          max-w-[90vw] max-h-[90vh]
          flex flex-col md:flex-row
          shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGEN */}
        <div className="flex justify-center items-center bg-gray-200 dark:bg-black md:max-w-[70%]">
          <img
            src={selected.image}
            alt=""
            className="
              max-w-full max-h-[90vh]
              object-contain
            "
          />
        </div>

        {/* PANEL DERECHO */}
        <div className="w-full md:w-80 p-4 flex flex-col">
          <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
            {selected.title}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {selected.description}
          </p>

          <button
            onClick={onClose}
            className="
              mt-auto 
              bg-black text-white 
              dark:bg-white dark:text-black
              rounded-md px-4 py-2 font-medium
              hover:bg-gray-800 dark:hover:bg-gray-200
            "
          >
            {t("actions.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGallery;
