'use client';

import { Group, Radio, Stack, Text } from '@mantine/core';
import classes from './RoleSelector.module.css';

const roles = [
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Can view the board only',
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Can view and edit the board',
  },
];

interface RoleSelectorProps {
  value: 'editor' | 'viewer';
  onChange: (value: 'editor' | 'viewer') => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const cards = roles.map((role) => (
    <Radio.Card className={classes.root} value={role.value} key={role.value}>
      <Group wrap="nowrap" align="flex-start">
        <Radio.Indicator />
        <div>
          <Text className={classes.label}>{role.label}</Text>
          <Text className={classes.description}>{role.description}</Text>
        </div>
      </Group>
    </Radio.Card>
  ));

  return (
    <Radio.Group value={value} onChange={(val) => onChange(val as 'editor' | 'viewer')}>
      <Stack pt="md" gap="xs">
        {cards}
      </Stack>
    </Radio.Group>
  );
}