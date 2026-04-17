'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconBulb, IconCheckbox, IconPlus, IconSearch, IconArchive, IconLayoutBoard } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  ScrollArea,
  Stack,
  LoadingOverlay,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { UserButton } from '../UserButton/UserButton';
import { useBoards } from '@/hooks/query/useBoards';
import classes from './NavbarSearch.module.css';

const links = [
  { icon: IconLayoutBoard, label: 'Workspace', href: '/workspace' },
  { icon: IconArchive, label: 'Archived', href: '/workspace/archived' },
];

export function NavbarSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: boards, isLoading } = useBoards();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredBoards = useMemo(() => {
    if (!boards) return [];
    if (!debouncedSearch.trim()) return boards.slice(0, 8);
    
    const query = debouncedSearch.toLowerCase();
    return boards.filter(
      (board) =>
        board.title.toLowerCase().includes(query) ||
        board.description?.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [boards, debouncedSearch]);

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleBoardClick = (boardId: string) => {
    router.push(`/workspace/${boardId}`);
    setSearchQuery('');
    setIsSearchActive(false);
  };

  const mainLinks = links.map((link) => (
    <UnstyledButton 
      key={link.label} 
      className={classes.mainLink}
      component={Link}
      href={link.href}
    >
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
    </UnstyledButton>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.searchBar}>
        <TextInput
          placeholder="Search boards..."
          size="xs"
          leftSection={<IconSearch size={14} stroke={1.5} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          ref={searchInputRef}
        />
        
        {isSearchActive && (
          <Box className={classes.searchDropdown}>
            <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
            {debouncedSearch.trim() ? (
              filteredBoards.length > 0 ? (
                <Stack gap={4}>
                  {filteredBoards.map((board) => (
                    <Box
                      key={board._id}
                      className={classes.searchResult}
                      onClick={() => handleBoardClick(board._id)}
                    >
                      <Group gap="xs">
                        <IconLayoutBoard size={16} />
                        <div>
                          <Text size="sm" fw={500}>{board.title}</Text>
                          {board.description && (
                            <Text size="xs" c="dimmed" lineClamp={1}>
                              {board.description}
                            </Text>
                          )}
                        </div>
                      </Group>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Text size="sm" c="dimmed" p="xs">No boards found</Text>
              )
            ) : (
              <Stack gap={4}>
                {boards?.slice(0, 8).map((board) => (
                  <Box
                    key={board._id}
                    className={classes.searchResult}
                    onClick={() => handleBoardClick(board._id)}
                  >
                    <Group gap="xs">
                      <IconLayoutBoard size={16} />
                      <div>
                        <Text size="sm" fw={500}>{board.title}</Text>
                        {board.description && (
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {board.description}
                          </Text>
                        )}
                      </div>
                    </Group>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </div>

      <div className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </div>

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Your Boards
          </Text>
          <Tooltip label="Create new board" withArrow position="right">
            <ActionIcon 
              variant="default" 
              size={18} 
              aria-label="Create new board"
              component={Link}
              href="/workspace"
            >
              <IconPlus size={12} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <ScrollArea h={200}>
          <Box className={classes.collections}>
            {isLoading ? (
              <Text size="xs" c="dimmed" p="xs">Loading...</Text>
            ) : boards && boards.length > 0 ? (
              boards.slice(0, 8).map((board) => (
                <Box
                  key={board._id}
                  component={Link}
                  href={`/workspace/${board._id}`}
                  className={classes.collectionLink}
                >
                  <Box component="span" mr={9} fz={16}>
                    📋
                  </Box>{' '}
                  {board.title}
                </Box>
              ))
            ) : (
              <Text size="xs" c="dimmed" p="xs">No boards yet</Text>
            )}
          </Box>
        </ScrollArea>
      </div>

      <div className={classes.user_section}>
        <UserButton />
      </div>
    </nav>
  );
}
