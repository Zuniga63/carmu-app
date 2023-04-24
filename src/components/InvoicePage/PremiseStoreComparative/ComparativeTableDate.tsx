import { Dayjs } from 'dayjs';
import React from 'react';

type Props = {
  date: Dayjs;
};

function ComparativeTableDate({ date }: Props) {
  return (
    <td>
      <div className="flex flex-col items-center">
        <p className="text-sm">{date.format('DD')}</p>
        <p className="text-xs capitalize tracking-widest">
          {date.format('dddd')}
        </p>
      </div>
    </td>
  );
}

export default ComparativeTableDate;
