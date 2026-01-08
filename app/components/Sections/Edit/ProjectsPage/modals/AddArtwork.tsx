import React, { useRef, useState } from "react";
import { ProjectArtwork } from "@/models/user";
import { useNotify } from "@/app/components/notifications/NotificationProvider";
import { useTranslation } from "react-i18next";
interface AddArtModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (art: ProjectArtwork) => void;
}

const AddArtModal: React.FC<AddArtModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const notify = useNotify();
  const { t } = useTranslation("common");

  const [form, setForm] = useState<Omit<ProjectArtwork, "id">>({
    image: "",
    title: "",
    description: "",
    year: "",
  });

  const [errors, setErrors] = useState({
    image: "",
    title: "",
    year: "",
  });

  if (!open) return null;

  const updateField = (
    field: keyof Omit<ProjectArtwork, "id">,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // subir imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateField("image", reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {
      image: form.image ? "" : t("form.errors.image"),
      title: form.title.trim() ? "" : t("form.errors.title"),
      year: form.year.trim() ? "" : t("form.errors.year"),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((e) => e !== "");
  };

  const resetForm = () => {
    setForm({
      image: "",
      title: "",
      description: "",
      year: "",
    });
    setErrors({
      image: "",
      title: "",
      year: "",
    });
  };

  const handClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!validate()) return;

    const newArt: ProjectArtwork = {
      id: crypto.randomUUID(), 
      ...form,
    };

    onAdd(newArt);
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {t("section.projects.artwork.addModal")}
        </h2>

        {/* IMAGE */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-20 h-20 bg-gray-200 dark:bg-neutral-800 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center border ${
              errors.image ? "border border-red-500" : "border-transparent"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {form.image ? (
              <img src={form.image} className="w-full h-full object-cover" />
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
        {errors.image && (
          <p className="text-red-500 text-xs -mt-2 mb-2">{errors.image}</p>
        )}

        {/* TITLE */}
        <label className="block mb-3">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t("form.title")} *
          </span>
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
            className={`mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800 ${
              errors.year ? "border border-red-500" : ""
            }`}
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

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600 cursor-pointer"
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

export default AddArtModal;
