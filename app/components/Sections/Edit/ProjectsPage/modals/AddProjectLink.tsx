import React, { useRef, useState } from "react";
import { ProjectLink } from "@/models/user";
import { useNotify } from "@/app/components/notifications/NotificationProvider";
import { ToolTagsInput } from "./ToolTagsInput";
import { useTranslation } from "react-i18next";

interface AddProjectLinkProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newProject: ProjectLink) => void;
  tempLinks: ProjectLink[];
}

const AddProjectLink: React.FC<AddProjectLinkProps> = ({
  open,
  onClose,
  onAdd,
  tempLinks,
}) => {
  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const notify = useNotify();
  const { t } = useTranslation("common");

  const [form, setForm] = useState<Omit<ProjectLink, "id">>({
    icon: undefined,
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    year: "",
    link: "",
    cover: "",
    tools: {
      frontend: [],
      backend: [],
      database: [],
    },
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    year: "",
    link: "",
  });

  if (!open) return null;

  const updateField = (field: keyof Omit<ProjectLink, "id">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // limpiar error si el usuario escribe algo
    if (value.trim() !== "" && errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const updateTools = (
    key: "frontend" | "backend" | "database",
    tags: string[]
  ) => {
    setForm((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [key]: tags,
      },
    }));
  };

  const validate = () => {
    const newErrors = {
      title: form.title.trim() ? "" : t("form.errors.title"),
      description: form.description.trim() ? "" : t("form.errors.description"),
      year: form.year.trim() ? "" : t("form.errors.year"),
      link: form.link.trim() ? "" : t("form.errors.link"),
    };

    setErrors(newErrors);

    return !newErrors.title && !newErrors.year && !newErrors.link;
  };

  const openIconDialog = () => iconInputRef.current?.click();
  const openCoverDialog = () => coverInputRef.current?.click();

  const handleImageUpload =
    (field: "icon" | "cover") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => updateField(field, reader.result as string);
      reader.readAsDataURL(file);
    };

  const formatLink = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };
  const formatSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD") // separa acentos
      .replace(/[\u0300-\u036f]/g, "") // elimina acentos
      .replace(/[^a-z0-9\s-]/g, "") // elimina caracteres raros
      .trim() // quita espacios extremos
      .replace(/\s+/g, "-") // espacios
      .replace(/-+/g, "-"); // evita ----
  };

  const handClose = () => {
    setForm({
      icon: undefined,
      slug: "",
      title: "",
      subtitle: "",
      description: "",
      year: "",
      link: "",
      cover: "",
      tools: {
        frontend: [],
        backend: [],
        database: [],
      },
    });
    setErrors({
      title: "",
      description: "",
      year: "",
      link: "",
    });
    onClose();
  };

  const handleSave = () => {
    if (!validate()) return;

    const newProject: ProjectLink = {
      id: crypto.randomUUID(),
      ...form,
      link: formatLink(form.link),
      slug: formatSlug(form.title),
    };

    onAdd(newProject);
    notify(t("section.projects.notify.added"), "success");
    handClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 
      transition-opacity animate-fade"
      onClick={handleBackdropClick}
    >
      <div
        className="
    bg-white dark:bg-neutral-900
    rounded-lg shadow-lg
    w-full
    max-w-md
    sm:max-w-lg
    md:max-w-2xl
    lg:max-w-4xl
    max-h-[90vh]
    flex flex-col
    animate-scaleIn
  "
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
      >
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("section.projects.links.addModal")}
          </h2>

          {/* ICON UPLOAD */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center
    bg-gray-200 dark:bg-neutral-800"
              onClick={openIconDialog}
            >
              {form.icon ? (
                <img src={form.icon} className="w-full h-full object-cover" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.7.29l1.42 1.42A1 1 0 0011.7 5H19a2 2 0 012 2v1M3 19a2 2 0 002 2h14a2 2 0 002-2V7M8 11h8m-8 4h5"
                  />
                </svg>
              )}
            </div>

            <button
              type="button"
              onClick={openIconDialog}
            className="px-3 py-1 rounded bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600 text-sm cursor-pointer"
            >
              {t("actions.chooseIcon")}
            </button>

            <input
              ref={iconInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload("icon")}
            />
          </div>

          {/* COVER UPLOAD */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center
    bg-gray-200 dark:bg-neutral-800"
              onClick={openCoverDialog}
            >
              {form.cover ? (
                <img src={form.cover} className="w-full h-full object-cover" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.7.29l1.42 1.42A1 1 0 0011.7 5H19a2 2 0 012 2v1M3 19a2 2 0 002 2h14a2 2 0 002-2V7M8 11h8m-8 4h5"
                  />
                </svg>
              )}
            </div>

            <button
              type="button"
              onClick={openCoverDialog}
            className="px-3 py-1 rounded bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600 text-sm cursor-pointer"
            >
              {t("actions.chooseCover")}
            </button>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload("cover")}
            />
          </div>

          {/* TITLE */}
          <label className="block text-gray-700 dark:text-gray-300 text-sm">
            {t("form.title")} *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className={`mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800 ${
              errors.title ? "border border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}

          {/* SUBTITLE */}
          <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
            {t("form.subtitle")}
          </label>
          <input
            value={form.subtitle}
            onChange={(e) => updateField("subtitle", e.target.value)}
            className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800"
          />

          {/* DESCRIPTION */}
          <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
           {t("form.description")} *
          </label>
          <textarea
            placeholder={t("form.placeHolderDesc")}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className={`mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800 ${
              errors.year ? "border border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}

          {/* YEAR */}
          <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
            {t("form.year")} *
          </label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
            className={`mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800 ${
              errors.year ? "border border-red-500" : ""
            }`}
          />
          {errors.year && (
            <p className="text-red-500 text-xs mt-1">{errors.year}</p>
          )}

          {/* LINK */}
          <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
            {t("form.link")} *
          </label>
          <input
            type="text"
            value={form.link}
            onChange={(e) => updateField("link", e.target.value)}
            className={`mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800 ${
              errors.link ? "border border-red-500" : ""
            }`}
          />
          {errors.link && (
            <p className="text-red-500 text-xs mt-1">{errors.link}</p>
          )}
          <ToolTagsInput
            label="Frontend"
            value={form.tools.frontend}
            onChange={(tags) => updateTools("frontend", tags)}
            placeholder="React, Next.js..."
          />

          <ToolTagsInput
            label="Backend"
            value={form.tools.backend}
            onChange={(tags) => updateTools("backend", tags)}
            placeholder="Node, Supabase..."
          />

          <ToolTagsInput
            label={t("slug.database")}
            value={form.tools.database}
            onChange={(tags) => updateTools("database", tags)}
            placeholder="PostgreSQL..."
          />
        </div>

        {/* BUTTONS */}
        <div
          className="
        sticky bottom-0
        bg-white dark:bg-neutral-800
        border-t border-gray-200 dark:border-neutral-700
        px-6 py-4
        flex justify-end gap-3
      "
        >
          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-neutral-700 text-black dark:text-white cursor-pointer"
            onClick={handClose}
          >
            {t("actions.cancel")}
          </button>

          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            onClick={handleSave}
          >
            {t("actions.add")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectLink;
