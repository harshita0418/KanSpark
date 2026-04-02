'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Group gap="xs" className="color-scheme-toggle">
      <ActionIcon
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
        variant="subtle"
        size="lg"
        aria-label="Toggle color scheme"
      >
        {isDark ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
      </ActionIcon>
    </Group>
  );
}
