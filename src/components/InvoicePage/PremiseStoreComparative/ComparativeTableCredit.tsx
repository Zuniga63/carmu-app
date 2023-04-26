import Statistic from './Statistic';
import { currencyFormat } from 'src/utils';

type Props = {
  statistic: Statistic;
};

function ComparativeTableCredit({ statistic }: Props) {
  const isSame = statistic.amount === statistic.average;

  return (
    <div className="relative mb-1 rounded border border-red-500 px-2 pt-4 pb-2">
      <h2 className="absolute top-0 left-4 -translate-y-1/2 rounded-full border border-red-500 bg-red-400 px-2 text-center text-xs font-bold tracking-wider text-white">
        Créditos
      </h2>
      <div className="flex flex-col gap-y-2 ">
        {Boolean(statistic.amount) && (
          <div className="flex flex-grow items-center justify-center gap-x-1 rounded-md bg-red-500 bg-opacity-10">
            <span className="text-sm tracking-widest">
              Neto: {currencyFormat(statistic.amount)}
            </span>
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
        )}
        {!isSame && (
          <div className="flex flex-grow items-center justify-center gap-x-1 rounded-md bg-red-500 bg-opacity-10">
            <span className="text-sm tracking-widest">
              Promedio: {currencyFormat(statistic.getAverage(2))}
            </span>
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

export default ComparativeTableCredit;
