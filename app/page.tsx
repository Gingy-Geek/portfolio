"use client";
import React from "react";

import About from "./components/Sections/Views/About";
import Projects from "./components/Sections/Views/Projects";
import WorkExp from "./components/Sections/Views/WorkExp";
import Connect from "./components/Sections/Views/Connect";
import AboutEdit from "./components/Sections/Edit/Pages/AboutEdit";
import ProjectsEdit from "./components/Sections/Edit/Pages/ProjectsEdit";
import ConnectEdit from "./components/Sections/Edit/Pages/ConnectEdit";
import WorkExpEdit from "./components/Sections/Edit/Pages/WorkExpEdit";
import { useAppContext } from "@/context/AppContext";
import Header from "./components/Header";
import { cn } from "@/lib/utils";
import { useNotify } from "./components/notifications/NotificationProvider";
import { useTranslation } from "react-i18next";
import { Loading } from "./components/Loading";

export default function Main() {
  const {
    user,
    setTempUser,
    saveTempUser,
    editMode,
    setEditMode,
    hasChanges,
    setHasChanges,
  } = useAppContext();
  const [showConfirmExit, setShowConfirmExit] = React.useState(false);
  const notify = useNotify();
  const [mounted, setMounted] = React.useState(false);
  const { t, ready } = useTranslation("common");
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return <Loading />;
  }

  const aboutSection = user.sections.find((sec) => sec.id === "about");
  const projectsSection = user.sections.find((sec) => sec.id === "projects");
  const workExpSection = user.sections.find((sec) => sec.id === "workExp");
  const connectSection = user.sections.find((sec) => sec.id === "connect");
  const sections = [
    {
      id: "about",
      Component: About,
      EditComponent: AboutEdit,
      section: aboutSection,
    },
    {
      id: "projects",
      Component: Projects,
      EditComponent: ProjectsEdit,
      section: projectsSection,
    },
    {
      id: "workExp",
      Component: WorkExp,
      EditComponent: WorkExpEdit,
      section: workExpSection,
    },
    {
      id: "connect",
      Component: Connect,
      EditComponent: ConnectEdit,
      section: connectSection,
    },
  ];
  

  const save = () => {
    notify(t("editMode.saved"), "success");
    setEditMode(false);
    saveTempUser();
  };
  const cancel = () => {
    notify(t("editMode.notSaved"), "error");
    setTempUser(user);
    setEditMode(false);
    setHasChanges(false);
  };
  const handleCancelEdit = () => {
    if (hasChanges) {
      setShowConfirmExit(true);
    } else {
      cancel();
    }
  };

  return (
    <div className="flex flex-col gap-20">
      <Header />
      {editMode && (
        <div
          className="
    fixed top-4 left-1/2 -translate-x-1/2 z-30 
    flex items-center justify-between
    bg-blue-50 dark:bg-blue-900 
    border border-blue-300 dark:border-blue-700 
    rounded-xl px-4 py-2 shadow-lg
    w-[90%] max-w-md
  "
        >
          {/* Texto */}
          <span className="text-blue-800 dark:text-blue-200 font-medium">
            {t("editMode.title")}
          </span>

          {/* Botones agrupados */}
          <div className="flex gap-2">
            {/* Botón Cancelar */}
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 cursor-pointer rounded bg-red-500 text-white hover:bg-red-600 text-sm font-medium transition"
            >
              {t("actions.cancel")}
            </button>

            {/* Botón Guardar cambios */}
            <button
              onClick={save}
              disabled={!hasChanges}
              className={cn(
                "px-3 py-1 rounded text-sm font-medium transition",
                hasChanges
                  ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  : "bg-gray-400 text-white cursor-not-allowed opacity-60"
              )}
            >
              {t("actions.save")}
            </button>
          </div>
        </div>
      )}

      {!editMode && (
        <section className="mb-6">
          <div className="flex items-start gap-3 rounded bg-blue-50 dark:bg-blue-900 p-4 border border-blue-200 dark:border-blue-700">
            {/* Icono informativo */}
            <div className="flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-200 text-xl">
                💡
              </span>
            </div>
            {/* Texto */}
            <div className="text-sm text-blue-800 dark:text-blue-200">
              {t("editMode.info")}
            </div>
          </div>
        </section>
      )}

      {sections.map(({ id, Component, EditComponent, section }) => {
        if (!editMode && !section?.visible) return null;
        return (
          <section key={id} id={id}>
            {editMode ? <EditComponent /> : <Component />}
          </section>
        );
      })}
      {showConfirmExit && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowConfirmExit(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              {t("editMode.modal.title")}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              {t("editMode.modal.subtitle")}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmExit(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-neutral-700 text-sm hover:bg-gray-400 dark:hover:bg-neutral-600 cursor-pointer"
              >
                {t("actions.continue")}
              </button>
              <button
                onClick={() => {
                  setShowConfirmExit(false);
                  cancel();
                }}
                className="px-4 py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600 cursor-pointer"
              >
                {t("actions.exit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
