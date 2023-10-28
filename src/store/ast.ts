import { atom } from 'jotai';

export const currentNodeAtom = atom<{
  type: string;
  range: { start: number; end: number };
} | null>(null);
