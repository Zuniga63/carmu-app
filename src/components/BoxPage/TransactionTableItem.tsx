import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import axios, { AxiosError } from 'axios';
import React from 'react';
import { boxPageSelector, removeTransaction } from 'src/features/BoxPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { IMainTransaction, ITransaction, ITransactionResponse } from 'src/types';
import { currencyFormat } from 'src/utils';
import Swal from 'sweetalert2';

interface Props {
  transaction: ITransaction;
}
const TransactionTableItem = ({ transaction }: Props) => {
  const { showingMainBox: isMainBox } = useAppSelector(boxPageSelector);
  const dispatch = useAppDispatch();
  const otherBox = isMainBox && !!transaction.cashbox;

  const deleteTransaction = async () => {
    const { id, cashbox, description, amount } = transaction;
    const url = cashbox ? `/boxes/${cashbox}/transactions/${id}` : `/main-box/transactions/${id}`;

    const message = /*html */ `
      La transacción "<strong>${description}</strong>"
      por valor de <strong>${currencyFormat(amount)}</strong>
      será eliminada permanentemente y esta acción no puede revertirse.`;

    const result = await Swal.fire({
      title: '<strong>¿Desea eliminar la transacción?</strong>',
      html: message,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, ¡Eliminala!',
      backdrop: true,
      icon: 'warning',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const result = { ok: false, message: '' };

        try {
          await axios.delete<{ transaction: ITransactionResponse }>(url);
          result.ok = true;
          result.message = `¡La transacción por valor de <strong>${currencyFormat(
            amount,
          )}</strong> fue eliminada con éxito!`;

          dispatch(removeTransaction(transaction.id));
        } catch (error) {
          if (error instanceof AxiosError) {
            const { response } = error;
            if (response?.status === 404) {
              dispatch(removeTransaction(transaction.id));
            }
            result.message = response?.data.message;
          } else {
            console.log(error);
          }
        }
        return result;
      },
    });

    if (result.isConfirmed && result.value) {
      const { ok, message } = result.value;
      const title = ok ? '<strong>¡Transacción Eliminada!</strong>' : '¡Ops, algo salio mal!';
      const icon = ok ? 'success' : 'error';

      Swal.fire({ title, html: message, icon });
    }
  };

  return (
    <tr className={`text-dark ${otherBox ? 'opacity-20' : ''} dark:text-gray-300`}>
      <td>
        <div className="whitespace-nowrap text-center">
          <p className="hidden text-sm lg:block">{transaction.transactionDate.format('DD/MM/YY hh:mm a')}</p>
          <p className="text-xs lg:hidden">{transaction.transactionDate.format('DD/MM/YY')}</p>
          <p className="hidden text-xs lg:block">{transaction.transactionDate.fromNow()}</p>
          <p className="text-xs lg:hidden">{transaction.transactionDate.format('hh:mm a')}</p>
        </div>
      </td>
      <td>
        <div>
          <p className="text-xs lg:text-base">{transaction.description}</p>
          {otherBox && (
            <p className="text-xs">
              pertenece a : <span className="font-bold">{(transaction as IMainTransaction).cashbox?.name}</span>
            </p>
          )}
        </div>
      </td>
      <td className="text-right">{currencyFormat(transaction.amount)}</td>
      <td className={`hidden text-right lg:table-cell ${otherBox && 'line-through'}`}>
        {currencyFormat(transaction.balance)}
      </td>
      <td>
        <div className="flex justify-center">
          <ActionIcon color="red" size="lg" onClick={deleteTransaction}>
            <IconTrash size={16} stroke={2} />
          </ActionIcon>
        </div>
      </td>
    </tr>
  );
};

export default TransactionTableItem;
