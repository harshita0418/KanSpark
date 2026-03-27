'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { Box, Button, Container, Group, Text, Title } from '@mantine/core';
import classes from './CTA.module.css';

export function CTA() {
  return (
    <Box className={classes.wrapper}>
      <Container size="md" py={80}>
        <Title order={2} className={classes.title} ta="center">
          Ready to streamline your workflow?
        </Title>
        <Text c="dimmed" className={classes.description} ta="center" maw={500} mx="auto" mt="xl">
          Join thousands of teams who have transformed their productivity with Kanspark.
        </Text>
        <Group justify="center" mt="xl">
          <Button
            size="xl"
            variant="gradient"
            gradient={{ from: 'violet', to: 'indigo', deg: 135 }}
            rightSection={<IconArrowRight size={24} />}
          >
            Get Started Free
          </Button>
        </Group>
        <Text size="sm" c="dimmed" ta="center" mt="lg">
          No credit card required. Start in seconds.
        </Text>
      </Container>
    </Box>
  );
}
