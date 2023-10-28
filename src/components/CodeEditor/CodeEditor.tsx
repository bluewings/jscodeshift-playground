import Editor, { type OnChange, OnMount } from '@monaco-editor/react';
import { useCallback } from 'react';
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
}

function CodeEditor({ defaultValue, onChange, onCursorPositionChange }: ICodeEditorProps) {
  const handleEditorWillMount = (monaco: any) => {
    // here is the monaco instance
    // do something before editor is mounted
    // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

  const handleCursorPositionChange = useHandle(onCursorPositionChange);
  const handleEditorDidMount: OnMount = useCallback(
    async (editor, monaco) => {
      editor.onDidChangeCursorPosition(() => {
        const position = editor.getPosition();
        if (position) {
          const { lineNumber, column } = position;
          const offset = editor
            .getValue()
            .split('\n')
            .slice(0, lineNumber - 1)
            .reduce((accum, line) => (accum += line.length + 1), column - 1);

          handleCursorPositionChange({ lineNumber, column, offset });
        } else {
          handleCursorPositionChange(undefined);
        }
      });
    },
    [handleCursorPositionChange],
  );

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
