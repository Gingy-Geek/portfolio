"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import useConnectEdit from "@/app/hooks/useConnect";
import ConnectsList from "../Connect/ConnectsList";
import { useTranslation } from "react-i18next";

const ConnectEdit: React.FC = () => {
  const {
    connectSection,
    tempConnects,
    toggleVisibility,
    addConnect,
    saveConnect,
    deleteConnect,
    reorderConnect,
  } = useConnectEdit();
  const { t } = useTranslation("common");
  if (!connectSection) return null;

  const { visible } = connectSection;

  return (
    <dl
      className={cn(
        "flex flex-col gap-3 rounded bg-gray-100 dark:bg-gray-900",
        visible ? "opacity-100" : "opacity-40"
      )}
    >
      <dt className="flex items-center justify-between text-gray-900 dark:text-gray-100 font-semibold text-lg p-2">
        <h3>{t("navbar.connect")}</h3>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleVisibility}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            title={
              visible
                ? t("section.hideToggle.hide")
                : t("section.hideToggle.show")
            }
          >
            {visible ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </dt>

      <ConnectsList
        items={tempConnects}
        onAdd={addConnect}
        onSave={saveConnect}
        onDelete={deleteConnect}
        onReorder={reorderConnect}
      />
    </dl>
  );
};

export default ConnectEdit;
