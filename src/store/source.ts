import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const sourceAtom = atomWithStorage('source', '');

export const cursorPositionAtom = atom<{
  lineNumber: number;
  column: number;
} | null>(null);

export const cursorOffsetAtom = atom((get) => {
  const source = get(sourceAtom);
  const cursorPosition = get(cursorPositionAtom);
  if (source && cursorPosition) {
    const { lineNumber, column } = cursorPosition;
    return source
      .split(/\n/)
      .slice(0, lineNumber - 1)
      .reduce((accum, line) => (accum += line.length + 1), column - 1);
  }
  return null;
});
