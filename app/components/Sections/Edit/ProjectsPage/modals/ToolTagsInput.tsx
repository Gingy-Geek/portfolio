import React from "react";
import { useTranslation } from "react-i18next";

export function ToolTagsInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = React.useState("");
  const { t } = useTranslation("common");
  const addTag = () => {
    if (!input.trim()) return;
    if (value.includes(input.trim())) return;

    onChange([...value, input.trim()]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="mt-4">
      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-gray-200 dark:bg-neutral-700 text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-xs hover:text-red-500"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 mt-1 w-full p-2 rounded bg-gray-100 dark:bg-neutral-800"
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 rounded bg-gray-300 dark:bg-neutral-700 text-sm"
        >
          {t("actions.add")}
        </button>
      </div>
    </div>
  );
}
