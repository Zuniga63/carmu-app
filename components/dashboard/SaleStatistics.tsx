import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';

import { Skeleton } from '@mantine/core';
import { IAnnualReport } from 'types';
import AnnualSalesAux from './AnnualSalesAux';
import SaleChart from './SaleChart';
import AnnualCategoryChart from './AnnualCategoryChart';

dayjs.extend(isLeapYear);

const BASE_URL = '/dashboard/sale-report';

const SaleStatistics = () => {
  const [reports, setReports] = useState<IAnnualReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const fetchReport = async (year?: number): Promise<IAnnualReport> => {
    const res = await axios.get<{ report: IAnnualReport }>(BASE_URL, { params: { year: year } });
    return res.data.report;
  };

  const getInitialData = async () => {
    try {
      setLoading(true);
      const report = await fetchReport();
      setReports([report]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addAnnualReport = async () => {
    const lastReport = reports.at(-1);
    const year = lastReport ? lastReport.year - 1 : undefined;
    try {
      setLoadingReport(true);
      const report = await fetchReport(year);
      setReports(current => {
        const list = current.slice();
        list.push(report);
        return list;
      });
    } catch (error) {
      toast.error(`No se pudo cargar el reporte del año ${year}`);
    } finally {
      setLoadingReport(false);
    }
  };

  const removeAnnualReport = () => {
    if (reports.length > 1) {
      setReports(currentList => {
        const list = currentList.slice();
        list.pop();
        return list;
      });
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  return (
    <Skeleton visible={loading}>
      <div className="min-h-[300px] bg-dark bg-opacity-90 px-4 py-6">
        <header className="mb-4">
          <h2 className="mb-1 text-center text-2xl font-bold text-light">Reporte de Venta Directa</h2>
          <p className="text-center text-sm italic">
            Representa las ventas en efectivo por mostrador y pagos iniciales de apartados y creditos
          </p>
        </header>

        <div className="grid grid-cols-12 gap-4">
          {/* MAIN CHART */}
          <div className="col-span-8 3xl:col-span-9">
            <SaleChart annualReports={reports} />
          </div>
          {/* ANNUAL SALES AUX */}
          <div className="col-span-4 3xl:col-span-3">
            <AnnualSalesAux
              title="Comparativa Anual"
              description="Compara las ventas totales de los años seleccionados"
              annualReports={reports}
              addAnnualReport={addAnnualReport}
              removeAnnualReport={removeAnnualReport}
              loadingReport={loadingReport}
            />
          </div>

          {/* CATEGORY CHART */}
          <div className="col-span-8 3xl:col-span-9">
            <SaleChart annualReports={reports} />
          </div>

          <div className="col-span-4 3xl:col-span-3">
            <AnnualCategoryChart annualReports={reports} />
          </div>
          {/* controllers */}
        </div>
      </div>
    </Skeleton>
  );
};

export default SaleStatistics;
