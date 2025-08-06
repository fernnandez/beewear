import {
  ActionIcon,
  Box,
  Button,
  Group,
  Paper,
  Radio,
  rem,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AddressService } from "../../services/address.service";
import {
  Address as AddressType,
  CreateOrUpdateAddressDto,
} from "../../types/address";
import { AddressModal } from "./AddressModal";

interface AddressSectionProps {
  selectedAddress: number | null;
  onAddressSelect: (addressId: number | null) => void;
}

export function AddressSection({ selectedAddress, onAddressSelect }: AddressSectionProps) {
  const queryClient = useQueryClient();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { data: addresses = [] } = useQuery<AddressType[]>({
    queryKey: ["addresses"],
    queryFn: AddressService.findAll,
  });
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(
    null
  );
  const [modalOpened, setModalOpened] = useState(false);

  const handleDeleteAddress = async (id: number) => {
    modals.openConfirmModal({
      centered: true,
      title: "Confirmar exclusão",
      children:
        "Tem certeza que deseja remover este endereço? Esta ação não pode ser desfeita.",
      labels: { confirm: "Sim, remover", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      cancelProps: { variant: "outline" },
      onConfirm: async () => {
        try {
          await AddressService.remove(id);
          if (selectedAddress === id) {
            onAddressSelect(null);
          }
          queryClient.invalidateQueries({ queryKey: ["addresses"] });
          notifications.show({
            title: "Sucesso",
            message: "Endereço removido com sucesso",
            color: "green",
          });
        } catch {
          notifications.show({
            title: "Erro",
            message: "Erro ao remover endereço. Tente novamente.",
            color: "red",
          });
        }
      },
    });
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setModalOpened(true);
  };

  const handleEditAddress = (address: AddressType) => {
    setEditingAddress(address);
    setModalOpened(true);
  };

  const handleSaveAddress = async (addressData: CreateOrUpdateAddressDto) => {
    if (editingAddress) {
      await AddressService.update(editingAddress.id, addressData);
    } else {
      await AddressService.create(addressData);
    }
    queryClient.invalidateQueries({ queryKey: ["addresses"] });
  };

  return (
    <Paper
      p="xl"
      radius="md"
      style={{
        border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
        backgroundColor: isDark ? "#212529" : "white",
      }}
    >
      <Group justify="space-between" mb="md">
        <Title order={2} fw={700} size={rem(24)}>
          Meus Endereços
        </Title>
        <Button
          leftSection={<IconPlus size={16} />}
          size="sm"
          color="dark"
          onClick={handleAddAddress}
        >
          Adicionar
        </Button>
      </Group>

      <Text size="sm" c="dimmed" mb="lg">
        Selecione um endereço de entrega *
      </Text>

      {addresses.length === 0 ? (
        <Box
          p="xl"
          style={{
            border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
            borderRadius: rem(8),
            backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
          }}
        >
          <Text ta="center" c="dimmed">
            Nenhum endereço cadastrado
          </Text>
        </Box>
      ) : (
        <Stack gap="md">
          {addresses.map((address) => (
            <Box
              key={address.id}
              p="md"
              style={{
                border: isDark ? "1px solid #212529" : "1px solid #e9ecef",
                borderRadius: rem(8),
                backgroundColor: isDark ? "#2c2e33" : "#f8f9fa",
              }}
            >
              <Group justify="space-between" align="flex-start">
                <Group align="flex-start" gap="md" style={{ flex: 1 }}>
                  <Radio
                    value={address.id.toString()}
                    checked={selectedAddress === address.id}
                    onChange={(event) =>
                      onAddressSelect(Number(event.currentTarget.value))
                    }
                    label=""
                  />
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Text fw={600} size="sm">
                        {address.name}
                      </Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {address.street}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {address.neighborhood}, {address.city} - {address.state}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {address.postalCode}, {address.country}
                    </Text>
                  </Stack>
                </Group>

                <Group gap="xs">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="dark"
                    title="Editar"
                    onClick={() => handleEditAddress(address)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    title="Excluir"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Box>
          ))}
        </Stack>
      )}

      <AddressModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSave={handleSaveAddress}
        initialData={editingAddress || undefined}
        isEditing={!!editingAddress}
      />
    </Paper>
  );
}
