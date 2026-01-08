import { useNotify } from "@/app/components/notifications/NotificationProvider";
import { ProjectArtwork } from "@/models/user";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface EditArtModalProps {
  open: boolean;
  onClose: () => void;
  data: ProjectArtwork | null;
  onSave: (updated: ProjectArtwork) => void;
}

const EditArtModal: React.FC<EditArtModalProps> = ({
  open,
  onClose,
  data,
  onSave,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const notify = useNotify();
  const { t } = useTranslation("common");

  const [form, setForm] = useState<ProjectArtwork>({
    id: "-1",
    image: "",
    title: "",
    description: "",
    year: "",
  });

  // === NUEVO: errores ===
  const [errors, setErrors] = useState({
    title: "",
    year: "",
  });

  // cargar datos al abrir modal
  useEffect(() => {
    if (open && data) {
      setForm(data);
      setErrors({ title: "", year: "" }); // reset
    }
  }, [open, data]);

  // cerrar clic afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  // actualizar campos y limpiar error
  const updateField = (field: keyof ProjectArtwork, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // --- ARCHIVO ---
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateField("image", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // === VALIDACIÓN ===
  const handleSave = () => {
    const newErrors = {
      title: form.title.trim() === "" ? t("form.errors.title") : "",
      year: form.year.toString().trim() === "" ? t("form.errors.year") : "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e !== "");
    if (hasError) return;

    onSave(form);
    notify(t("section.projects.notify.edited"), "success");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {t("section.projects.artwork.editModal")}
        </h2>

        {/* IMAGEN */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-20 h-20 bg-gray-200 dark:bg-neutral-800 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            {form.image ? (
              <img src={form.image} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-gray-500">Upload</span>
            )}
          </div>

          <button
            type="button"
            className="px-3 py-1 rounded bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600 text-sm cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {t("actions.chooseImage")}
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* TITLE */}
        <label className="block mb-3">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t("form.title")} *
          </span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </label>

        {/* YEAR */}
        <label className="block mb-3">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t("form.year")} *
          </span>
          <input
            type="number"
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
            className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800"
          />
          {errors.year && (
            <p className="text-red-500 text-xs mt-1">{errors.year}</p>
          )}
        </label>

        {/* DESCRIPTION */}
        <label className="block mb-3">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t("form.description")}
          </span>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800 h-20 resize-none"
          />
        </label>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600 cursor-pointer"
            onClick={onClose}
          >
            {t("actions.cancel")}
          </button>

          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            onClick={handleSave}
          >
            {t("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditArtModal;
