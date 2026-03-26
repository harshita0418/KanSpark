# Project Context

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **UI Library**: Mantine UI 8.3.18
- **State Management**: TanStack Query (@tanstack/react-query)
- **Language**: TypeScript 5.9.3
- **Package Manager**: Yarn 4.13.0

## Project Structure

```
client/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Mantine + Query provider
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Providers/         # Context providers (QueryClient)
│   ├── Welcome/           # Welcome component with tests
│   └── ColorSchemeToggle/ # Theme toggle
├── hooks/                 # Custom React hooks
│   ├── query/             # TanStack Query hooks
│   │   └── example.ts     # Example query hook
│   └── mutation/          # TanStack Mutation hooks
├── lib/                   # Utility libraries
│   └── query-client.ts    # TanStack Query client config
├── theme.ts               # Mantine theme configuration
└── test-utils/            # Testing utilities
```

## Key Patterns

### TanStack Query Hooks

- Store query hooks in `hooks/query/`
- Store mutation hooks in `hooks/mutation/`
- Each hook should have its own file
- Use descriptive names: `use[Entity]` or `use[Action]`

### Mantine UI

- Already configured with custom theme
- Use Mantine components for UI
- Import styles: `import '@mantine/core/styles.css'`

### Providers Setup

- `components/Providers/Providers.tsx` wraps app with QueryClientProvider
- Root layout includes both MantineProvider and Providers
