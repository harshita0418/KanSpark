'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import Link from 'next/link';
import classes from './Navbar.module.css';

export function Navbar() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Box className={classes.wrapper}>
      <Container size="lg">
        <Group justify="space-between" h={70}>
          <Text fw={700} size="xl" className={classes.logo}>
            Kanspark
          </Text>

          <Group gap="md" visibleFrom="sm">
            <Anchor component={Link} href="/workspace" c="dimmed" className={classes.navLink}>
              Workspace
            </Anchor>
            <Anchor component={Link} href="/#pricing" c="dimmed" className={classes.navLink}>
              Pricing
            </Anchor>
            <Anchor component={Link} href="/#about" c="dimmed" className={classes.navLink}>
              About
            </Anchor>
         
          </Group>

          <Group gap="sm">
            <ActionIcon
              onClick={toggleColorScheme}
              variant="subtle"
              size="lg"
              aria-label="Toggle color scheme"
              className={classes.toggleBtn}
            >
              {computedColorScheme === 'dark' ? (
                <IconSun size={20} stroke={1.5} />
              ) : (
                <IconMoon size={20} stroke={1.5} />
              )}
            </ActionIcon>
            <Button component={Link} href="/login" variant="subtle" color="violet" visibleFrom="sm">
              Log in
            </Button>
            <Button
              component={Link}
              href="/signup"
              variant="gradient"
              gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
              hiddenFrom="sm"
            >
              Sign up
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
