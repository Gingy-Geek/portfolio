import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import type {Connect } from "@/models/user";
import { useNotify } from "../components/notifications/NotificationProvider";
import { useTranslation } from "react-i18next";

export function useConnectEdit() {
  const { tempUser, setTempUserWithFlag } = useAppContext();
  const notify = useNotify()
  const { t } = useTranslation("common");

  const connectSection = tempUser.sections.find((s) => s.id === "connect");
  if (!connectSection) {
    throw new Error("Work section not found in tempUser");
  }

  const initialConnect = (connectSection.data ?? []) as Connect[];

  const [tempConnects, setTempConnects] = useState<Connect[]>(initialConnect);

  const updateUserSectionData = (newData: Connect[]) => {
  setTempUserWithFlag({
    ...tempUser,
    sections: tempUser.sections.map((sec: any) =>
      sec.id === "connect"
        ? { ...sec, data: newData }
        : sec
    ),
  });
};



  const toggleVisibility = () => {
    const newVisible = !connectSection.visible;

    setTempUserWithFlag({
        ...tempUser,
        sections: tempUser.sections.map((sec: any) =>
          sec.id === "connect" ? { ...sec, visible: newVisible } : sec
        ),
      });

      notify(
        newVisible ? t("section.connect.notify.visible") : t("section.connect.notify.noVisible"),
        newVisible ? "success" : "info"
      );
  };

  // CONNECT CRUD
  const addConnect = (connect: Connect) => {
    const updated = [...tempConnects, connect];
    setTempConnects(updated);
    updateUserSectionData(updated);
  };

  const saveConnect = (connect: Connect) => {
    const updated = tempConnects.map((c) => (c.id === connect.id ? connect : c));
    setTempConnects(updated);
    updateUserSectionData(updated);
  };

  const deleteConnect = (id: string) => {
    const updated = tempConnects.filter((w) => w.id !== id);
    setTempConnects(updated);
    updateUserSectionData(updated);
  };

  const reorderConnect = (newOrder: Connect[]) => {
    setTempConnects(newOrder);
    updateUserSectionData(newOrder);
  };

  return {
    connectSection,
    tempConnects,
    toggleVisibility,
    addConnect,
    saveConnect,
    deleteConnect,
    reorderConnect,
  };
}

export default useConnectEdit;
