'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

const mockUsers = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/54.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
];

export function SignInModern() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    console.log('Sign in successful! (Demo)');
  };

  return (
    <Box
      className="signin-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1b1e 0%, #121212 100%)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        borderRadius: '12px',
      }}
    >
      <Container
        size="xs"
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px' }}
      >
        <Box
          style={{
            width: '100%',
            borderRadius: '24px',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(18,18,18,0.8) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              marginBottom: '24px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            }}
          >
            <Text fw={700} size="xl" c="violet">
              K
            </Text>
          </Box>

          <Text size="xl" fw={600} c="white" mb="xl" ta="center">
            Kanspark
          </Text>

          <Stack gap="md" style={{ width: '100%' }}>
            <TextInput
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              styles={{
                input: {
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                  '&:focus': {
                    border: '2px solid #845ef7',
                  },
                },
              }}
            />
            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              styles={{
                input: {
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                  '&:focus': {
                    border: '2px solid #845ef7',
                  },
                },
              }}
            />
            {error && (
              <Text size="sm" c="red" ta="left">
                {error}
              </Text>
            )}

            <Divider color="rgba(255,255,255,0.1)" />

            <Button
              onClick={handleSignIn}
              fullWidth
              size="md"
              variant="filled"
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '9999px',
                padding: '12px',
              }}
              styles={{
                root: {
                  '&:hover': {
                    background: 'rgba(255,255,255,0.25)',
                  },
                },
              }}
            >
              Sign in
            </Button>

            <Button
              fullWidth
              size="md"
              variant="default"
              color="dark"
              style={{
                borderRadius: '9999px',
                padding: '12px',
                background: 'linear-gradient(180deg, #232526 0%, #2d2e30 100%)',
              }}
              leftSection={
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  style={{ width: '20px', height: '20px' }}
                />
              }
            >
              Continue with Google
            </Button>

            <Text size="xs" c="dimmed" ta="center" mt="xs">
              Don't have an account?{' '}
              <Text component="span" c="white" td="underline" style={{ cursor: 'pointer' }}>
                Sign up, it's free!
              </Text>
            </Text>
          </Stack>
        </Box>

        <Box ta="center" mt="xl">
          <Text size="sm" c="dimmed" mb="sm">
            Join{' '}
            <Text component="span" fw={500} c="white">
              thousands
            </Text>{' '}
            of users
          </Text>
          <Group justify="center">
            {mockUsers.map((url, i) => (
              <Avatar
                key={i}
                src={url}
                alt="user"
                size={32}
                radius="xl"
                style={{ border: '2px solid #181824' }}
              />
            ))}
          </Group>
        </Box>
      </Container>
    </Box>
  );
}
