import Editor, { type OnChange, OnMount } from '@monaco-editor/react';
import { ComponentProps, useCallback, useEffect, useRef } from 'react';
import useHandle from '../../hooks/useHandle';
import styles from './CodeEditor.module.scss';

export interface CursorPosition {
  lineNumber: number;
  column: number;
  offset: number;
}

interface ICodeEditorProps {
  defaultValue?: string;
  onChange: OnChange;
  onCursorPositionChange?: (cursorPosition: CursorPosition | undefined) => void;
  selectedNode?: { range: { start: number; end: number } };
}

type StandaloneCodeEditor = Parameters<Required<ComponentProps<typeof Editor>>['onMount']>[0];
type StandaloneCodeMonaco = Parameters<Required<ComponentProps<typeof Editor>>['onMount']>[1];

function CodeEditor({ defaultValue, onChange, onCursorPositionChange, selectedNode }: ICodeEditorProps) {
  const handleEditorWillMount = (monaco: any) => {
    // here is the monaco instance
    // do something before editor is mounted
    // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

  const handleCursorPositionChange = useHandle(onCursorPositionChange);

  const editorRef = useRef<StandaloneCodeEditor>();
  const monacoRef = useRef<StandaloneCodeMonaco>();
  const handleEditorDidMount: OnMount = useCallback(
    async (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      editor.onDidChangeCursorPosition(() => {
        const position = editor.getPosition();
        if (position) {
          const { lineNumber, column } = position;
          handleCursorPositionChange({ lineNumber, column, offset: toOffset(editor.getValue(), position) });
        } else {
          handleCursorPositionChange(undefined);
        }
      });
    },
    [handleCursorPositionChange],
  );

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (editor && monaco) {
      if (selectedNode) {
        const value = editor.getValue();
        const p1 = toCursorPosition(value, selectedNode.range.start);
        const p2 = toCursorPosition(value, selectedNode.range.end);
        const collection = editor.createDecorationsCollection([
          {
            range: new monaco.Range(p1.lineNumber, p1.column, p2.lineNumber, p2.column),
            options: { inlineClassName: styles.selected },
          },
        ]);
        return () => collection.clear();
      }
    }
  }, [selectedNode]);

  return (
    <div className={styles.root}>
      <Editor
        defaultLanguage="typescript"
        defaultValue={defaultValue ?? ''}
        onChange={onChange}
        options={{ fontSize: 14, tabSize: 2 }}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default CodeEditor;

const toOffset = (source: string, { lineNumber, column }: Omit<CursorPosition, 'offset'>) => {
  return source
    .split(/\n/)
    .slice(0, lineNumber - 1)
    .reduce((accum, line) => (accum += line.length + 1), column - 1);
};

const toCursorPosition = (source: string, offset: number): Omit<CursorPosition, 'offset'> => {
  let totalLength = 0;
  return source.split(/\n/).reduce(
    (accum, line) => {
      if (totalLength < offset) {
        if (offset <= totalLength + line.length) {
          accum.column = offset - totalLength + 1;
        } else {
          accum.lineNumber++;
        }
      }
      totalLength += line.length + 1;
      return accum;
    },
    { lineNumber: 1, column: 1 },
  );
};
