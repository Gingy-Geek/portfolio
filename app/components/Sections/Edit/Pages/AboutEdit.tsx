"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import { Eye, EyeOff } from "lucide-react";
import { useNotify } from "@/app/components/notifications/NotificationProvider";
import { useTranslation } from "react-i18next";

const AboutEdit = () => {
  const { tempUser, setTempUserWithFlag } = useAppContext();
  const aboutSection = tempUser.sections.find((sec) => sec.id === "about");
  const notify = useNotify();
  const { t } = useTranslation("common");
  const [editingText, setEditingText] = React.useState(
    aboutSection ? aboutSection.data : ""
  );

  const toggleVisibility = () => {
    const newVisible = !aboutSection?.visible;

    // actualizás el user
    setTempUserWithFlag({
      ...tempUser,
      sections: tempUser.sections.map((sec) =>
        sec.id === "about" ? { ...sec, visible: newVisible } : sec
      ),
    });

    notify(
      newVisible
        ? t("section.about.notify.visible")
        : t("section.about.notify.noVisible"),
      newVisible ? "success" : "info"
    );
  };

  const handleChange = (value: string) => {
    setEditingText(value);

    setTempUserWithFlag({
      ...tempUser,
      sections: tempUser.sections.map((sec) =>
        sec.id === "about" ? { ...sec, data: value } : sec
      ),
    });
  };

  if (!aboutSection) return null;

  return (
    <dl
      className={cn(
        "flex flex-col gap-3 rounded bg-gray-100 dark:bg-gray-900",
        aboutSection.visible ? "opacity-100" : "opacity-40"
      )}
    >
      <dt className="flex items-center justify-between text-gray-900 dark:text-gray-100 font-semibold text-lg p-2">
        <h3>{t("navbar.about")}</h3>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
          title={aboutSection.visible ? t("section.hideToggle.hide") : t("section.hideToggle.show")}
        >
          {aboutSection.visible ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </button>
      </dt>

      <dd
        className={cn(
          "text-gray-600 dark:text-gray-400 text-sm leading-relaxed",
          "px-2"
        )}
      >
        <textarea
          className="w-full border rounded p-2 text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-800"
          value={editingText}
          onChange={(e) => handleChange(e.target.value)}
          rows={5}
        />
      </dd>
    </dl>
  );
};

export default AboutEdit;
