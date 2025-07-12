import { Metrics } from "@components/reports/Metrics/Metrics";
import { QuickActions } from "@components/reports/QuickActions/QuickActions";
import { RecentMovements } from "@components/reports/RecentMovements/RecentMovements";
import { StockAlert } from "@components/reports/StockAlert/StockAlert";
import { Container, Group, SimpleGrid, Text, Title } from "@mantine/core";

export default function ReportsPage() {
  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Relatórios</Title>
          <Text c="dimmed">Análise completa do seu estoque</Text>
        </div>
      </Group>

      <QuickActions />

      <Metrics />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
        <StockAlert />

        <RecentMovements />
      </SimpleGrid>
    </Container>
  );
}
