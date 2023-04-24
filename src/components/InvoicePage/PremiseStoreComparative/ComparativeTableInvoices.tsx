import React from 'react';
import Statistic from './Statistic';

type Props = {
  statistic: Statistic;
};
function ComparativeTableInvoices({ statistic }: Props) {
  const isSame = statistic.amount === statistic.average;

  return (
    <div className="relative mb-1 rounded border border-orange-500 px-2 pt-4 pb-2">
      <h2 className="absolute top-0 left-4 -translate-y-1/2 rounded-full border border-orange-500 bg-orange-400 px-2 text-center text-xs font-bold tracking-wider text-white">
        Facturas
      </h2>
      <div className="flex gap-x-2">
        <div className="flex flex-grow items-center justify-center gap-x-1 rounded-md bg-orange-500 bg-opacity-10">
          <span>{statistic.amount}</span>
          <span
            className={
              statistic.growthRate === 0
                ? 'hidden text-xs text-inherit'
                : statistic.growthRate > 0
                ? 'text-xs text-green-500'
                : 'text-xs text-red-500'
            }
          >
            ({statistic.getGrowthRate(1)}%)
          </span>
        </div>
        {!isSame && (
          <div className="flex flex-grow items-center justify-center gap-x-1 rounded-md bg-orange-500 bg-opacity-10">
            <span>{statistic.getAverage(2)}</span>
            <span
              className={
                statistic.averageGrowthRate === 0
                  ? 'hidden text-xs'
                  : statistic.averageGrowthRate > 0
                  ? 'text-xs italic text-green-500'
                  : 'text-xs italic text-red-500'
              }
            >
              ({statistic.getAverageGrowthRate(1)}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparativeTableInvoices;
