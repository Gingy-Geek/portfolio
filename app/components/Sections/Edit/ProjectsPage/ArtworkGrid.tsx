// src/components/ProjectsEdit/ArtworkGrid.tsx
"use client";

import React from "react";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "../SortableItem";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import EditArtModal from "./modals/EditArtModal";
import AddArtwork from "./modals/AddArtwork";
import { useTranslation } from "react-i18next";

type ProjectArtwork = any;

interface Props {
  items: ProjectArtwork[];
  onAdd: (p: ProjectArtwork) => void;
  onSave: (p: ProjectArtwork) => void;
  onDelete: (id: string) => void;
  onReorder: (newOrder: ProjectArtwork[]) => void;
}

const ArtworkGrid: React.FC<Props> = ({
  items,
  onSave,
  onAdd,
  onDelete,
  onReorder,
}) => {
  // Sensores optimizados para móvil
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 10,
        tolerance: 15,
      },
    })
  );

  const [openDelete, setOpenDelete] = React.useState(false);
  const [openEditArt, setOpenEditArt] = React.useState(false);
  const [openAddArt, setOpenAddArt] = React.useState(false);
  const [editingArt, setEditingArt] = React.useState<ProjectArtwork | null>(
    null
  );
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const { t } = useTranslation("common");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newArr = arrayMove(items, oldIndex, newIndex);
    onReorder(newArr);
  };

  return (
    <dd className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-2">
      <h6 className="text-gray-600 dark:text-gray-400">
        {t("section.projects.types.artwork")}
      </h6>

      <div className="h-120 overflow-y-auto pr-2 mt-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
            style={{ touchAction: "pan-y" }}
          >
            <div
              className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center justify-center cursor-pointer"
              onClick={() => setOpenAddArt(true)}
            >
              <Plus size={32} />
            </div>

            {/* --- ITEMS ORDENABLES --- */}
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={rectSortingStrategy}
            >
              {items.map((img: any) => (
                <SortableItem key={img.id} item={img}>
                  {({ dragListeners, dragAttributes }: any) => (
                    <div className="aspect-square relative rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800 group">
                      {/* Imagen sin drag */}
                      <img
                        src={img.image}
                        alt={img.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />

                      {/* Indicador de drag  */}
                      <div
                        className="absolute top-1 left-1 p-1 rounded bg-black/50 group-hover:opacity-100 transition cursor-grab active:cursor-grabbing touch-none"
                        style={{ touchAction: "none" }}
                        {...dragListeners}
                        {...dragAttributes}
                      >
                        <GripVertical className="text-white" size={16} />
                      </div>

                      {/* Botones de acción */}
                      <div className="absolute bottom-1 right-1 flex gap-2 group-hover:opacity-100 transition">
                        <button
                          onClick={() => {
                            setEditingArt(img);
                            setOpenEditArt(true);
                          }}
                          className="p-1 bg-black/60 text-white rounded hover:bg-black/80 cursor-pointer"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteId(img.id);
                            setOpenDelete(true);
                          }}
                          className="p-1 bg-black/60 text-white rounded hover:bg-black/80 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>

      <AddArtwork
        open={openAddArt}
        onClose={() => setOpenAddArt(false)}
        onAdd={(data) => {
          onAdd(data);
          setOpenAddArt(false);
        }}
      />

      <EditArtModal
        open={openEditArt}
        onClose={() => setOpenEditArt(false)}
        data={editingArt}
        onSave={(data) => {
          onSave(data);
          setOpenEditArt(false);
        }}
      />

      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          if (deleteId != null) onDelete(deleteId);
          setOpenDelete(false);
        }}
        type="artwork"
      />
    </dd>
  );
};

export default ArtworkGrid;
