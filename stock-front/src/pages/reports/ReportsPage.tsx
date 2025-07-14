import { Metrics } from "@components/reports/Metrics/Metrics";
import { QuickActions } from "@components/reports/QuickActions/QuickActions";
import { RecentMovements } from "@components/reports/RecentMovements/RecentMovements";
import { StockAlert } from "@components/reports/StockAlert/StockAlert";
import { WithoutStock } from "@components/reports/WithoutStock/SithoutStock";
import { Loading } from "@components/shared";
import { Container, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { fetchStockDashboard } from "@services/product.service";
import { useQuery } from "@tanstack/react-query";

export default function ReportsPage() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchStockDashboard,
  });

  if (isLoading || !reports) {
    return <Loading />;
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Relatórios</Title>
          <Text c="dimmed">Análise completa do seu estoque</Text>
        </div>
      </Group>

      <QuickActions />

      <Metrics
        totalProducts={reports.summary.totalProducts}
        totalValue={reports.summary.totalValue}
        lowStockCount={reports.summary.lowStockCount}
        noStockCount={reports.summary.noStockCount}
      />

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb="xl">
        <StockAlert alerts={reports.lowStockAlerts} />

        <WithoutStock alerts={reports.noStockAlerts} />
        <RecentMovements movements={reports.recentMovements} />
      </SimpleGrid>
    </Container>
  );
}
