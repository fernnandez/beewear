import { Button, Group, Modal, Text, Textarea, Alert } from '@mantine/core';
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

  // Só mostrar o botão se o pedido não estiver em DELIVERED ou CANCELLED
  if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
    return null;
  }

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
      <Button
        leftSection={<IconX size={16} />}
        color="red"
        onClick={open}
        variant="filled"
      >
        Cancelar Pedido
      </Button>

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
              o pagamento na Stripe. Se o pagamento foi processado, você deve cancelar/reembolsar 
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
            placeholder="Ex: Produto fora de estoque, cliente solicitou cancelamento, erro no pedido..."
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
