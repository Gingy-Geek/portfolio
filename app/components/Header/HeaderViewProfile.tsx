"use client";
import { useAppContext } from "@/context/AppContext";

export default function HeaderViewProfile() {
  const { user } = useAppContext();

  return (
    <div className="flex items-center gap-6 max-md:flex-col">
      <img
        src={user.avatar}
        alt="Foto de perfil"
        className="w-30 h-30 rounded-full shadow-md object-cover"
      />

      <div className="text-center md:text-left">
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {user.subTitle}
        </p>
      </div>
    </div>
  );
}
