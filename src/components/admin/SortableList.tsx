import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (next: T[]) => void;
  renderItem: (item: T) => ReactNode;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
      className="flex items-stretch gap-2"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="px-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-gold select-none touch-none"
        title="Vedä järjestääksesi"
        aria-label="Vedä järjestääksesi"
      >
        ⋮⋮
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}