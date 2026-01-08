import { useNotify } from "@/app/components/notifications/NotificationProvider";
import React from "react";
import { useTranslation } from "react-i18next";

interface DeleteConnectProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConnect: React.FC<DeleteConnectProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const notify = useNotify();

  const { t } = useTranslation("common");
  if (!open) return null;
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleConfirm = () => {
    onConfirm();
    notify(t("section.connect.notify.deleted"), "error");
  };
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {t("section.connect.modal.deleteModal")}
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
          {t("section.connect.modal.subtitleDeleteModal")}
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-300 dark:bg-neutral-700 text-black dark:text-white cursor-pointer"
            onClick={onClose}
          >
            {t("actions.cancel")}
          </button>

          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            onClick={handleConfirm}
          >
            {t("actions.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConnect;
