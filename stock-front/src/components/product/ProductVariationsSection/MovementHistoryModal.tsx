import { Loading } from "@components/shared";
import { StockMovement } from "@localTypes/stock";
import {
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from "@mantine/core";

import { useQuery } from "@tanstack/react-query";

import { ProductVariationSize } from "@localTypes/product";
import { fetchStockMovements } from "@services/stock.service";
import {
  IconClock,
  IconFileText,
  IconHistory,
  IconTrendingDown,
  IconTrendingUp,
  IconUser,
} from "@tabler/icons-react";
import { formatDateShort } from "@utils/formatDate";

interface MovementHistoryModalProps {
  opened: boolean;
  onClose: () => void;
  stockItemPublicId: string;
  size: ProductVariationSize;
  variationColor: string;
}

export const MovementHistoryModal = ({
  opened,
  onClose,
  stockItemPublicId,
  size,
  variationColor,
}: MovementHistoryModalProps) => {
  const { data: movements, isLoading } = useQuery<StockMovement[]>({
    queryKey: ["movements", stockItemPublicId],
    queryFn: () => fetchStockMovements(stockItemPublicId!),
    enabled: !!stockItemPublicId,
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Histórico de Movimentações"
      size="xl"
    >
      {isLoading && <Loading />}
      {movements && (
        <Stack>
          <Paper p="md" withBorder bg="var(--mantine-color-gray-0)">
            <Group>
              <Box
                w={32}
                h={32}
                style={{
                  backgroundColor: variationColor,
                  borderRadius: "50%",
                  border: "2px solid var(--mantine-color-gray-3)",
                }}
              />
              <div>
                <Text size="sm" c="dimmed">
                  Estoque atual:{" "}
                  <Text span fw={500}>
                    {size.stock.quantity} unidades
                  </Text>
                </Text>
                <Text size="sm" c="dimmed">
                  Total de movimentações:{" "}
                  <Text span fw={500}>
                    {movements.length}
                  </Text>
                </Text>
              </div>
            </Group>
          </Paper>

          {movements.length > 0 ? (
            <Paper withBorder>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Data/Hora</Table.Th>
                    <Table.Th>Tipo</Table.Th>
                    <Table.Th>Quantidade</Table.Th>
                    <Table.Th>Estoque</Table.Th>
                    <Table.Th>Usuário</Table.Th>
                    <Table.Th>Descrição</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {movements.map((movement) => (
                    <Table.Tr key={movement.id}>
                      <Table.Td>
                        <Group gap="xs">
                          <IconClock
                            size={14}
                            color="var(--mantine-color-gray-6)"
                          />
                          <Text size="sm">
                            {formatDateShort(movement.createdAt)}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {movement.type === "IN" ? (
                            <ThemeIcon color="green" variant="light" size="sm">
                              <IconTrendingUp size={12} />
                            </ThemeIcon>
                          ) : (
                            <ThemeIcon color="orange" variant="light" size="sm">
                              <IconTrendingDown size={12} />
                            </ThemeIcon>
                          )}
                          <Badge
                            color={movement.type === "IN" ? "green" : "orange"}
                            variant="light"
                            size="sm"
                          >
                            {movement.type.charAt(0).toUpperCase() +
                              movement.type.slice(1)}
                          </Badge>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          fw={500}
                          c={movement.type === "IN" ? "green" : "orange"}
                        >
                          {movement.type === "IN" ? "+" : "-"}
                          {movement.quantity}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Text size="sm" c="dimmed">
                            {movement.previousQuantity}
                          </Text>
                          <Text size="xs" c="dimmed">
                            →
                          </Text>
                          <Text fw={500}>{movement.newQuantity}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconUser
                            size={14}
                            color="var(--mantine-color-gray-6)"
                          />
                          <Text size="sm">admin</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconFileText
                            size={14}
                            color="var(--mantine-color-gray-6)"
                          />
                          <Text
                            size="sm"
                            style={{ maxWidth: "200px" }}
                            truncate
                          >
                            {movement.description}
                          </Text>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          ) : (
            <Paper p="xl" withBorder>
              <Flex direction="column" align="center" gap="md">
                <IconHistory size={48} color="var(--mantine-color-gray-5)" />
                <Text c="dimmed">Nenhuma movimentação registrada</Text>
                <Text size="sm" c="dimmed" ta="center">
                  As movimentações de estoque aparecerão aqui conforme forem
                  realizadas
                </Text>
              </Flex>
            </Paper>
          )}

          {/* Resumo das movimentações */}
          {movements.length > 0 && (
            <SimpleGrid cols={3} spacing="md">
              <Paper p="md" withBorder bg="var(--mantine-color-green-0)">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500} c="green">
                      Total Entradas
                    </Text>
                    <Text fw={700} size="lg" c="green">
                      {movements
                        .filter((m) => m.type === "IN")
                        .reduce((sum, m) => sum + m.quantity, 0)}
                    </Text>
                  </div>
                  <ThemeIcon color="green" variant="light">
                    <IconTrendingUp size={20} />
                  </ThemeIcon>
                </Group>
              </Paper>

              <Paper p="md" withBorder bg="var(--mantine-color-orange-0)">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500} c="orange">
                      Total Saídas
                    </Text>
                    <Text fw={700} size="lg" c="orange">
                      {movements
                        .filter((m) => m.type === "OUT")
                        .reduce((sum, m) => sum + m.quantity, 0)}
                    </Text>
                  </div>
                  <ThemeIcon color="orange" variant="light">
                    <IconTrendingDown size={20} />
                  </ThemeIcon>
                </Group>
              </Paper>

              <Paper p="md" withBorder bg="var(--mantine-color-blue-0)">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500} c="blue">
                      Movimentações
                    </Text>
                    <Text fw={700} size="lg" c="blue">
                      {movements.length}
                    </Text>
                  </div>
                  <ThemeIcon color="blue" variant="light">
                    <IconHistory size={20} />
                  </ThemeIcon>
                </Group>
              </Paper>
            </SimpleGrid>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};
