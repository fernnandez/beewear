import { Button, Group, Modal, Text, Textarea, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTruck } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { markOrderAsShipped } from "../../../services/order.service";
import { OrderDetails, OrderStatus } from "../../../types/order";

interface OrderStatusActionProps {
  order: OrderDetails;
  onStatusUpdate?: (newStatus: OrderStatus) => void;
}

export const OrderStatusAction = ({
  order,
  onStatusUpdate,
}: OrderStatusActionProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Lógica para determinar se o botão pode ser executado
  const canShip = order.status === OrderStatus.CONFIRMED;

  // Tooltip explicativo
  const getTooltipMessage = () => {
    if (order.status === OrderStatus.PENDING) {
      return "Pedido deve estar confirmado";
    }
    if (order.status === OrderStatus.SHIPPED) {
      return "Pedido já foi enviado";
    }
    if (order.status === OrderStatus.DELIVERED) {
      return "Pedido já foi entregue";
    }
    if (order.status === OrderStatus.CANCELLED) {
      return "Pedido cancelado não pode ser enviado";
    }
    return "";
  };

  const handleMarkAsShipped = async () => {
    if (!notes.trim()) {
      notifications.show({
        title: "Erro",
        message: "Por favor, adicione observações sobre o envio",
        color: "red",
      });
      return;
    }

    setIsLoading(true);
    try {
      await markOrderAsShipped(order.publicId, notes);

      // Invalidar cache do React Query
      queryClient.invalidateQueries({
        queryKey: ["order-details", order.publicId],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      notifications.show({
        title: "Sucesso!",
        message: "Pedido marcado como enviado com sucesso",
        color: "green",
      });

      onStatusUpdate?.(OrderStatus.SHIPPED);
      close();
      setNotes("");
    } catch (error) {
      console.error("Erro ao marcar pedido como enviado:", error);
      notifications.show({
        title: "Erro",
        message: "Erro ao marcar pedido como enviado. Tente novamente.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tooltip label={getTooltipMessage()}>
        <Button
          leftSection={<IconTruck size={16} />}
          color={canShip ? "green" : "gray"}
          variant={canShip ? "filled" : "subtle"}
          onClick={canShip ? open : undefined}
          disabled={!canShip}
          styles={{
            root: {
              transition: 'all 0.2s ease',
              opacity: canShip ? 1 : 0.6,
              cursor: canShip ? 'pointer' : 'not-allowed',
              '&:hover': {
                transform: canShip ? 'translateY(-1px)' : 'none',
                boxShadow: canShip ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
              },
              '&:active': {
                transform: canShip ? 'translateY(0)' : 'none',
              }
            }
          }}
        >
          Marcar como Enviado
        </Button>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={close}
        title="Marcar Pedido como Enviado"
        size="md"
      >
        <div>
          <Text size="sm" c="dimmed" mb="md">
            Confirme que o pedido foi enviado e adicione observações sobre o
            envio.
          </Text>

          <Text size="sm" fw={500} mb={4}>
            Observações do Envio *
          </Text>
          <Textarea
            placeholder="Ex: Pedido enviado via correio expresso, código de rastreamento: ABC123..."
            value={notes}
            onChange={(event) => setNotes(event.currentTarget.value)}
            minRows={3}
            mb="lg"
            required
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={close} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              color="green"
              onClick={handleMarkAsShipped}
              loading={isLoading}
              disabled={!notes.trim()}
            >
              Confirmar Envio
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};
