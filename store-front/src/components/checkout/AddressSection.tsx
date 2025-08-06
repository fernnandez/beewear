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

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
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
      street: "Rua das Flores, 123",
      city: "Lisboa",
      postalCode: "1000-001",
      country: "Portugal",
      isDefault: true,
    },
    {
      id: "2",
      name: "Trabalho",
      street: "Avenida da Liberdade, 456",
      city: "Porto",
      postalCode: "4000-001",
      country: "Portugal",
      isDefault: false,
    },
  ]);

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
        <Button leftSection={<IconPlus size={16} />} size="sm" color="dark">
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
                      {address.street}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {address.city}, {address.postalCode}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {address.country}
                    </Text>
                  </Stack>
                </Group>

                <Group gap="xs">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="dark"
                    title="Editar"
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
    </Paper>
  );
}
