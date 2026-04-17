import '@mantine/core/styles.css';
import './globals.css';

import React from 'react';
import { Inter } from 'next/font/google';
import { mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Providers } from '@/components/Providers/Providers';
import { theme } from '../theme';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kanspark - Visual Project Management',
  description: 'Streamline your projects with intuitive Kanban boards',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
