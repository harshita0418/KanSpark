'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Alert,
  Anchor,
  Box,
  Button,
  Paper,
  PasswordInput,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useResetPassword } from '@/hooks/mutation/useAuth';
import classes from '@/components/Auth/AuthForm.module.css';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const resetPassword = useResetPassword();

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await resetPassword.mutateAsync({ token, password });
      setSuccess('Password reset successful! Redirecting...');
      router.push('/workspace');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    }
  };

  return (
    <Box className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center">
          Reset Password
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          Enter your new password
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
          <PasswordInput
            label="New Password"
            placeholder="Your new password"
            size="md"
            radius="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!token}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your new password"
            mt="md"
            size="md"
            radius="md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={!token}
          />
          <Button fullWidth mt="xl" size="md" radius="md" type="submit" loading={resetPassword.isPending} disabled={!token}>
            Reset Password
          </Button>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt={30}>
          Need a new reset link?{' '}
          <Anchor component={Link} href="/forgot-password" size="sm" fw={500}>
            Request again
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Box className={classes.wrapper}><Paper className={classes.form} p={30}>Loading...</Paper></Box>}>
      <ResetPasswordForm />
    </Suspense>
  );
}