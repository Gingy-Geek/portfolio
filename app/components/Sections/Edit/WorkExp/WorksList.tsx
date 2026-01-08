"use client";

import React from "react";
import { Plus, GripVertical, Pencil, Trash2 } from "lucide-react";
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
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

import SortableItem from "../SortableItem";
import AddWork from "./modals/AddWork";
import { WorkExperience } from "@/models/user";
import { cn } from "@/lib/utils";
import DeleteWork from "./modals/DeleteWork";
import EditWork from "./modals/EditWork";
import { useTranslation } from "react-i18next";

interface Props {
  items: WorkExperience[];
  onAdd: (p: WorkExperience) => void;
  onSave: (p: WorkExperience) => void;
  onDelete: (id: string) => void;
  onReorder: (newOrder: WorkExperience[]) => void;
}

const WorksList: React.FC<Props> = ({
  items,
  onAdd,
  onSave,
  onDelete,
  onReorder,
}) => {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [editingItem, setEditingItem] = React.useState<WorkExperience | null>(
    null
  );
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const { t } = useTranslation("common");

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 15,
      },
    })
  );

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
    <dd className="text-sm leading-relaxed px-2">
      <h6 className="text-gray-600 dark:text-gray-400">{t("section.workExperience.title")}</h6>

      <div className="flex flex-col gap-4 mt-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className="flex flex-col gap-4 mt-2"
              style={{ touchAction: "pan-y" }}
            >
              {items.map((item: any) => {
                const start = item.start?.replace("-", "/");
                const end = item.end ? item.end.replace("-", "/") : t("section.workExperience.present");

                return (
                  <SortableItem key={item.id} item={item}>
                    {({ dragListeners, dragAttributes }: any) => (
                      <div
                        className={cn(
                          "transition-colors duration-200 rounded-lg",
                          "hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-2 flex items-start gap-4"
                        )}
                      >
                        {/* ======== CONTENT ======== */}
                        <div
                          className={cn(
                            "flex-1 flex gap-4 items-start",
                            "max-md:flex-col max-md:items-start max-md:gap-2"
                          )}
                        >
                          {/* FECHAS */}
                          <span className="text-gray-500 min-w-32 w-32 self-start font-medium">
                            {start} — {end}
                          </span>

                          {/* INFO */}
                          <div className="flex flex-col w-full items-start">
                            <p className="text-gray-700 dark:text-gray-200 font-medium">
                              {item.title}
                            </p>

                            <p className="mb-2 text-gray-500 dark:text-gray-400 font-medium">
                              {item.workType}
                            </p>

                            <p className="text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* ======== ACTIONS ======== */}
                        <div className="flex items-center gap-3 pl-3">
                          {/* DRAG HANDLE - CON TOUCH-ACTION */}
                          <div
                            {...dragAttributes}
                            {...dragListeners}
                            className="cursor-grab active:cursor-grabbing touch-none"
                            style={{ touchAction: "none" }}
                          >
                            <GripVertical
                              className="text-gray-500 dark:text-gray-400"
                              size={18}
                            />
                          </div>

                          {/* EDIT */}
                          <Pencil
                            size={18}
                            className="cursor-pointer"
                            onClick={() => {
                              setEditingItem(item);
                              setOpenEdit(true);
                            }}
                          />

                          {/* DELETE */}
                          <Trash2
                            size={18}
                            className="cursor-pointer"
                            onClick={() => {
                              setDeleteId(item.id);
                              setOpenDelete(true);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </SortableItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        {/* ADD BUTTON */}
        <div
          className="cursor-pointer rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-2 py-6 flex items-center justify-center"
          onClick={() => setOpenAdd(true)}
        >
          <Plus size={24} />
        </div>
      </div>

      {/* === MODALES === */}
      <AddWork
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={(data) => {
          onAdd(data);
          setOpenAdd(false);
        }}
        tempWork={items}
      />

      <EditWork
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={editingItem}
        onSave={(data) => {
          onSave(data);
          setOpenEdit(false);
        }}
      />

      <DeleteWork
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          if (deleteId != null) onDelete(deleteId);
          setOpenDelete(false);
        }}
      />
    </dd>
  );
};

export default WorksList;
