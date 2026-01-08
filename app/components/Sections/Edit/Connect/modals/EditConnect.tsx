import { useNotify } from "@/app/components/notifications/NotificationProvider";
import { Connect } from "@/models/user";
import React, { useState, useEffect, useRef } from "react";
import { IconDropdownOptions } from "../IconSelect";
import { getIconPath } from "@/app/config/iconMap";
import { useTranslation } from "react-i18next";

interface EditConnectModalProps {
  open: boolean;
  onClose: () => void;
  data: Connect | null;
  onSave: (updated: Connect) => void;
}

const EditConnectModal: React.FC<EditConnectModalProps> = ({
  open,
  onClose,
  data,
  onSave,
}) => {
  const notify = useNotify();
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const { t } = useTranslation("common");

  const [form, setForm] = useState<Connect | null>(data);
  const [errors, setErrors] = useState({
    mediaName: "",
    link: "",
  });
  const isEmail = form?.icon === "gmail";
  const displayLink = (value: string) => {
    if (value.startsWith("mailto:")) {
      return value.replace("mailto:", "");
    }
    return value;
  };

  useEffect(() => {
    if (open && data) {
      setForm(data);
      setErrors({ mediaName: "", link: "" });
    }
  }, [open, data]);

  if (!open || !form) return null;

  const updateField = (field: keyof Connect, value: string) => {
    setForm({
      ...form,
      [field]: value,
    });

    // limpiar error al escribir
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };
  const formatLink = (value: string) => {
    const trimmed = value.trim();

    if (isEmail) {
      return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`;
    }

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return "https://" + trimmed;
    }

    return trimmed;
  };

  const validate = () => {
    let linkError = "";

    if (!form.link.trim()) {
      linkError = t("form.errors.link");
    } else if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.link.trim())) {
        linkError = t("form.errors.email");
      }
    }

    const newErrors = {
      mediaName: form.mediaName.trim() ? "" : t("form.errors.socialMedia"),
      link: linkError,
    };

    setErrors(newErrors);

    return !newErrors.mediaName && !newErrors.link;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...form,
      link: formatLink(form.link),
    });

    notify(t("section.connect.notify.edited"), "info");
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {t("section.connect.modal.editModal")}
        </h2>

        {/* ICON SELECTOR (custom dropdown con iconos) */}
        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
          {t("form.socialMedia.title")} *
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown((prev) => !prev)}
            className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img
                src={getIconPath(form.icon ?? undefined)}
                className="w-5 h-5 opacity-80 invert-0 dark:invert"
              />
              <span className="text-gray-800 dark:text-gray-200">
                {form.icon ?? t("form.socialMedia.other")}
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-300">▼</span>
          </button>

          {openDropdown && (
            <IconDropdownOptions
              onSelect={(key) => {
                setForm({
                  ...form,
                  icon: key,
                  mediaName: key
                    ? key.charAt(0).toUpperCase() + key.slice(1)
                    : "",
                });

                setErrors((prev) => ({ ...prev, mediaName: "" }));
                setOpenDropdown(false);
              }}
            />
          )}
        </div>
        {/* MEDIA NAME (solo editable si icon === undefined) */}
        <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
          {t("form.socialMedia.mediaName")}{" "}
          {form.icon === undefined && <span>*</span>}
        </label>
        <input
          type="text"
          value={form.mediaName}
          disabled={form.icon !== undefined}
          placeholder={
            form.icon !== undefined
              ? t("form.socialMedia.placeholder.autofill")
              : t("form.socialMedia.placeholder.enterName")
          }
          onChange={(e) => updateField("mediaName", e.target.value)}
          className={`w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700 
      ${errors.mediaName ? "border-red-500" : ""}
      ${form.icon !== undefined ? "opacity-60 cursor-not-allowed" : ""}`}
        />
        {errors.mediaName && (
          <p className="text-red-500 text-xs mt-1">{errors.mediaName}</p>
        )}

        {/* NICKNAME (opcional) */}
        <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
          {t("form.socialMedia.userName")}
        </label>
        <input
          type="text"
          value={form.nickName}
          onChange={(e) => updateField("nickName", e.target.value)}
          className="w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700"
        />

        {/* LINK  */}
        <label className="block mt-4 text-gray-700 dark:text-gray-300 text-sm">
          {isEmail ? t("form.email") : t("form.link")} *
        </label>
        <input
          type="text"
          value={displayLink(form.link)}
          placeholder={isEmail ? "email@example.com" : "https://example.com"}
          onChange={(e) => updateField("link", e.target.value)}
          className={`w-full px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700 
    ${errors.link ? "border-red-500" : ""}`}
        />

        {errors.link && (
          <p className="text-red-500 text-xs mt-1">{errors.link}</p>
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

export default EditConnectModal;
