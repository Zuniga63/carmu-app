import React from 'react';
import { DraggableProvided } from '@hello-pangea/dnd';
import { IconArrowsMove, IconBox, IconCategory2, IconEditCircle, IconTrash } from '@tabler/icons';
import { ICategory } from 'src/types';
import { Button, Tooltip } from '@mantine/core';
import { useAppDispatch } from 'src/store/hooks';
import { showCategoryForm, destroyCategory } from 'src/features/CategoryPage';

interface Props {
  provided: DraggableProvided;
  category: ICategory;
}

export default function DragAndDropCategoryItem({ provided, category }: Props) {
  const dispatch = useAppDispatch();
  const productCount = category.products.length;
  const subcategoryCount = category.subcategories.length;

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
          <p className="line-clamp-2 text-xs text-slate-400">{category.description}</p>
          <div className="mt-2 flex justify-start gap-x-2 px-2">
            <Tooltip label={`Tiene ${productCount} producto${productCount !== 1 ? 's' : ''}`} color="blue" withArrow>
              <div className="flex cursor-help items-center text-xs">
                <IconBox size={16} className="mr-2 inline-block" /> <span>{productCount}</span>
              </div>
            </Tooltip>
            <Tooltip label="Subcategorías" withArrow arrowSize={6} color="indigo">
              <div className="flex cursor-help items-center text-xs">
                <IconCategory2 size={16} className="mr-2 inline-block" /> <span>{subcategoryCount}</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="ml-10 mt-2 flex gap-x-2">
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
