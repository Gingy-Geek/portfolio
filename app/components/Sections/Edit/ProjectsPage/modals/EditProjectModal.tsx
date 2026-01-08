import { useNotify } from "@/app/components/notifications/NotificationProvider";
import { ProjectLink } from "@/models/user";
import React, { useState, useEffect, useRef } from "react";
import { ToolTagsInput } from "./ToolTagsInput";
import { useTranslation } from "react-i18next";

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  data: ProjectLink | null;
  onSave: (updated: ProjectLink) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  onClose,
  data,
  onSave,
}) => {
  const notify = useNotify();
  const { t } = useTranslation("common");
  const [form, setForm] = useState<ProjectLink | null>(data);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    year: "",
    link: "",
  });

  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  useEffect(() => {
    if (open && data) {
      setForm(data);
      setErrors({ title: "", description: "", year: "", link: "" });
    }
  }, [open, data]);

  if (!open || !form) return null;
  const updateTools = (
    section: "frontend" | "backend" | "database",
    tags: string[]
  ) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            tools: {
              ...prev.tools,
              [section]: tags,
            },
          }
        : prev
    );
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
  const updateField = (field: keyof ProjectLink, value: string) => {
    let newValue = value;
    let slug = form.slug;

    // auto agregar https:// al link
    if (field === "link") {
      if (
        newValue &&
        !newValue.startsWith("http://") &&
        !newValue.startsWith("https://")
      ) {
        newValue = "https://" + newValue;
      }
    } else if (field == "title") {
      slug = formatSlug(newValue);
    }

    setForm({
      ...form,
      [field]: newValue,
      slug,
    });

    // limpiar error al escribir
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSave = () => {
    const newErrors = {
      title: form.title.trim() === "" ? t("form.errors.title") : "",
      description: form.description.trim() ? "" : t("form.errors.description"),
      year: form.year.trim() === "" ? t("form.errors.year") : "",
      link: form.link.trim() === "" ? t("form.errors.link") : "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e !== "");
    if (hasError) return;

    onSave(form);
    notify(t("section.projects.notify.edited"), "info");

    onClose();
  };

  const handleImageUpload =
    (field: "icon" | "cover") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          updateField(field, reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("section.projects.links.editModal")}
          </h2>

          {/* ICON UPLOADER */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center
               bg-gray-200 dark:bg-neutral-800"
              onClick={() => openFileDialog(iconInputRef)}
            >
              {form.icon ? (
                <img src={form.icon} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-500">Upload</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => openFileDialog(iconInputRef)}
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

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center
               bg-gray-200 dark:bg-neutral-800"
              onClick={() => openFileDialog(coverInputRef)}
            >
              {form.cover ? (
                <img src={form.cover} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-500">Upload</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => openFileDialog(coverInputRef)}
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
          <label className="block mb-1 text-gray-700 dark:text-gray-300 text-sm">
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
            onChange={(e) => {
              updateField("description", e.target.value);

              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            rows={1}
            className={`mt-1 w-full p-2 min-h-[100px]
resize-none rounded bg-gray-100 dark:bg-neutral-800 ${
              errors.description ? "border border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}

          {/* YEAR */}
          <label className="block mt-4 mb-1 text-gray-700 dark:text-gray-300 text-sm">
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
          <label className="block mt-4 mb-1 text-gray-700 dark:text-gray-300 text-sm">
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
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("form.tools")}
            </h3>

            <div className="space-y-3">
              <ToolTagsInput
                label="Frontend"
                value={form.tools.frontend}
                onChange={(tags) => updateTools("frontend", tags)}
                placeholder="React, Next.js, Tailwind..."
              />

              <ToolTagsInput
                label="Backend"
                value={form.tools.backend}
                onChange={(tags) => updateTools("backend", tags)}
                placeholder="Node, Express, Nest..."
              />

              <ToolTagsInput
                label={t("slug.database")}
                value={form.tools.database}
                onChange={(tags) => updateTools("database", tags)}
                placeholder="Postgres, MongoDB..."
              />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div
          className="
    sticky bottom-0
    bg-white dark:bg-neutral-800
    border-t dark:border-neutral-700
    px-6 py-4
  "
        >
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded bg-gray-300 dark:bg-neutral-700 text-black dark:text-white"
              onClick={onClose}
            >
              {t("actions.cancel")}
            </button>

            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSave}
            >
              {t("actions.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
