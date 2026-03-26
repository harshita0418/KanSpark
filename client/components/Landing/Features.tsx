'use client';

import {
  IconChartBar,
  IconDeviceFloppy,
  IconLayoutKanban,
  IconRocket,
  IconShield,
  IconUsers,
} from '@tabler/icons-react';
import { Box, Card, Container, rem, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import classes from './Features.module.css';

const features = [
  {
    title: 'Visual Workflows',
    description:
      'Organize tasks with intuitive Kanban boards. Drag and drop cards between columns to update status instantly.',
    icon: IconLayoutKanban,
  },
  {
    title: 'Team Collaboration',
    description:
      'Work together in real-time. Assign tasks, leave comments, and mention teammates to keep everyone aligned.',
    icon: IconUsers,
  },
  {
    title: 'Progress Analytics',
    description:
      'Track team performance with visual charts. Monitor velocity, burndown charts, and productivity metrics.',
    icon: IconChartBar,
  },
  {
    title: 'Smart Automation',
    description:
      'Automate repetitive tasks with rules and triggers. Save time by automating status changes and notifications.',
    icon: IconDeviceFloppy,
  },
  {
    title: 'Enterprise Security',
    description:
      'Bank-level security with SSO, 2FA, and role-based access control. Your data is encrypted at rest and in transit.',
    icon: IconShield,
  },
  {
    title: 'Lightning Fast',
    description:
      'Built for speed with instant loading and real-time sync. Works seamlessly across all devices.',
    icon: IconRocket,
  },
];

export function Features() {
  const featureCards = features.map((feature) => (
    <Card key={feature.title} className={classes.card} padding="xl">
      <ThemeIcon
        size={50}
        radius="md"
        variant="gradient"
        gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
      >
        <feature.icon style={{ width: rem(26), height: rem(26) }} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" fw={600} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Box className={classes.wrapper}>
      <Container size="lg" py={80}>
        <Title order={2} className={classes.title} ta="center">
          Everything you need to ship faster
        </Title>
        <Text c="dimmed" className={classes.description} ta="center" maw={600} mx="auto" mt="xl">
          Powerful features designed to help teams organize, track, and complete work more
          efficiently.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mt={50}>
          {featureCards}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
