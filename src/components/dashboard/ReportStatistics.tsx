import { Tabs } from '@mantine/core';
import { IconChartInfographic } from '@tabler/icons-react';
import React from 'react';
import AnnualReportStatistics from './AnnualReportStatistics';

const ReportStatistics = () => {
  return (
    <Tabs defaultValue="sale">
      <Tabs.List>
        <Tabs.Tab value="sale" icon={<IconChartInfographic size={14} />}>
          Ventas
        </Tabs.Tab>
        <Tabs.Tab value="credit" icon={<IconChartInfographic size={14} />}>
          Creditos
        </Tabs.Tab>
        <Tabs.Tab value="credit_payment" icon={<IconChartInfographic size={14} />}>
          Abono de créditos
        </Tabs.Tab>
        <Tabs.Tab value="separate" icon={<IconChartInfographic size={14} />}>
          Apartados
        </Tabs.Tab>
        <Tabs.Tab value="separate_payment" icon={<IconChartInfographic size={14} />}>
          Abono de apartados
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="sale" pt="xs">
        <AnnualReportStatistics
          title="Reporte de Venta Directa"
          description="Se resumen las ventas y los abonos de los apartados pagados en efectivo, tarjeta o transferencia"
        />
      </Tabs.Panel>

      <Tabs.Panel value="credit" pt="xs">
        <AnnualReportStatistics
          title="Créditos Otorgados"
          description="Resume los importes de la entrega de mercancías a los clientes"
          type="credit"
        />
      </Tabs.Panel>
      <Tabs.Panel value="credit_payment" pt="xs">
        <AnnualReportStatistics title="Abonos a Creditos" type="credit_payment" />
      </Tabs.Panel>

      <Tabs.Panel value="separate" pt="xs">
        <AnnualReportStatistics title="Apartado de Mercancía" type="separate" />
      </Tabs.Panel>
      <Tabs.Panel value="separate_payment" pt="xs">
        <AnnualReportStatistics
          title="Abono a Apartados"
          description="Corresponde a todos los abonos realizados por los clientes para el pago de articulos separados del stock"
          type="separate_payment"
        />
      </Tabs.Panel>
    </Tabs>
  );
};

export default ReportStatistics;
