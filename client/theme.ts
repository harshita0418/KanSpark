'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'violet',
  fontFamily: 'Inter, var(--mantine-font-family)',
  headings: {
    fontFamily: 'Inter, var(--mantine-font-family)',
  },
  colors: {
    violet: [
      '#f5f3ff',
      '#ede9fe',
      '#ddd6fe',
      '#c4b5fd',
      '#a78bfa',
      '#8b5cf6',
      '#7c3aed',
      '#6d28d9',
      '#5b21b6',
      '#4c1d95',
    ],
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
