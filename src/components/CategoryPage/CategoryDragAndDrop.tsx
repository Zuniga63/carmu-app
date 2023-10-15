import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { IconPencilPlus } from '@tabler/icons-react';
import DragAndDropCategoryItem from './DragAndDropCategoryItem';
import Button from '@/components/CustomButton';
import { useCategoryDragAndDrop } from '@/hooks/category-page/use-category-drag-and-drop';
import CategoryDragAndDropMessage from './category-drag-and-drop-message';

interface Props {
  title: string;
  description?: string;
}

export default function CategoryDragAndDrop({ title, description }: Props) {
  const { isBrowser, showMessage, message, categories, isLoading, isSuccess, isError, showCreateForm, reorderList } =
    useCategoryDragAndDrop();

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;
    if (source.index === destination.index && source.droppableId === destination.droppableId) return;

    reorderList(source.index, destination.index);
  };

  const handleCreateClick = () => showCreateForm();

  return (
    <div className="mx-auto w-11/12">
      <header className="rounded-t-md border-x border-t border-header bg-header px-4 py-2">
        <h2 className="text-center text-xl font-bold">{title}</h2>
        <p className="text-center text-sm text-gray-400">{description}</p>
      </header>

      <div className="min-h-[100px] border-x border-header px-4 py-4">
        {isBrowser && (
          <DragDropContext onDragEnd={handleDragEnd}>
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
        {isLoading && <CategoryDragAndDropMessage isVisible>Guardando...</CategoryDragAndDropMessage>}

        {isSuccess && (
          <CategoryDragAndDropMessage isVisible={showMessage} isSuccess>
            {message}
          </CategoryDragAndDropMessage>
        )}

        {isError && (
          <CategoryDragAndDropMessage isVisible={showMessage} isError>
            {message}
          </CategoryDragAndDropMessage>
        )}

        <Button onClick={handleCreateClick}>
          <div className="flex gap-x-2">
            <IconPencilPlus size={24} />
            <span>Agregar</span>
          </div>
        </Button>
      </footer>
    </div>
  );
}
