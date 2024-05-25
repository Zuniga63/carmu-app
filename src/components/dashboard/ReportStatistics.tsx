import AnnualReportStatistics from './AnnualReportStatistics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

const ReportStatistics = () => {
  return (
    <Tabs defaultValue="sale" className="w-full">
      <TabsList>
        <TabsTrigger value="sale">Ventas</TabsTrigger>
        <TabsTrigger value="credit">Creditos</TabsTrigger>
        <TabsTrigger value="credit_payment">Abono de créditos</TabsTrigger>
        <TabsTrigger value="separate">Apartados</TabsTrigger>
        <TabsTrigger value="separate_payment">Abono de apartados</TabsTrigger>
      </TabsList>

      <TabsContent value="sale">
        <AnnualReportStatistics
          title="Reporte de Venta Directa"
          description="Se resumen las ventas y los abonos de los apartados pagados en efectivo, tarjeta o transferencia"
        />
      </TabsContent>

      <TabsContent value="credit">
        <AnnualReportStatistics
          title="Créditos Otorgados"
          description="Resume los importes de la entrega de mercancías a los clientes"
          type="credit"
        />
      </TabsContent>

      <TabsContent value="credit_payment">
        <AnnualReportStatistics title="Abonos a Creditos" type="credit_payment" />
      </TabsContent>

      <TabsContent value="separate">
        <AnnualReportStatistics title="Apartado de Mercancía" type="separate" />
      </TabsContent>

      <TabsContent value="separate_payment">
        <AnnualReportStatistics
          title="Abono a Apartados"
          description="Corresponde a todos los abonos realizados por los clientes para el pago de articulos separados del stock"
          type="separate_payment"
        />
      </TabsContent>
    </Tabs>
  );
};

export default ReportStatistics;
