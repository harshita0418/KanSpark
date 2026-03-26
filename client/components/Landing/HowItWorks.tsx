'use client';

import { IconListDetails, IconPlus, IconRocket } from '@tabler/icons-react';
import { Badge, Box, Container, rem, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import classes from './HowItWorks.module.css';

const steps = [
  {
    number: '01',
    title: 'Create Your Board',
    description:
      'Start by creating a new board for your project. Add columns like To Do, In Progress, and Done.',
    icon: IconPlus,
  },
  {
    number: '02',
    title: 'Add Your Tasks',
    description: 'Create cards for each task. Add details, assign team members, and set due dates.',
    icon: IconListDetails,
  },
  {
    number: '03',
    title: 'Start Shipping',
    description:
      'Drag cards across columns as work progresses. Watch your team ship faster than ever.',
    icon: IconRocket,
  },
];

export function HowItWorks() {
  const stepCards = steps.map((step) => (
    <Box key={step.number} className={classes.step}>
      <Badge size="lg" variant="light" color="violet" className={classes.number}>
        {step.number}
      </Badge>
      <ThemeIcon
        size={60}
        radius="xl"
        variant="gradient"
        gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
        className={classes.icon}
      >
        <step.icon style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
      </ThemeIcon>
      <Title order={3} className={classes.stepTitle}>
        {step.title}
      </Title>
      <Text c="dimmed" mt="sm" className={classes.stepDescription}>
        {step.description}
      </Text>
    </Box>
  ));

  return (
    <Box className={classes.wrapper}>
      <Container size="lg" py={80}>
        <Title order={2} className={classes.title} ta="center">
          How Kanspark works
        </Title>
        <Text c="dimmed" className={classes.description} ta="center" maw={600} mx="auto" mt="xl">
          Get started in minutes. Three simple steps to transform how your team works.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt={60}>
          {stepCards}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
