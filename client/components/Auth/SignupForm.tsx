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

export function SignupForm() {
  return (
    <Box className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center">
          Create your account
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
          Manage your tasks with ease
        </Text>

        <Group grow gap="md">
          <TextInput label="First name" placeholder="Gaurav" radius="md" />
          <TextInput label="Last name" placeholder="Chaudhary" radius="md" />
        </Group>
        <TextInput label="Email" placeholder="hello@kanspark.com" mt="md" size="md" radius="md" />
        <PasswordInput
          label="Password"
          placeholder="Create a password"
          mt="md"
          size="md"
          radius="md"
        />
        <PasswordInput
          label="Confirm password"
          placeholder="Confirm your password"
          mt="md"
          size="md"
          radius="md"
        />
        <div>

        <Checkbox label="I agree to the" size="md" mt="md" />
        <Group gap={5}>
          <Text size="sm">terms and conditions</Text>
          <Anchor component={Link} href="/terms" size="sm">
            Terms
          </Anchor>
          <Text size="sm">and</Text>
          <Anchor component={Link} href="/privacy" size="sm">
            Privacy Policy
          </Anchor>
        </Group>
        </div>
        <Button fullWidth mt="xl" size="md" radius="md">
          Create account
        </Button>

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

