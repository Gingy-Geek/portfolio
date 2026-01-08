"use client";

import React from "react";
import { Plus, GripVertical, Pencil, Trash2, ArrowUpRight } from "lucide-react";
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

import SortableItem from "../SortableItem";
import AddProjectLink from "./modals/AddProjectLink";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import EditProjectModal from "./modals/EditProjectModal";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { useTranslation } from "react-i18next";


type ProjectLink = any;

interface Props {
  items: ProjectLink[];
  onAdd: (p: ProjectLink) => void;
  onSave: (p: ProjectLink) => void;
  onDelete: (id: string) => void;
  onReorder: (newOrder: ProjectLink[]) => void;
}

const LinksList: React.FC<Props> = ({
  items,
  onAdd,
  onSave,
  onDelete,
  onReorder,
}) => {
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
  const { t } = useTranslation("common");

  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [editingItem, setEditingItem] = React.useState<ProjectLink | null>(
    null
  );
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

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
      <h6 className="text-gray-600 dark:text-gray-400">{t("section.projects.types.links")}</h6>

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
              style={{ touchAction: 'pan-y' }}
            >
              {items.map((item: any) => (
                <SortableItem key={item.id} item={item}>
                  {({ dragListeners, dragAttributes }: any) => (
                    <div className="rounded-lg px-2 py-2 flex items-center hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                      {/* contenido */}
                      <div className="flex-1">
                        <div className="flex gap-4 items-center">
                          <img
                            src={item.icon}
                            alt="icon"
                            width={20}
                            height={20}
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{item.title}</span>
                              <ArrowUpRight className="w-5 h-5 inline-block" />

                              <p className="text-xs ml-2">{item.year}</p>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* acciones */}
                      <div className="flex items-center gap-3 pl-3">
                        {/* DRAG HANDLE - CON TOUCH-ACTION */}
                        <div
                          {...dragAttributes}
                          {...dragListeners}
                          className="cursor-grab active:cursor-grabbing touch-none"
                          style={{ touchAction: 'none' }}
                        >
                          <GripVertical
                            className="text-gray-500 dark:text-gray-400"
                            size={18}
                          />
                        </div>

                        <Pencil
                          size={18}
                          className="cursor-pointer"
                          onClick={() => {
                            setEditingItem(item);
                            setOpenEdit(true);
                          }}
                        />

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

        {/* botón agregar */}
        <div
          className="cursor-pointer rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-2 py-6 flex items-center justify-center"
          onClick={() => setOpenAdd(true)}
        >
          <Plus size={24} />
        </div>
      </div>

      {/* === MODALES === */}
      <AddProjectLink
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={(data) => {
          onAdd(data);
          setOpenAdd(false);
        }}
        tempLinks={items}
      />

      <EditProjectModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={editingItem}
        onSave={(data) => {
          onSave(data);
          setOpenEdit(false);
        }}
      />

      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          if (deleteId != null) onDelete(deleteId);
          setOpenDelete(false);
        }}
        type="links"
      />
    </dd>
  );
};

export default LinksList;