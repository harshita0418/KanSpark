'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Anchor,
  Box,
  Button,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useForgotPassword } from '@/hooks/mutation/useAuth';
import classes from '@/components/Auth/AuthForm.module.css';

export const metadata = {
  title: 'Forgot Password - Kanspark',
  description: 'Reset your Kanspark password',
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const forgotPassword = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      await forgotPassword.mutateAsync(email);
      setSuccess('If an account with that email exists, a password reset link has been sent.');
      setEmail('');
    } catch (err) {
      setSuccess('If an account with that email exists, a password reset link has been sent.');
    }
  };

  return (
    <Box className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center">
          Forgot Password
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          Enter your email to reset your password
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
          <Button fullWidth mt="xl" size="md" radius="md" type="submit" loading={forgotPassword.isPending}>
            Send Reset Link
          </Button>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt={30}>
          Remember your password?{' '}
          <Anchor component={Link} href="/login" size="sm" fw={500}>
            Sign in
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}