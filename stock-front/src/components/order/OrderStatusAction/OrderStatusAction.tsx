import { Button, Group, Modal, Text, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconTruck } from '@tabler/icons-react';
import { useState } from 'react';
import { OrderDetails } from '../../../types/order';
import { OrderStatus } from '../../../types/order';
import { markOrderAsShipped } from '../../../services/order.service';
import { useQueryClient } from '@tanstack/react-query';

interface OrderStatusActionProps {
  order: OrderDetails;
  onStatusUpdate?: (newStatus: OrderStatus) => void;
}

export const OrderStatusAction = ({ order, onStatusUpdate }: OrderStatusActionProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Só mostrar o botão se o pedido estiver em CONFIRMED ou PROCESSING
  if (order.status !== OrderStatus.CONFIRMED && order.status !== OrderStatus.PROCESSING) {
    return null;
  }

  const handleMarkAsShipped = async () => {
    if (!notes.trim()) {
      notifications.show({
        title: 'Erro',
        message: 'Por favor, adicione observações sobre o envio',
        color: 'red',
      });
      return;
    }

    setIsLoading(true);
    try {
      await markOrderAsShipped(order.publicId, notes);
      
      // Invalidar cache do React Query
      queryClient.invalidateQueries({ queryKey: ['order-details', order.publicId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      notifications.show({
        title: 'Sucesso!',
        message: 'Pedido marcado como enviado com sucesso',
        color: 'green',
      });

      onStatusUpdate?.(OrderStatus.SHIPPED);
      close();
      setNotes('');
    } catch (error) {
      console.error('Erro ao marcar pedido como enviado:', error);
      notifications.show({
        title: 'Erro',
        message: 'Erro ao marcar pedido como enviado. Tente novamente.',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        leftSection={<IconTruck size={16} />}
        color="green"
        onClick={open}
        variant="filled"
      >
        Marcar como Enviado
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Marcar Pedido como Enviado"
        size="md"
      >
        <div>
          <Text size="sm" c="dimmed" mb="md">
            Confirme que o pedido foi enviado e adicione observações sobre o envio.
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
