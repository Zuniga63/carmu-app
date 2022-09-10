import React from 'react';
import { DraggableProvided } from '@hello-pangea/dnd';
import { IconArrowsMove, IconBox, IconCategory2, IconEditCircle, IconTrash } from '@tabler/icons';
import { Category } from 'types';
import { Button } from '@mantine/core';
import { useAppDispatch } from 'store/hooks';
import { destroyCategory, showCategoryForm } from 'store/reducers/CategoryPage/creators';

interface Props {
  provided: DraggableProvided;
  category: Category;
}

export default function DragAndDropCategoryItem({ provided, category }: Props) {
  const dispatch = useAppDispatch();

  return (
    <li
      {...provided.draggableProps}
      ref={provided.innerRef}
      className="mb-2 block rounded bg-btn-bg px-4 py-2 last:mb-0"
    >
      <div className="flex gap-x-3">
        <div className="flex flex-shrink-0 items-center" {...provided.dragHandleProps}>
          <IconArrowsMove size={24} className="flex-shrink-0" />
        </div>
        <div className="flex-grow">
          <h3>{category.name}</h3>
          <p className="text-xs text-slate-400 line-clamp-2">{category.description}</p>
          <div className="mt-2 flex justify-start gap-x-2 px-2">
            <div className="flex items-center text-xs">
              <IconBox size={16} className="mr-2 inline-block" /> <span>{category.products.length}</span>
            </div>
            <div className="flex items-center text-xs">
              <IconCategory2 size={16} className="mr-2 inline-block" /> <span>{category.products.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2 ml-10 flex gap-x-2">
        <Button size="xs" leftIcon={<IconEditCircle size={16} />} onClick={() => dispatch(showCategoryForm(category))}>
          <span className="text-xs">Editar</span>
        </Button>
        <Button
          size="xs"
          color="red"
          leftIcon={<IconTrash size={16} />}
          onClick={() => dispatch(destroyCategory(category))}
        >
          <span className="text-xs">Eliminar</span>
        </Button>
      </div>
    </li>
  );
}