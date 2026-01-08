import { useAppContext } from "@/context/AppContext";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotify } from "../notifications/NotificationProvider";
import Avatar from "react-avatar";

interface Props {
  onClose: () => void;
}

type UserProfile = {
  avatar: string | undefined;
  name: string;
  subTitle: string;
};

//HACER QUE SEA COMO FORM Y QUENO EDITE EL TEMP USER A MENOS QUE APRETE SAVE!!!!!

export default function HeaderEditModal({ onClose }: Props) {
  const { tempUser, setTempUserWithFlag, saveTempUser } = useAppContext();
  const [form, setForm] = useState<UserProfile>({
    avatar: tempUser.avatar,
    name: tempUser.name,
    subTitle: tempUser.subTitle,
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const notify = useNotify();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        updateField("avatar", reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setError(t("form.errors.name"));
      return;
    }
    notify(t("section.profile.notify.saved"), "success");
    setTempUserWithFlag({
      ...tempUser,
      avatar: form.avatar,
      name: form.name,
      subTitle: form.subTitle,
    });
    onClose();
  };

  const updateField = (field: keyof UserProfile, value: string) => {
    setForm({
      ...form,
      [field]: value,
    });

    // limpiar error al escribir
    if (error != "") {
      setError("");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TITULO */}
        <h3 className="text-lg font-semibold mb-4">
          {t("section.profile.modal.title")}
        </h3>

        {/* AVATAR */}
        <div className="relative w-24 h-24 mx-auto">
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer flex items-center justify-center bg-gray-200 dark:bg-neutral-800 text-white text-xl font-bold"
            onClick={() => avatarInputRef.current?.click()}
          >
            {form.avatar ? (
              <Avatar
                name={form.name}
                src={form.avatar}
                size="120"
                round={true}
                textSizeRatio={2}
              />
            ) : (
              form.name.charAt(0).toUpperCase()
            )}
          </div>

          {/* LAPIZ */}
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 shadow-md hover:bg-blue-700 transition"
            title="Editar avatar"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>

        {/* TEXTOS */}
        <div className="flex flex-col gap-3 mt-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={`px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700 ${
              error ? "border-red-500 dark:border-red-500" : ""
            }`}
            placeholder={t("section.profile.modal.placeHolderName")}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}

          <input
            type="text"
            value={form.subTitle}
            onChange={(e) => updateField("subTitle", e.target.value)}
            className="px-3 py-2 rounded border dark:bg-neutral-800 dark:border-neutral-700"
            placeholder={t("section.profile.modal.placeHolderSubtitle")}
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer"
          >
            {t("actions.cancel")}
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            {t("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
