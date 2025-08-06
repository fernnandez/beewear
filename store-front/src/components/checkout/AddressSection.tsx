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
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AddressModal } from "./AddressModal";

interface Address {
  id: string;
  name: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export function AddressSection() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Casa",
      street: "Rua das Flores",
      number: "123",
      complement: "",
      neighborhood: "Centro",
      city: "Lisboa",
      state: "Lisboa",
      postalCode: "1000-001",
      country: "Portugal",
      isDefault: true,
    },
    {
      id: "2",
      name: "Trabalho",
      street: "Avenida da Liberdade",
      number: "456",
      complement: "Sala 101",
      neighborhood: "Baixa",
      city: "Porto",
      state: "Porto",
      postalCode: "4000-001",
      country: "Portugal",
      isDefault: false,
    },
  ]);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Selecionar o endereço padrão por padrão
  useEffect(() => {
    const defaultAddress = addresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.id);
    }
  }, [addresses]);

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    if (selectedAddress === id) {
      setSelectedAddress("");
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setModalOpened(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setModalOpened(true);
  };

  const handleSaveAddress = (addressData: any) => {
    if (editingAddress) {
      // Editar endereço existente
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addressData, id: addr.id }
            : addr
        )
      );
    } else {
      // Adicionar novo endereço
      const newAddress = {
        ...addressData,
        id: Date.now().toString(),
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
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
                    value={address.id}
                    checked={selectedAddress === address.id}
                    onChange={(event) =>
                      setSelectedAddress(event.currentTarget.value)
                    }
                    label=""
                  />
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Text fw={600} size="sm">
                        {address.name}
                      </Text>
                      {address.isDefault && (
                        <Text size="xs" c="dimmed">
                          (Padrão)
                        </Text>
                      )}
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
