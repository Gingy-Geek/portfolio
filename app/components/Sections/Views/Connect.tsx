import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getIconPath } from "@/app/config/iconMap";
import { useTranslation } from "react-i18next";

const Connect = () => {
  const { user } = useAppContext();
  const { t } = useTranslation("common");
  const connectSection = user.sections.find((sec) => sec.id === "connect");

  if (!connectSection) return null;

  const items = connectSection.data;

  const displayLink = (link: string) => {
    if (!link) return "";
    if (link.startsWith("mailto:")) return link.replace("mailto:", "");
    return link;
  };

  return (
    <dl className="flex flex-col gap-3">
      <dt className="text-gray-900 dark:text-gray-100 font-semibold text-lg px-2">
        <h3>{t("navbar.connect")}</h3>
      </dt>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
          {t("status.noData")}
        </div>
      ) : (
        items.map((item: any) => (
          <dd
            key={item.id}
            className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed"
          >
            <a
              href={item.link || "#"}
              target={item.link ? "_blank" : undefined}
              rel={item.link ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (!item.link || item.link.trim() === "") {
                  e.preventDefault();
                }
              }}
              className={cn(
                "flex w-full justify-between px-2 py-2",
                "transition-colors duration-200 cursor-pointer rounded-lg",
                "hover:bg-gray-200 dark:hover:bg-gray-800"
              )}
            >
              {/* IZQUIERDA */}
              <div className="flex gap-4 items-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <img
                    alt={`${item.mediaName} icon`}
                    width={24}
                    height={24}
                    src={getIconPath(item.icon)}
                    className="invert-0 dark:invert"
                  />
                </div>

                <div className="flex flex-col items-start leading-tight">
                  <span className="font-medium">{item.mediaName}</span>

                  {item.link && (
                    <span className="text-gray-400 dark:text-gray-500 text-xs break-all">
                      {displayLink(item.link)}
                    </span>
                  )}
                </div>
              </div>

              {/* DERECHA */}
              <div className="inline-flex items-center gap-1">
                <span className="font-medium">{item.nickName}</span>
                <ArrowUpRight className="w-4 h-4 relative -top-[2px]" />
              </div>
            </a>
          </dd>
        ))
      )}
    </dl>
  );
};

export default Connect;
