'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import { ActionIcon, Group, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Group gap="xs" className="color-scheme-toggle">
      <ActionIcon
        onClick={toggleColorScheme}
        variant="subtle"
        size="lg"
        aria-label="Toggle color scheme"
        color={computedColorScheme === 'dark' ? 'yellow' : 'violet'}
      >
        {computedColorScheme === 'dark' ? (
          <IconSun size={20} stroke={1.5} />
        ) : (
          <IconMoon size={20} stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
}
