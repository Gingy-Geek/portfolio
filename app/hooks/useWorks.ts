// src/hooks/useWorksEdit.ts
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import type {WorkExperience } from "@/models/user";
import { useNotify } from "../components/notifications/NotificationProvider";
import { useTranslation } from "react-i18next";

export function useWorksEdit() {
  const { tempUser, setTempUserWithFlag } = useAppContext();
  const notify = useNotify()
  const { t } = useTranslation("common");

  const workSection = tempUser.sections.find((s) => s.id === "workExp");
  if (!workSection) {
    throw new Error("Work section not found in tempUser");
  }

  const initialWorks = (workSection.data ?? []) as WorkExperience[];

  const [tempWorks, setTempWorks] = useState<WorkExperience[]>(initialWorks);

  const updateUserSectionData = (newData: WorkExperience[]) => {
  setTempUserWithFlag({
    ...tempUser,
    sections: tempUser.sections.map((sec: any) =>
      sec.id === "workExp"
        ? { ...sec, data: newData }
        : sec
    ),
  });
};



  const toggleVisibility = () => {
    const newVisible = !workSection.visible;

    setTempUserWithFlag({
        ...tempUser,
        sections: tempUser.sections.map((sec: any) =>
          sec.id === "workExp" ? { ...sec, visible: newVisible } : sec
        ),
      });

      notify(
        newVisible ? t("section.workExperience.notify.visible") : t("section.workExperience.notify.noVisible"),
        newVisible ? "success" : "info"
      );
  };

  // Works CRUD
  const addWork = (work: WorkExperience) => {
    const updated = [...tempWorks, work];
    setTempWorks(updated);
    updateUserSectionData(updated);
  };

  const saveWork = (work: WorkExperience) => {
    const updated = tempWorks.map((w) => (w.id === work.id ? work : w));
    setTempWorks(updated);
    updateUserSectionData(updated);
  };

  const deleteWork = (id: string) => {
    const updated = tempWorks.filter((w) => w.id !== id);
    setTempWorks(updated);
    updateUserSectionData(updated);
  };

  const reorderWorks = (newOrder: WorkExperience[]) => {
    setTempWorks(newOrder);
    updateUserSectionData(newOrder);
  };

  return {
    workSection,
    tempWorks,
    toggleVisibility,
    addWork,
    saveWork,
    deleteWork,
    reorderWorks,
  };
}

export default useWorksEdit;
