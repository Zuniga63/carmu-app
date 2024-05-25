import dayjs from 'dayjs';
import { Modal, Table } from '@mantine/core';
import { DateRange } from 'react-day-picker';
import { useReactToPrint } from 'react-to-print';
import { IconPrinter } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '../ui/Button';
import { ITransaction } from '@/types';
import BrandLogo from '../Layout/BrandLogo';
import { currencyFormat } from '@/lib/utils';

interface Props {
  dates?: DateRange;
  transactions: ITransaction[];
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransactionReport = ({ dates, transactions, opened, setOpened }: Props) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [incomes, setIncomes] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const printRef = useRef<HTMLDivElement | null>(null);
  const promiseResolveRef = useRef<unknown>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise(resolve => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });

  useEffect(() => {
    const today = dayjs();
    const dateFormat = 'DD [de] MMMM [del] YYYY';
    if (dates?.to && dates.from) {
      setFromDate(dayjs(dates.to).format(dateFormat));
      setToDate(dayjs(dates.from).format(dateFormat));
    } else {
      setFromDate(today.startOf('month').format(dateFormat));
      setToDate(today.format(dateFormat));
    }
  }, [dates]);

  useEffect(() => {
    let incomes = 0;
    let expenses = 0;
    let balance = 0;

    transactions.forEach(({ amount }) => {
      balance += amount;
      incomes += amount > 0 ? amount : 0;
      expenses += amount < 0 ? amount : 0;
    });

    setIncomes(incomes);
    setExpenses(expenses);
    setBalance(balance);
  }, [transactions]);

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      (promiseResolveRef.current as () => void)();
    }
  }, [isPrinting]);

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Reporte de caja" size="xl">
      <div>
        <div className="min-h-screen bg-white px-8 py-4" ref={printRef}>
          <header className="mb-4 flex items-center border-b-2 border-dark pb-2">
            <BrandLogo />
            <div className="flex-grow">
              <div className="flex flex-col items-center">
                <h2 className="px-8 text-center text-xl uppercase text-gray-dark">Movimientos de caja</h2>
                <p className="text-center text-dark ">{process.env.NEXT_PUBLIC_APP_NAME}</p>
              </div>
            </div>

            <div className="text-xs text-gray-dark">
              <p>
                Desde: <span className="font-bold">{fromDate}</span>
              </p>
              <p>
                Hasta: <span className="font-bold">{toDate}</span>
              </p>
            </div>
          </header>
          <div>
            <Table>
              <thead>
                <tr>
                  <th>
                    <div className="text-center text-gray-dark">Fecha</div>
                  </th>
                  <th>
                    <div className="text-gray-dark">Descripción</div>
                  </th>
                  <th>
                    <div className="text-center text-gray-dark">Importe</div>
                  </th>
                  <th>
                    <div className="text-center text-gray-dark">Saldo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .slice()
                  .reverse()
                  .map(transaction => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="whitespace-nowrap text-center text-gray-dark">
                          {dayjs(transaction.transactionDate).format('DD-MM-YYYY')}
                        </div>
                      </td>
                      <td>
                        <p className="uppercase text-gray-dark">{transaction.description}</p>
                      </td>
                      <td>
                        <p className="whitespace-nowrap text-right text-gray-dark">
                          {currencyFormat(transaction.amount)}
                        </p>
                      </td>
                      <td>
                        <p className="whitespace-nowrap text-right text-gray-dark">
                          {currencyFormat(transaction.balance)}
                        </p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>

            <div className="mt-8 flex justify-end">
              <div className="border-y border-gray-dark px-4 text-gray-dark">
                <div className="flex justify-between gap-x-8">
                  <p>Ingresos</p>
                  <p>{currencyFormat(incomes)}</p>
                </div>
                <div className="flex justify-between gap-x-8">
                  <p>Egresos</p>
                  <p>{currencyFormat(expenses)}</p>
                </div>
                <div className="flex justify-between gap-x-8 border-t">
                  <p>Saldo</p>
                  <p className="font-bold">{currencyFormat(balance)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-4 flex justify-end pr-8">
          <Button
            size="icon"
            variant={'green'}
            onClick={() => {
              handlePrint();
            }}
          >
            <IconPrinter size={30} stroke={2} />
          </Button>
        </footer>
      </div>
    </Modal>
  );
};

export default TransactionReport;
