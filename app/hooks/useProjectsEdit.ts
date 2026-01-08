// src/hooks/useProjectsEdit.ts
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import type { ProjectLink, ProjectArtwork } from "@/models/user";
import { useNotify } from "../components/notifications/NotificationProvider";
import { useTranslation } from "react-i18next";

export function useProjectsEdit() {
  const { tempUser, setTempUserWithFlag } = useAppContext();
  const notify = useNotify()
  const { t } = useTranslation("common");

  const projectsSection = tempUser.sections.find((s) => s.id === "projects");
  if (!projectsSection) {
    throw new Error("Projects section not found in tempUser");
  }

  const initialLinks = (projectsSection.data.links ?? []) as ProjectLink[];
  const initialArt = (projectsSection.data.artWork ?? []) as ProjectArtwork[];

  const [tempLinks, setTempLinks] = useState<ProjectLink[]>(initialLinks);
  const [tempArtWork, setTempArtWork] = useState<ProjectArtwork[]>(initialArt);

  const updateUserSectionData = (patch: Partial<typeof projectsSection.data>) => {
    setTempUserWithFlag({
      ...tempUser,
      sections: tempUser.sections.map((sec: any) =>
        sec.id === "projects" ? { ...sec, data: { ...sec.data, ...patch } } : sec
      ),
    });
  };

  const toggleVisibility = () => {
    const newVisible = !projectsSection.visible;

    setTempUserWithFlag({
        ...tempUser,
        sections: tempUser.sections.map((sec: any) =>
          sec.id === "projects" ? { ...sec, visible: newVisible } : sec
        ),
      });

      notify(
        newVisible ? t("section.projects.notify.visible") : t("section.projects.notify.noVisible"),
        newVisible ? "success" : "info"
      );
  };


  const setType = (type: "all" | "links" | "artwork") => {
    updateUserSectionData({ type });
  };

  // Links CRUD
  const addLink = (link: ProjectLink) => {
    const updated = [...tempLinks, link];
    setTempLinks(updated);
    updateUserSectionData({ links: updated });
  };

  const saveLink = (link: ProjectLink) => {
    const updated = tempLinks.map((l) => (l.id === link.id ? link : l));
    setTempLinks(updated);
    updateUserSectionData({ links: updated });
  };

  const deleteLink = (id: string) => {
    const updated = tempLinks.filter((l) => l.id !== id);
    setTempLinks(updated);
    updateUserSectionData({ links: updated });
  };

  const reorderLinks = (newOrder: ProjectLink[]) => {
    setTempLinks(newOrder);
    updateUserSectionData({ links: newOrder });
  };

  // Artwork CRUD
  const addArtwork = (art: ProjectArtwork) => {
    const updated = [...tempArtWork, art];
    setTempArtWork(updated);
    updateUserSectionData({ artWork: updated });
  };

  const saveArtwork = (art: ProjectArtwork) => {
    const updated = tempArtWork.map((a) => (a.id === art.id ? art : a));
    setTempArtWork(updated);
    updateUserSectionData({ artWork: updated });
  };

  const deleteArtwork = (id: string) => {
    const updated = tempArtWork.filter((a) => a.id !== id);
    setTempArtWork(updated);
    updateUserSectionData({ artWork: updated });
  };

  const reorderArtwork = (newOrder: ProjectArtwork[]) => {
    setTempArtWork(newOrder);
    updateUserSectionData({ artWork: newOrder });
  };

  return {
    projectsSection,
    tempLinks,
    tempArtWork,
    toggleVisibility,
    setType,
    addLink,
    saveLink,
    deleteLink,
    reorderLinks,
    addArtwork,
    saveArtwork,
    deleteArtwork,
    reorderArtwork,
  };
}

export default useProjectsEdit;
