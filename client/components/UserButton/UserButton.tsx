'use client';

import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import classes from './UserButton.module.css';

export function UserButton() {
  return (
    <UnstyledButton className={classes.userButton}>
      <Group>
        <Avatar src={null} alt="User" radius="xl">
          G
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
           Gaurav Chaudhary
          </Text>
          <Text size="xs" c="dimmed">
            gaurav@example.com
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
}
