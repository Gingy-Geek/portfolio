"use client";
import { useAppContext } from "@/context/AppContext";
import Avatar from "react-avatar";

export default function HeaderViewProfile() {
  const { user } = useAppContext();

  return (
    <div className="flex items-center gap-6 max-md:flex-col">
      <Avatar
        name={user.name}
        src={user.avatar}
        size="120"
        round={true}
        textSizeRatio={2}
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
