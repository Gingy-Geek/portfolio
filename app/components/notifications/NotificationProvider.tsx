"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Notification = {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
};

interface NotificationContextType {
  notify: (msg: string, type?: Notification["type"]) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState<Notification[]>([]);

  const notify = (message: string, type: Notification["type"] = "info") => {
    const id = Date.now();

    setList((prev) => [...prev, { id, message, type }]);

    // Autoremover a los 3s
    setTimeout(() => {
      setList((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {/* UI LAS NOTIFICACIONES */}
      <div className="fixed right-4 flex flex-col gap-3 z-50 top-20 md:top-4">
        {list.map((n) => (
          <div
            key={n.id}
            className={`
               px-4 py-2 rounded-lg
        border-1 font-medium text-sm
        animate-fade
             ${
               n.type === "success"
                 ? "bg-green-100 border-green-500 text-green-700"
                 : n.type === "error"
                 ? "bg-red-100 border-red-500 text-red-700"
                 : "bg-blue-100 border-blue-500 text-blue-700"
             }
            `}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotify debe usarse dentro de <NotificationProvider>");
  return ctx.notify;
};
