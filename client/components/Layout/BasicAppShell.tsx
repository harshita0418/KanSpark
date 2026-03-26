'use client';

import { ReactNode } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavbarSearch } from '../NavbarSearch/NavbarSearch';
import classes from './BasicAppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export function BasicAppShell({ children }: AppShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm' }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700} size="xl" className={classes.logo}>
              Kanspark
            </Text>
          </Group>
          <ActionIcon
            onClick={toggleColorScheme}
            variant="subtle"
            size="lg"
            aria-label="Toggle color scheme"
          >
            {computedColorScheme === 'dark' ? (
              <IconSun size={20} stroke={1.5} />
            ) : (
              <IconMoon size={20} stroke={1.5} />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={classes.navbar}>
        <NavbarSearch />
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    </AppShell>
  );
}
