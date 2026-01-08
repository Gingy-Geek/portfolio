import { useNotify } from "@/app/components/notifications/NotificationProvider";
import { WorkExperience } from "@/models/user";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface EditWorkModalProps {
  open: boolean;
  onClose: () => void;
  data: WorkExperience | null;
  onSave: (updated: WorkExperience) => void;
}

const EditWorkModal: React.FC<EditWorkModalProps> = ({
  open,
  onClose,
  data,
  onSave,
}) => {
  const notify = useNotify();
  const { t } = useTranslation("common");
  const [form, setForm] = useState<WorkExperience | null>(data);
  const [errors, setErrors] = useState({
    title: "",
    start: "",
    end: "",
    workType: "",
  });

  useEffect(() => {
    if (open && data) {
      setForm(data);
      setErrors({ title: "", start: "", end: "", workType: "" });
    }
  }, [open, data]);

  if (!open || !form) return null;

  const updateField = (field: keyof WorkExperience, value: string) => {
    setForm({
      ...form,
      [field]: value,
    });

    // limpiar error al escribir
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSave = () => {
    const newErrors = {
      title: form.title.trim() ? "" : t("form.errors.title"),
      start: form.start.trim() ? "" : t("form.errors.year"),
      end: form.end.trim() ? "" : t("form.errors.year"),
      workType: form.workType ? "" : t("form.errors.workType"),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e !== "");
    if (hasError) return;

    onSave(form);
    notify(t("section.workExperience.notify.edited"), "info");

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {t("section.workExperience.modal.editModal")}
        </h2>

        {/* TITLE */}
        <label className="block mb-1 text-gray-700 dark:text-gray-300 text-sm">
          {t("form.title")} *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}

        {/* DESCRIPTION */}
        <label className="block mt-4 mb-1 text-gray-700 dark:text-gray-300 text-sm">
          {t("form.description")}
        </label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700 resize-none"
        />

        {/* Start year */}
        <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
          {t("form.startYear")} *
        </label>
        <input
          type="text"
          value={form.start}
          onChange={(e) => updateField("start", e.target.value)}
          className={`w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700 ${
            errors.start ? "border-red-500" : ""
          }`}
        />
        {errors.start && (
          <p className="text-red-500 text-xs mt-1">{errors.start}</p>
        )}

        {/*End year */}
        <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
          {t("form.endYear")} *
        </label>
        <input
          type="text"
          value={form.end}
          onChange={(e) => updateField("end", e.target.value)}
          className={`w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700 ${
            errors.end ? "border-red-500" : ""
          }`}
        />
        {errors.end && (
          <p className="text-red-500 text-xs mt-1">{errors.end}</p>
        )}
        {/* WORK TYPE */}
        <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
          {t("form.workType.title")} *
        </label>
        <select
          value={form.workType ?? ""}
          onChange={(e) => updateField("workType", e.target.value)}
          className={`w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700 ${
            errors.workType ? "border-red-500" : ""
          }`}
        >
          <option value="">{t("form.workType.select")}...</option>
          <option value="Remote">{t("form.workType.remote")}</option>
          <option value="Office">{t("form.workType.office")}</option>
          <option value="Hybrid">{t("form.workType.hybrid")}</option>
        </select>

        {errors.workType && (
          <p className="text-red-500 text-xs mt-1">{errors.workType}</p>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-neutral-700 text-black dark:text-white cursor-pointer"
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

export default EditWorkModal;
