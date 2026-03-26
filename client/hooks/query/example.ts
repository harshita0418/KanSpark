import { useQuery } from '@tanstack/react-query';

interface ExampleData {
  id: number;
  name: string;
}

async function fetchExample(): Promise<ExampleData[]> {
  const response = await fetch('/api/example');
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
}

export function useExample() {
  return useQuery({
    queryKey: ['example'],
    queryFn: fetchExample,
  });
}
