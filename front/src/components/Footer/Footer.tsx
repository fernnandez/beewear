import { ActionIcon, Container, Group, Text } from "@mantine/core";
import { IconBrandGmail, IconBrandInstagram } from "@tabler/icons-react";
import classes from "./Footer.module.css";

export function Footer() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Text style={{ cursor: "pointer" }}>BeeWear</Text>
        <Group
          gap={0}
          className={classes.links}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandGmail size={20} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram size={20} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}
