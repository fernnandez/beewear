import { Button, Group, Modal, Text, Textarea, Alert, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconX, IconAlertTriangle } from '@tabler/icons-react';
import { useState } from 'react';
import { OrderDetails } from '../../../types/order';
import { OrderStatus } from '../../../types/order';
import { markOrderAsCanceled } from '../../../services/order.service';
import { useQueryClient } from '@tanstack/react-query';

interface OrderCancelActionProps {
  order: OrderDetails;
  onStatusUpdate?: (newStatus: OrderStatus) => void;
}

export const OrderCancelAction = ({ order, onStatusUpdate }: OrderCancelActionProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Lógica para determinar se o botão pode ser executado
  const canCancel = order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED;

  // Tooltip explicativo
  const getTooltipMessage = () => {
    if (order.status === OrderStatus.DELIVERED) {
      return 'Pedido entregue não pode ser cancelado';
    }
    if (order.status === OrderStatus.CANCELLED) {
      return 'Pedido já foi cancelado';
    }
    return '';
  };

  const handleMarkAsCanceled = async () => {
    if (!notes.trim()) {
      notifications.show({
        title: 'Erro',
        message: 'Por favor, adicione o motivo do cancelamento',
        color: 'red',
      });
      return;
    }

    setIsLoading(true);
    try {
      await markOrderAsCanceled(order.publicId, notes);
      
      // Invalidar cache do React Query
      queryClient.invalidateQueries({ queryKey: ['order-details', order.publicId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      notifications.show({
        title: 'Sucesso!',
        message: 'Pedido marcado como cancelado com sucesso',
        color: 'green',
      });

      onStatusUpdate?.(OrderStatus.CANCELLED);
      close();
      setNotes('');
    } catch (error) {
      console.error('Erro ao marcar pedido como cancelado:', error);
      notifications.show({
        title: 'Erro',
        message: 'Erro ao marcar pedido como cancelado. Tente novamente.',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tooltip label={getTooltipMessage()}>
        <Button
          leftSection={<IconX size={16} />}
          color={canCancel ? "red" : "gray"}
          variant={canCancel ? "filled" : "subtle"}
          onClick={canCancel ? open : undefined}
          disabled={!canCancel}
          styles={{
            root: {
              transition: 'all 0.2s ease',
              opacity: canCancel ? 1 : 0.6,
              cursor: canCancel ? 'pointer' : 'not-allowed',
              '&:hover': {
                transform: canCancel ? 'translateY(-1px)' : 'none',
                boxShadow: canCancel ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
              },
              '&:active': {
                transform: canCancel ? 'translateY(0)' : 'none',
              }
            }
          }}
        >
          Cancelar Pedido
        </Button>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={close}
        title="Cancelar Pedido"
        size="md"
      >
        <div>
          <Alert
            icon={<IconAlertTriangle size={16} />}
            title="Atenção!"
            color="orange"
            mb="md"
          >
            <Text size="sm">
              <strong>Importante:</strong> Cancelar o pedido no sistema não cancela automaticamente 
              o pagamento na Stripe. Se o pagamento foi processado, deve cancelar/reembolsar 
              manualmente na plataforma de pagamento.
            </Text>
          </Alert>

          <Text size="sm" c="dimmed" mb="md">
            Confirme o cancelamento do pedido e adicione o motivo do cancelamento.
          </Text>

          <Text size="sm" fw={500} mb={4}>
            Motivo do Cancelamento *
          </Text>
          <Textarea
            placeholder="Ex: Produto fora de stock, cliente solicitou cancelamento, erro no pedido..."
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
              color="red"
              onClick={handleMarkAsCanceled}
              loading={isLoading}
              disabled={!notes.trim()}
            >
              Confirmar Cancelamento
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};
