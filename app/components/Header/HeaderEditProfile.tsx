"use client";

import { useAppContext } from "@/context/AppContext";
import { Pencil } from "lucide-react";
import { useState } from "react";
import HeaderEditModal from "./HeaderEditModal";
import Avatar from "react-avatar";

export default function HeaderProfile() {
  const { tempUser } = useAppContext();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative flex items-center gap-6 max-md:flex-col rounded bg-gray-100 dark:bg-gray-900 p-4 border-2 border-gray-500">
        <button
          onClick={() => setOpen(true)}
          className="absolute -top-3 -right-3 bg-gray-600 text-white rounded-full p-2 shadow-md hover:bg-gray-700 transition"
          title="Editar perfil"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <Avatar
          name={tempUser.name}
          src={tempUser.avatar}
          size="120"
          round={true}
          textSizeRatio={2}
        />

        <div className="text-center md:text-left">
          <h1 className="text-2xl font-semibold">{tempUser.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {tempUser.subTitle}
          </p>
        </div>
      </div>

      {open && <HeaderEditModal onClose={() => setOpen(false)} />}
    </>
  );
}
