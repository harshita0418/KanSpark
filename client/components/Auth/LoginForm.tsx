'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Alert,
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
import { IconCheck, IconX } from '@tabler/icons-react';
import { useLogin } from '@/hooks/mutation/useAuth';
import classes from './AuthForm.module.css';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login.mutateAsync({ email, password });
      setSuccess('Login successful! Redirecting...');
      router.push('/workspace');
    } catch (err) {
      setSuccess('');
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <Box className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center">
          Welcome back to Kanspark
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          Manage your tasks with ease
        </Text>

        {success && (
          <Alert
            withCloseButton
            closeButtonLabel="Dismiss"
            color="teal"
            variant="light"
            mb="md"
            icon={<IconCheck />}
            title="Success"
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert
            withCloseButton
            closeButtonLabel="Dismiss"
            color="red"
            variant="light"
            mb="md"
            icon={<IconX />}
            title="Error"
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="hello@kanspark.com"
            size="md"
            radius="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            radius="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Group justify="space-between" mt="md">
            <Checkbox label="Remember me" size="md" />
            <Anchor component={Link} href="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" size="md" radius="md" type="submit" loading={login.isPending}>
            Sign in
          </Button>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

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
