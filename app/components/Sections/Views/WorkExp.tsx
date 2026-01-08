import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "react-i18next";

const WorkExp = () => {
  const { user } = useAppContext();
  const { t } = useTranslation("common");
  const workSection = user.sections.find((sec) => sec.id === "workExp");
  if (!workSection) return null;

  const items = workSection.data;

  return (
    <dl className="flex flex-col gap-3">
      {/* TITLE */}
      <dt className="text-gray-900 dark:text-gray-100 font-semibold text-lg px-2">
        <h3>{t("navbar.workExperience")}</h3>
      </dt>

      {/* LISTA */}
      <dd className="text-sm leading-relaxed">
        <div className="flex flex-col gap-4 mt-2">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
              {t("status.noData")}
            </div>
          ) : (
            items.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className={cn(
                    "transition-colors duration-200 rounded-lg",
                    "hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-2"
                  )}
                >
                  <div
                    className={cn(
                      "flex-1 flex gap-4 items-start",
                      "max-md:flex-col max-md:items-start max-md:gap-2"
                    )}
                  >
                    {/* FECHAS */}
                    <span className="text-gray-500 min-w-32 w-32 self-start font-medium">
                      {item.start} — {item.end}
                    </span>

                    {/* INFO */}
                    <div className="flex flex-col w-full items-start">
                      <p className="text-gray-700 dark:text-gray-200 font-medium">
                        {item.title}
                      </p>

                      <p className="mb-2 text-gray-500 dark:text-gray-400 font-medium">
                        {item.workType}
                      </p>

                      <p className="text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </dd>
    </dl>
  );
};

export default WorkExp;
