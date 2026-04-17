'use client';

import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react';
import { Anchor, Box, Container, Group, SimpleGrid, Text } from '@mantine/core';
import Link from 'next/link';
import classes from './Footer.module.css';

const links = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-reference' },
      { label: 'Community', href: '/community' },
      { label: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

export function Footer() {
  const linkGroups = links.map((group) => (
    <Box key={group.title}>
      <Text fw={600} mb="sm" size="sm">
        {group.title}
      </Text>
      {group.links.map((link) => (
        <Anchor key={link.label} component={Link} href={link.href} c="dimmed" size="sm" className={classes.link}>
          {link.label}
        </Anchor>
      ))}
    </Box>
  ));

  return (
    <Box className={classes.wrapper}>
      <Container size="lg" py={60}>
        <SimpleGrid cols={{ base: 2, sm: 4, lg: 5 }} spacing="xl">
          <Box>
            <Text fw={700} size="lg" mb="sm">
              Kanspark
            </Text>
            <Text size="sm" c="dimmed" maw={200}>
              Streamline your projects with intuitive Kanban boards. Built for teams who want to
              ship faster.
            </Text>
            <Group mt="md" gap="sm">
              <Anchor component={Link} href="https://twitter.com" target="_blank" c="dimmed" className={classes.socialLink}>
                <IconBrandTwitter size={20} />
              </Anchor>
              <Anchor component={Link} href="https://github.com" target="_blank" c="dimmed" className={classes.socialLink}>
                <IconBrandGithub size={20} />
              </Anchor>
              <Anchor component={Link} href="https://linkedin.com" target="_blank" c="dimmed" className={classes.socialLink}>
                <IconBrandLinkedin size={20} />
              </Anchor>
            </Group>
          </Box>
          {linkGroups}
        </SimpleGrid>
        <Text size="sm" c="dimmed" ta="center" mt={60}>
          © {new Date().getFullYear()} Kanspark. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}
