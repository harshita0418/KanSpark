'use client';

import { IconCheck } from '@tabler/icons-react';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  List,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import classes from './Pricing.module.css';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for individuals and small projects',
    features: [
      'Up to 3 boards',
      'Up to 10 team members',
      'Basic Kanban boards',
      '1GB storage',
      'Email support',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/user/month',
    description: 'Best for growing teams',
    features: [
      'Unlimited boards',
      'Unlimited team members',
      'Advanced automation',
      '25GB storage',
      'Priority support',
      'Analytics dashboard',
      'Custom workflows',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Unlimited storage',
      'SSO & SAML',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function Pricing() {
  const planCards = plans.map((plan) => (
    <Card key={plan.name} className={classes.card} padding="xl" withBorder={!plan.popular}>
      {plan.popular && (
        <Badge
          size="sm"
          variant="gradient"
          gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
          className={classes.popularBadge}
        >
          Most Popular
        </Badge>
      )}
      <Text fw={600} size="lg" mt="md">
        {plan.name}
      </Text>
      <Group align="flex-end" gap={4} mt="md">
        <Text fw={700} className={classes.price}>
          {plan.price}
        </Text>
        <Text size="sm" c="dimmed">
          {plan.period}
        </Text>
      </Group>
      <Text size="sm" c="dimmed" mt="xs">
        {plan.description}
      </Text>
      {plan.name === 'Enterprise' ? (
        <Button
          component={Link}
          href="/contact"
          fullWidth
          mt="xl"
          variant={plan.popular ? 'gradient' : 'outline'}
          gradient={plan.popular ? { from: 'violet', to: 'indigo', deg: 135 } : undefined}
          color={plan.popular ? undefined : 'violet'}
        >
          {plan.cta}
        </Button>
      ) : (
        <Button
          component={Link}
          href="/signup"
          fullWidth
          mt="xl"
          variant={plan.popular ? 'gradient' : 'outline'}
          gradient={plan.popular ? { from: 'violet', to: 'indigo', deg: 135 } : undefined}
          color={plan.popular ? undefined : 'violet'}
        >
          {plan.cta}
        </Button>
      )}
      <List
        mt="xl"
        spacing="sm"
        size="sm"
        icon={<IconCheck size={16} className={classes.checkIcon} />}
      >
        {plan.features.map((feature) => (
          <List.Item key={feature}>
            <Text size="sm">{feature}</Text>
          </List.Item>
        ))}
      </List>
    </Card>
  ));

  return (
    <Box className={classes.wrapper}>
      <Container size="lg" py={80}>
        <Title order={2} className={classes.title} ta="center">
          Simple, transparent pricing
        </Title>
        <Text c="dimmed" className={classes.description} ta="center" maw={600} mx="auto" mt="xl">
          Start free and scale as your team grows. No hidden fees, no surprises.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt={60}>
          {planCards}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
