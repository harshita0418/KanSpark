'use client';

import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react';
import { Anchor, Box, Container, Group, SimpleGrid, Text } from '@mantine/core';
import classes from './Footer.module.css';

const links = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Integrations', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
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
        <Anchor key={link.label} href={link.href} c="dimmed" size="sm" className={classes.link}>
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
              <Anchor href="#" c="dimmed" className={classes.socialLink}>
                <IconBrandTwitter size={20} />
              </Anchor>
              <Anchor href="#" c="dimmed" className={classes.socialLink}>
                <IconBrandGithub size={20} />
              </Anchor>
              <Anchor href="#" c="dimmed" className={classes.socialLink}>
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
