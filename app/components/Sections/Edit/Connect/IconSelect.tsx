// components/IconDropdownOptions.tsx
import { ICON_MAP } from "@/app/config/iconMap";
import { useTranslation } from "react-i18next";

interface IconDropdownOptionsProps {
  onSelect: (key: string | undefined) => void;
}

export const IconDropdownOptions: React.FC<IconDropdownOptionsProps> = ({
  onSelect,
}) => {
  const { t } = useTranslation("common");
  return (
    <div className="absolute left-0 right-0 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded shadow mt-1 z-10 max-h-60 overflow-y-auto">
      {Object.keys(ICON_MAP).map((key) => (
        <div
          key={key}
          onClick={() => onSelect(key)}
          className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
        >
          <img src={ICON_MAP[key]} className="w-5 h-5 invert-0 dark:invert" />
          <span className="text-gray-800 dark:text-gray-200 capitalize">
            {key}
          </span>
        </div>
      ))}

      {/* Opción: Other */}
      <div
        onClick={() => onSelect(undefined)}
        className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
      >
        <img src="/icons/other.svg" className="w-5 h-5 invert-0 dark:invert" />
        <span className="text-gray-800 dark:text-gray-200">
          {t("form.socialMedia.other")}
        </span>
      </div>
    </div>
  );
};
