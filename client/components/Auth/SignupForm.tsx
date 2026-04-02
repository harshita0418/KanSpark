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
import { useRegister } from '@/hooks/mutation/useAuth';
import classes from './AuthForm.module.css';

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const register = useRegister();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'agree' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field === 'confirmPassword' && formData.password && value !== formData.password) {
      setPasswordError('Passwords do not match');
    } else if (field === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.lastname || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!formData.agree) {
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      await register.mutateAsync({
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Account created successfully! Redirecting...');
      router.push('/workspace');
    } catch (err) {
      setSuccess('');
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <Box className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center">
          Create your account
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
          <Group grow gap="md">
            <TextInput
              label="First name"
              placeholder="Gaurav"
              radius="md"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
            <TextInput
              label="Last name"
              placeholder="Chaudhary"
              radius="md"
              value={formData.lastname}
              onChange={handleChange('lastname')}
              required
            />
          </Group>
          <TextInput
            label="Email"
            placeholder="hello@kanspark.com"
            mt="md"
            size="md"
            radius="md"
            value={formData.email}
            onChange={handleChange('email')}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            mt="md"
            size="md"
            radius="md"
            value={formData.password}
            onChange={handleChange('password')}
            required
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Confirm your password"
            mt="md"
            size="md"
            radius="md"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={passwordError}
            required
          />
          <Checkbox
            label="I agree to the terms and conditions"
            size="md"
            mt="md"
            checked={formData.agree}
            onChange={handleChange('agree')}
          />
          <Button
            fullWidth
            mt="xl"
            size="md"
            radius="md"
            type="submit"
            loading={register.isPending}
          >
            Create account
          </Button>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          Already have an account?{' '}
          <Anchor component={Link} href="/login" size="sm" fw={500}>
            Login
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}
