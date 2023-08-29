import React, { useEffect, useState } from 'react';
import { ISaleHistory } from 'src/types';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import { currencyFormat } from 'src/utils';

dayjs.extend(isToday);
dayjs.extend(isYesterday);

interface Props {
  item: ISaleHistory;
}
const WeeklyHistoryItem = ({ item }: Props) => {
  const [date, setDate] = useState(dayjs(item.operationDate).format('ddd DD MMM hh:mm a'));
  const isSale = item.operationType === 'sale';
  const isCredit = item.operationType === 'credit';
  const isSeparate = item.operationType === 'separate';
  const isSeparatePayment = item.operationType === 'separate_payment';
  const isCreditPayment = item.operationType === 'credit_payment';

  useEffect(() => {
    const dateTime = dayjs(item.operationDate);
    if (dateTime.isToday()) {
      setDate(dateTime.fromNow());
    } else if (dateTime.isYesterday()) {
      setDate(`Ayer a las ${dateTime.format('hh:mm a')}`);
    }
  }, []);
  return (
    <tr
      className={`${isSale && 'bg-emerald-600'} ${isCredit && 'bg-red-600'} ${isSeparate && 'bg-blue-600'} ${
        isCreditPayment && 'bg-orange-600'
      } ${
        isSeparatePayment && 'bg-cyan-600'
      } group bg-opacity-10 transition-colors hover:bg-opacity-40 group-hover:bg-opacity-40 dark:bg-opacity-5`}
    >
      <td className="text-center">
        <span className="text-xs">{date}</span>
      </td>
      <td>
        <p>{item.description || 'No hay información para mostrar'}</p>
        <div className="text-xs font-bold italic">
          {isSale ? <p className="text-green-500">Venta</p> : null}
          {isCredit ? <p className="text-red-500">Credito</p> : null}
          {isSeparate ? <p className="text-blue-500">Apartado</p> : null}
          {isCreditPayment ? <p className="text-orange-500">Abono de credito</p> : null}
          {isSeparatePayment ? <p className="text-cyan-500">Abono de apartado</p> : null}
        </div>
      </td>
      <td className="text-right group-hover:font-bold">{currencyFormat(item.amount)}</td>
      <td></td>
    </tr>
  );
};

export default WeeklyHistoryItem;
