'use client';

import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import { useAuthContext } from '@/context/AuthContext';
import classes from './UserButton.module.css';

export function UserButton() {
  const { user } = useAuthContext();
  
  const fullName = user ? `${user.name} ${user.lastname}` : 'User';
  const initials = user ? `${user.name[0]}${user.lastname[0]}`.toUpperCase() : 'U';

  return (
    <UnstyledButton className={classes.userButton}>
      <Group>
        <Avatar src={null} alt="User" radius="xl">
          {initials}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {fullName}
          </Text>
          <Text size="xs" c="dimmed">
            {user?.email || 'user@example.com'}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
}
