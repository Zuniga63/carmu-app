import { DatePicker } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React from 'react';
import InvoiceFormGroup from './InvoiceFormGroup';

interface Props {
  expeditionDate: Date | null;
  expirationDate: Date | null;
  onUpdateExpedition: React.Dispatch<React.SetStateAction<Date | null>>;
  onUpdateExpiration: React.Dispatch<React.SetStateAction<Date | null>>;
  className?: string | undefined;
}

const InvoiceFormDates: React.FC<Props> = ({
  expeditionDate,
  expirationDate,
  onUpdateExpedition,
  onUpdateExpiration,
  className,
}) => {
  return (
    <InvoiceFormGroup title="Facturación" className={className}>
      {/* Expedition Date */}
      <DatePicker
        label="Fecha de expedición"
        locale="es-do"
        icon={<IconCalendar size={14} />}
        placeholder="Selecciona una fecha"
        value={expeditionDate}
        onChange={value => onUpdateExpedition(value)}
        maxDate={dayjs().toDate()}
        clearable
        className="mb-2"
        size="xs"
      />

      {/* EXPIRATION DATE */}
      <DatePicker
        label="Fecha de vencimiento"
        className="mb-2"
        locale="es-do"
        icon={<IconCalendar size={14} />}
        placeholder="Selecciona una fecha"
        value={expirationDate}
        onChange={value => onUpdateExpiration(value)}
        minDate={dayjs(expeditionDate).toDate()}
        clearable
        size="xs"
        disabled={!expeditionDate}
      />
    </InvoiceFormGroup>
  );
};

export default InvoiceFormDates;
