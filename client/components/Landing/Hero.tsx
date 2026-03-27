'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { Box, Button, Container, Group, Text, Title, useComputedColorScheme } from '@mantine/core';
import classes from './Hero.module.css';

export function Hero() {
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';

  return (
    <Box className={classes.wrapper}>
      <Container size="lg" pt={60} className={classes.container}>
        <Box className={classes.content}>
          <Title className={classes.title} ta="center">
            Organize your work with{' '}
            <Text component="span" inherit className={classes.highlight}>
              Kanspark
            </Text>
          </Title>
          <Text c="dimmed" className={classes.description} ta="center" maw={600} mx="auto">
            Streamline your projects with our intuitive Kanban board. Visualize workflows, track
            progress, and collaborate seamlessly with your team.
          </Text>
          <Group justify="center" mt="xl">
            <Button
              size="lg"
              variant="gradient"
              gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
              rightSection={<IconArrowRight size={20} />}
            >
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" color="violet">
              View Demo
            </Button>
          </Group>
        </Box>

        <Box className={classes.showcaseWrapper}>
          <Box className={classes.shineWrapper}>
            <Box
              component="img"
              src={isDark ? '/dark.png' : '/light.png'}
              alt="Kanspark Showcase"
              className={classes.showcase}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
