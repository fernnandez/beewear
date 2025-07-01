import { Center, Loader, Stack, Text } from "@mantine/core";

export function Loading() {
  return (
    <Center h="100vh">
      <Stack align="center">
        <Loader size="lg" color="blue" />
        <Text c="dimmed" mt="md">
          Carregando...
        </Text>
      </Stack>
    </Center>
  );
}
