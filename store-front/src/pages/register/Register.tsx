import type React from "react";

import { useAuth } from "@contexts/auth-context";
import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  PasswordInput,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getProfileInfo, register } from "@services/auth.service";
import {
  IconAlertCircle,
  IconLetterA,
  IconLock,
  IconMail,
  IconPackage,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login, setUser } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      login(token);

      const profileInfo = await getProfileInfo();

      setUser(profileInfo);

      notifications.show({
        title: "Registro realizado com sucesso",
        message: "Bem-vindo ao sistema de gestão de estoque",
        color: "green",
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Erro ao fazer Cadastro. Tente novamente.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  return (
    <Box
      h="100vh"
      style={{
        background:
          "linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-blue-1) 100%)",
      }}
    >
      <Container size="xs" pt={80}>
        <Center mb={30}>
          <Stack align="center">
            <Box bg="blue" p={16} style={{ borderRadius: "50%" }}>
              <IconPackage size={32} color="white" />
            </Box>
            <Title order={1}>Sistema de Estoque</Title>
            <Text c="dimmed">Faça cadastro para acessar o sistema</Text>
          </Stack>
        </Center>

        <Card shadow="md" radius="md" p="xl" withBorder>
          <Title order={3} ta="center" mb="sm">
            Registrar
          </Title>

          <form onSubmit={handleRegister}>
            <Stack>
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Erro"
                  color="red"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Nome"
                placeholder="Jonh doel"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                leftSection={<IconLetterA size={16} />}
                required
              />

              <TextInput
                label="Email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                leftSection={<IconMail size={16} />}
                required
              />

              <PasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                leftSection={<IconLock size={16} />}
                required
              />

              <Button type="submit" loading={isLoading} fullWidth>
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </Stack>

            <Divider label="Login" labelPosition="center" my="md" />

            <Group>
              <Button
                variant="light"
                size="compact-sm"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </Group>
          </form>
        </Card>

        <Text c="dimmed" size="xs" ta="center" mt={rem(30)}>
          Sistema de Gestão de Estoque v1.0 • © 2024 - Todos os direitos
          reservados
        </Text>
      </Container>
    </Box>
  );
};
