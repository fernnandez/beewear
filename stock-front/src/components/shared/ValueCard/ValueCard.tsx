import { Card, Group, Text, ThemeIcon, Title } from "@mantine/core";
import { ReactNode } from "react";

interface ValueCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  iconColor?: string;
  valueColor?: string;
}

export const ValueCard = ({
  title,
  value,
  description,
  icon,
  iconColor = "blue",
  valueColor,
}: ValueCardProps) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500} c="dimmed">
          {title}
        </Text>
        <ThemeIcon variant="light" color={iconColor} size="sm">
          {icon}
        </ThemeIcon>
      </Group>
      <Title order={2} c={valueColor}>
        {value}
      </Title>
      <Text size="xs" c="dimmed">
        {description}
      </Text>
    </Card>
  );
};
