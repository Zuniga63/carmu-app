import { Button, Modal, NumberInput, Textarea } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { currencyFormat } from '@/lib/utils';
import { useCloseBoxForm } from '@/hooks/boxes-page/use-close-box-form';

function CloseBoxForm() {
  const {
    isOpen,
    cash,
    cashboxToClose,
    observation,
    isLoading,
    leftover,
    missing,
    enabled,
    errors,
    closeHandler,
    submitHandler,
    formater,
    setCash,
    setObservation,
  } = useCloseBoxForm();

  return (
    <Modal opened={isOpen} onClose={closeHandler} size="sm">
      <form onSubmit={submitHandler}>
        <header>
          <h2 className="text-center text-xl font-bold"> {cashboxToClose?.name}</h2>
        </header>
        <div className="mb-2">
          <NumberInput
            label="Dinero"
            required
            placeholder="Escribe la base aquí"
            hideControls
            min={0}
            step={100}
            value={cash}
            onChange={value => setCash(value)}
            onFocus={({ target }) => target.select()}
            error={errors?.cash?.message}
            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
            formatter={formater}
          />
          <Textarea
            label="Observación"
            value={observation}
            placeholder="Una observación del cierre de caja"
            onChange={({ target }) => setObservation(target.value)}
            error={errors?.observation?.message}
          />

          <div className="min-h-[60px]">
            <p>
              Saldo: <span>{currencyFormat(cashboxToClose?.balance)}</span>
            </p>
            {!!leftover && (
              <p>
                Sobrante: <span>{currencyFormat(leftover)}</span>
              </p>
            )}
            {!!missing && (
              <p>
                Faltante: <span>{currencyFormat(missing)}</span>
              </p>
            )}
          </div>
        </div>
        <footer className="flex items-center justify-end">
          <Button leftIcon={<IconLock />} loading={isLoading} type="submit" disabled={!enabled}>
            Cerrar Caja
          </Button>
        </footer>
      </form>
    </Modal>
  );
}

export default CloseBoxForm;
