"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useNotify } from "./notifications/NotificationProvider";

export default function FloatingControls() {
  const { t } = useTranslation("common");
  const notify = useNotify();
  
  const { theme, setTheme } = useTheme();
  const { editMode, setEditMode, tempUser, user } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState("es");

  const handleEditMode = () => {
    setEditMode(!editMode);
    !editMode ? notify(t("editMode.true"),"info") : notify(t("editMode.false"),"error")
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const handleLanguage = (lan: string) => {
    setLang(lan)
    const currentLang = i18n.language ?? lang;
    i18n.changeLanguage(currentLang === "es" ? "en" : "es")

  };

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-30 flex flex-row gap-4 p-3 rounded-xl shadow-lg backdrop-blur-md",
        "bg-white/60 border border-neutral-300 dark:bg-neutral-800/60 dark:border-neutral-700"
      )}
    >
      {/* Tema */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          "hover:scale-105 transition-all bg-white/80 dark:bg-neutral-700"
        )}
        aria-label="Cambiar tema"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-400 cursor-pointer" />
        ) : (
          <Moon className="w-5 h-5 text-neutral-800 cursor-pointer" />
        )}
      </button>

      <select
        value={lang}
        onChange={(e)=>handleLanguage(e.target.value)}
        className={cn(
          "w-20 text-sm rounded-md bg-white/80 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 p-1 text-center",
          "hover:scale-105 transition-all cursor-pointer"
        )}
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>

      {!editMode && (
        <button
          onClick={handleEditMode}
          className={cn(
            "w-32 py-2 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          )}
        >
          <Pencil size={16} />
          {t("editMode.title")}
        </button>
      )}
    </div>
  );
}
