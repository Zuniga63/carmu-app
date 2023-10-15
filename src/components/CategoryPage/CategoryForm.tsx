import { FormEventHandler } from 'react';
import { Drawer, Textarea, TextInput } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';
import CustomButton from '@/components/CustomButton';
import DrawerHeader from '@/components/DrawerHeader';
import DrawerBody from '@/components/DrawerBody';
import { useCategoryForm } from '@/hooks/category-page/use-category-form';

export default function CategoryForm() {
  const {
    isOpen,
    name,
    description,
    isLargeScreen,
    isUpdate,
    isLoading,
    errors,
    updateName,
    updateDescription,
    submit,
    closeForm,
  } = useCategoryForm();

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    submit();
    // const formData = getData();

    // if (categoryToUpdate) {
    //   const arg = { category: categoryToUpdate, data: formData };
    //   dispatch(updateCategory(arg));
    // } else dispatch(storeCategory(formData));
  };

  return (
    <Drawer
      opened={isOpen}
      onClose={closeForm}
      padding={0}
      size={isLargeScreen ? 'md' : '100%'}
      withCloseButton={false}
      position="left"
    >
      <DrawerHeader title={!isUpdate ? 'Nueva Categoría' : name} onClose={closeForm} />
      <DrawerBody>
        <form onSubmit={handleSubmit}>
          <div className="mx-auto mb-4 w-11/12">
            <TextInput
              label={<span className="font-sans text-light">Nombre</span>}
              placeholder="Escribe el nombre aquí."
              id="categoryName"
              required
              value={name}
              onChange={({ target }) => updateName(target.value)}
              disabled={isLoading}
              error={errors?.name?.message}
            />

            <Textarea
              label={<span className="font-sans text-light">Descripción</span>}
              placeholder="Escribe una descripción aqui."
              value={description}
              onChange={({ target }) => updateDescription(target.value)}
              disabled={isLoading}
              error={errors?.description?.message}
            ></Textarea>
          </div>
          <footer className="flex items-center justify-end gap-x-2 px-4 py-2">
            {isLoading && (
              <span className="animate-pulse text-xs text-slate-200">{isUpdate ? 'Actualizando' : 'Guardando'}...</span>
            )}
            <CustomButton disabled={isLoading} type="submit">
              <div className="flex items-center gap-x-2">
                <IconDatabase size={16} />{' '}
                <span className="text-base">{isUpdate ? <span>Actualizar</span> : <span>Guardar</span>}</span>
              </div>
            </CustomButton>
          </footer>
        </form>
      </DrawerBody>
    </Drawer>
  );
}
