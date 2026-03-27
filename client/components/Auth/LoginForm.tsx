'use client';

import Link from 'next/link';
import { IconBrandGoogle } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './AuthForm.module.css';

export function LoginForm() {
  return (
    <Box className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center">
          Welcome back to Kanspark
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          Manage your tasks with ease
          
        </Text>

        <TextInput label="Email" placeholder="hello@kanspark.com" size="md" radius="md" />
        <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" radius="md" />
        <Group justify="space-between" mt="md">
          <Checkbox label="Remember me" size="md" />
          <Anchor component={Link} href="/forgot-password" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" size="md" radius="md">
          Sign in
        </Button>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        {/* <Button
          fullWidth
          variant="default"
          color="gray"
          radius="md"
          leftSection={<IconBrandGoogle size={18} />}
        >
          Google
        </Button> */}

           <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          Don&apos;t have an account?{' '}
          <Anchor component={Link} href="/signup" size="sm" fw={500}>
            Create account
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}
