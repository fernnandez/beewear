import {
  Badge,
  Card,
  Group,
  Image,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconShoppingBagCheck } from "@tabler/icons-react";
import classes from "./CardItem.module.css";

export function CardItem({ image, name, price }: any) {
  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image src={image} />
      </Card.Section>

      <Group justify="center">
        <Title order={4} fw={500}>
          {name}
        </Title>
      </Group>

      <Card.Section className={classes.section}>
        <Group gap={30} justify="center" align="center">
          <div>
            <Badge color="yellow.7" size="lg">
              {price}
            </Badge>
          </div>
          <UnstyledButton className={classes.shoppingBag}>
            <IconShoppingBagCheck size={25} stroke={1.5} />
          </UnstyledButton>
        </Group>
      </Card.Section>
    </Card>
  );
}
