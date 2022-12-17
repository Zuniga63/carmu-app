import React from 'react';
import { Category } from 'types';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { IconCirclePlus } from '@tabler/icons';
import DragAndDropCategoryItem from './DragAndDropCategoryItem';
import Button from 'components/CustomButton';

interface Props {
  title: string;
  description?: string;
  categories: Category[];
  saveOrder(newList: Category[]): void;
  newOrderSaved?: boolean;
  btnAction?(): void;
}

export default function CategoryDragAndDrop({
  title,
  description,
  categories,
  btnAction,
  saveOrder,
  newOrderSaved = false,
}: Props) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== undefined);
  }, []);

  const reorderList = (
    list: Category[],
    fromIndex: number,
    toIndex: number
  ): Category[] => {
    const result = [...list];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  };

  const dragEndHanler = ({ source, destination }: DropResult) => {
    if (
      !destination ||
      (source.index === destination.index &&
        source.droppableId === destination.droppableId)
    )
      return;
    const newList = reorderList(categories, source.index, destination.index);
    saveOrder(newList);
  };

  return (
    <div className="mx-auto w-11/12">
      <header className="rounded-t-md border-x border-t border-header bg-header px-4 py-2">
        <h2 className="text-center text-xl font-bold">{title}</h2>
        <p className="text-center text-sm text-gray-400">{description}</p>
      </header>

      <div className="min-h-[100px] border-x border-header px-4 py-4">
        {isBrowser && (
          <DragDropContext onDragEnd={dragEndHanler}>
            <div className="scrollbar max-h-80 overflow-y-auto">
              <Droppable droppableId="mainCategories">
                {droppableProvided => (
                  <ul
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    {categories.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {draggableProvided => (
                          <DragAndDropCategoryItem
                            provided={draggableProvided}
                            category={item}
                          />
                        )}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        )}
      </div>

      <footer className="flex min-h-[40px] items-center justify-end gap-x-2 rounded-b-md border-x border-b border-dark bg-header px-4 py-2">
        {newOrderSaved && (
          <span className="text-xs text-gray-500">Guardado.</span>
        )}
        {btnAction && (
          <Button onClick={btnAction}>
            <div className="flex gap-x-2">
              <IconCirclePlus size={24} />
              <span>Agregar</span>
            </div>
          </Button>
        )}
      </footer>
    </div>
  );
}
