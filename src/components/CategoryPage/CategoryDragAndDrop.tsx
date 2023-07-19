import React from 'react';
import { ICategory } from 'src/types';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { IconCircleCheck, IconCircleX, IconPencilPlus } from '@tabler/icons';
import DragAndDropCategoryItem from './DragAndDropCategoryItem';
import Button from 'src/components/CustomButton';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { categoryPageSelector, showCategoryForm, storeCategoryOrder } from 'src/features/CategoryPage';
import { Loader } from '@mantine/core';

interface Props {
  title: string;
  description?: string;
}

export default function CategoryDragAndDrop({ title, description }: Props) {
  const [isBrowser, setIsBrowser] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const {
    categories,
    storeOrderLoading: loading,
    storeOrderIsSuccess: success,
    storeOrderError: error,
  } = useAppSelector(categoryPageSelector);

  const dispatch = useAppDispatch();

  const reorderList = (fromIndex: number, toIndex: number): ICategory[] => {
    const result = categories.slice();
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  };

  const dragEndHanler = ({ source, destination }: DropResult) => {
    if (!destination || (source.index === destination.index && source.droppableId === destination.droppableId)) {
      return;
    }

    const originalList = categories.slice();
    const newList = reorderList(source.index, destination.index);
    dispatch(storeCategoryOrder({ originalList, newList }));
  };

  useEffect(() => {
    setIsBrowser(typeof window !== undefined);
  }, []);

  useEffect(() => {
    let id: NodeJS.Timeout | undefined;

    if (success || error) {
      setShowMessage(true);
      id = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }

    return () => {
      clearTimeout(id);
    };
  }, [success, error]);

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
                  <ul {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
                    {categories.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {draggableProvided => <DragAndDropCategoryItem provided={draggableProvided} category={item} />}
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

      <footer className="flex min-h-[40px] items-center justify-end gap-x-4 rounded-b-md border-x border-b border-dark bg-header px-4 py-2">
        {loading ? (
          <div className="flex gap-x-2">
            <Loader size="xs" />
            <span className="animate-pulse text-xs">Guardando...</span>
          </div>
        ) : null}
        {success && showMessage ? (
          <div className="flex gap-x-2 text-green-500">
            <IconCircleCheck size={16} />
            <span className="text-xs text-green-500 text-opacity-90">Orden guardado.</span>
          </div>
        ) : null}
        {error && showMessage ? (
          <div className="flex gap-x-2 text-red-500">
            <IconCircleX size={16} />
            <span className="text-xs text-red-500 text-opacity-90">No se pudo guardar</span>
          </div>
        ) : null}
        <Button onClick={() => dispatch(showCategoryForm())}>
          <div className="flex gap-x-2">
            <IconPencilPlus size={24} />
            <span>Agregar</span>
          </div>
        </Button>
      </footer>
    </div>
  );
}
