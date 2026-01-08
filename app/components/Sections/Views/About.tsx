"use client";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "react-i18next";

const About = () => {
  const { user } = useAppContext();
  const { t } = useTranslation("common");

  const aboutSection = user.sections.find((sec) => sec.id === "about");

  return (
    <dl className="flex flex-col gap-3">
      <dt className="text-gray-900 dark:text-gray-100 font-semibold text-lg px-2">
        <h3>{t("navbar.about")}</h3>
      </dt>

      <dd
        className={cn(
          "text-gray-600 dark:text-gray-400 text-sm leading-relaxed",
          "px-2"
        )}
      >
        <p>{aboutSection?.data}</p>
      </dd>
    </dl>
  );
};

export default About;
