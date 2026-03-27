'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconSearch, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  useComputedColorScheme,
} from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import classes from './HeroSection.module.css';

const menuItems = [
  { name: 'Features', href: '#' },
  { name: 'Solution', href: '#' },
  { name: 'Pricing', href: '#' },
  { name: 'About', href: '#' },
];

const partners = [
  { name: 'Nvidia', height: 20 },
  { name: 'Column', height: 16 },
  { name: 'GitHub', height: 16 },
  { name: 'Nike', height: 20 },
  { name: 'Laravel', height: 16 },
  { name: 'Lilly', height: 28 },
  { name: 'Lemon', height: 20 },
  { name: 'OpenAI', height: 24 },
  { name: 'Tailwind', height: 16 },
  { name: 'Vercel', height: 20 },
  { name: 'Zapier', height: 20 },
];

function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 78 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height: 20, width: 'auto' }}
    >
      <path
        d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148Z"
        fill="currentColor"
      />
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="10"
          y1="0"
          x2="10"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroSection() {
  const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure(false);
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';
  const pinned = useHeadroom({ fixedAt: 400 });

  return (
    <Box className={classes.wrapper}>
      <Box
        component="header"
        className={classes.header}
        style={{ transform: `translate3d(0, ${pinned ? 0 : -100}%, 0)` }}
      >
        <Container size="xl" className={classes.navContainer}>
          <Group justify="space-between" h={60}>
            <Link href="/" onClick={closeMenu}>
              <Logo className={classes.logo} />
            </Link>

            <Group gap="xl" visibleFrom="md">
              {menuItems.map((item) => (
                <Text key={item.name} component={Link} href={item.href} className={classes.navLink}>
                  {item.name}
                </Text>
              ))}
            </Group>

            <Group gap="sm" visibleFrom="md">
              <Button variant="subtle" color="gray">
                Login
              </Button>
              <Button>Sign up</Button>
            </Group>

            <Burger opened={menuOpened} onClick={toggleMenu} hiddenFrom="md" size="sm" />
          </Group>
        </Container>

        <Drawer
          opened={menuOpened}
          onClose={closeMenu}
          title={<Logo />}
          hiddenFrom="md"
          size="xs"
          padding="md"
        >
          <Stack gap="md">
            {menuItems.map((item) => (
              <Text
                key={item.name}
                component={Link}
                href={item.href}
                className={classes.mobileNavLink}
                onClick={closeMenu}
              >
                {item.name}
              </Text>
            ))}
            <Group mt="md">
              <Button variant="outline" fullWidth>
                Login
              </Button>
              <Button fullWidth>Sign up</Button>
            </Group>
          </Stack>
        </Drawer>
      </Box>

      <Container size="xl" className={classes.heroSection}>
        <Stack align="center" gap="xl" maw={800} mx="auto">
          <Title order={1} className={classes.title}>
            Modern Software testing reimagined
          </Title>
          <Text size="xl" ta="center" c="dimmed" maw={600}>
            Officiis laudantium excepturi ducimus rerum dignissimos, and tempora nam vitae,
            excepturi ducimus iste provident dolores.
          </Text>
          <Button size="lg" mt="md">
            Start Building
          </Button>
        </Stack>
      </Container>

      <Box className={classes.showcaseWrapper}>
        <Box className={classes.showcase}>
          <Box
            component="img"
            src={isDark ? '/dark.png' : '/light.png'}
            alt="Kanspark showcase"
            className={classes.showcaseImage}
          />
        </Box>
      </Box>

      <Box className={classes.partnersSection}>
        <Container size="xl">
          <Text ta="center" mb="xl" fw={500}>
            Your favorite companies are our partners.
          </Text>
          <Group justify="center" gap="xl" wrap="wrap">
            {partners.map((partner) => (
              <Text
                key={partner.name}
                className={classes.partnerLogo}
                style={{ height: partner.height }}
                c="dimmed"
              >
                {partner.name}
              </Text>
            ))}
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
