"use client";

import React from "react";
import { Plus, GripVertical, Pencil, Trash2, Section } from "lucide-react";
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
import { Connect } from "@/models/user";
import { cn } from "@/lib/utils";
import AddConnect from "./modals/AddConnect";
import { getIconPath } from "@/app/config/iconMap";
import DeleteConnect from "./modals/DeleteConnect";
import EditConnect from "./modals/EditConnect";
import { useTranslation } from "react-i18next";

interface Props {
  items: Connect[];
  onAdd: (p: Connect) => void;
  onSave: (p: Connect) => void;
  onDelete: (id: string) => void;
  onReorder: (newOrder: Connect[]) => void;
}

const ConnectsList: React.FC<Props> = ({
  items,
  onAdd,
  onSave,
  onDelete,
  onReorder,
}) => {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [editingItem, setEditingItem] = React.useState<Connect | null>(null);
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
      <h6 className="text-gray-600 dark:text-gray-400">
        {t("section.connect.title")}
      </h6>

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
              {items.map((item: any) => (
                <SortableItem key={item.id} item={item}>
                  {({ dragListeners, dragAttributes }: any) => (
                    <div
                      className={cn(
                        "transition-colors duration-200 rounded-lg",
                        "hover:bg-gray-200 dark:hover:bg-gray-800",
                        "px-3 py-3 flex items-center justify-between gap-4"
                      )}
                    >
                      {/* ======== LEFT SIDE / INFO ======== */}
                      <div className="flex items-center gap-4 flex-1">
                        {/* ICON */}
                        <div className="w-6 h-6 flex items-center justify-center">
                          <img
                            alt={`${item.mediaName} icon`}
                            width={24}
                            height={24}
                            src={getIconPath(item.icon)}
                            className="invert-0 dark:invert"
                          />
                        </div>

                        {/* TEXT INFORMATION */}
                        <div className="flex flex-col">
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {item.mediaName}
                          </span>

                          <span className="text-gray-500 dark:text-gray-400">
                            {item.nickName}
                          </span>

                          <span className="text-gray-400 dark:text-gray-500 text-xs break-all">
                            {item.link.startsWith("mailto:")
                              ? item.link.replace("mailto:", "")
                              : item.link}
                          </span>
                        </div>
                      </div>

                      {/* ======== ACTIONS ======== */}
                      <div className="flex items-center gap-3 pl-2">
                        {/* DRAG HANDLE */}
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
                          className="cursor-pointer text-gray-700 dark:text-gray-300"
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
              ))}
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
      <AddConnect
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={(data) => {
          onAdd(data);
          setOpenAdd(false);
        }}
        tempConnect={items}
      />

      <EditConnect
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={editingItem}
        onSave={(data) => {
          onSave(data);
          setOpenEdit(false);
        }}
      />

      <DeleteConnect
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

export default ConnectsList;
