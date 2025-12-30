export type AnimeStatus = 'completed' | 'dropped' | 'waiting' | 'none';

export const AnimeStatus = {
    Completed: 'completed' as AnimeStatus,
    Dropped: 'dropped' as AnimeStatus,
    Waiting: 'waiting' as AnimeStatus,
    None: 'none' as AnimeStatus,
} as const;