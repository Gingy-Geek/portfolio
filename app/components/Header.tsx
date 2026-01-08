"use client";
import { useAppContext } from "@/context/AppContext";
import HeaderViewProfile from "./Header/HeaderViewProfile";
import HeaderEditProfile from "./Header/HeaderEditProfile";

import { useTranslation } from "react-i18next";

export default function Header() {
  const { user, editMode } = useAppContext();
  const { t } = useTranslation("common");

  const getLabelString = (label: string) => {
    const formatted =
      label.charAt(0).toLowerCase() + label.slice(1).replaceAll(" ", "");

    return `navbar.${formatted}`;
  };

  return (
    <header className="flex flex-col items-center w-full mb-10 relative">
      {editMode ? <HeaderEditProfile /> : <HeaderViewProfile />}

      <nav className="flex gap-8 mt-6 text-sm text-gray-600 dark:text-gray-400">
        {user.sections
          .filter((sec) => sec.visible)
          .map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="hover:text-black dark:hover:text-white transition"
            >
              {t(getLabelString(sec.label))}
            </a>
          ))}
      </nav>
    </header>
  );
}
