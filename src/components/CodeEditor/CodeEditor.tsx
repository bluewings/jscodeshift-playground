import Editor, { type OnMount } from '@monaco-editor/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ComponentProps, useCallback, useEffect, useRef } from 'react';
import { currentNodeAtom } from '../../store/ast';
import { cursorPositionAtom, sourceAtom } from '../../store/source';
import styles from './CodeEditor.module.scss';

export interface CursorPosition {
  lineNumber: number;
  column: number;
  offset: number;
}

interface ICodeEditorProps {}

type StandaloneCodeEditor = Parameters<Required<ComponentProps<typeof Editor>>['onMount']>[0];
type StandaloneCodeMonaco = Parameters<Required<ComponentProps<typeof Editor>>['onMount']>[1];

function CodeEditor(props: ICodeEditorProps) {
  const [source, setSource] = useAtom(sourceAtom);
  const setCursorPosition = useSetAtom(cursorPositionAtom);
  const currentNode = useAtomValue(currentNodeAtom);

  const handleEditorWillMount = (monaco: any) => {
    // here is the monaco instance
    // do something before editor is mounted
    // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

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
          setCursorPosition({ lineNumber, column });
        } else {
          setCursorPosition(null);
        }
      });
    },
    [setCursorPosition],
  );

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (editor && monaco) {
      if (currentNode) {
        const value = editor.getValue();
        const p1 = toCursorPosition(value, currentNode.range.start);
        const p2 = toCursorPosition(value, currentNode.range.end);
        const collection = editor.createDecorationsCollection([
          {
            range: new monaco.Range(p1.lineNumber, p1.column, p2.lineNumber, p2.column),
            options: { inlineClassName: styles.selected },
          },
        ]);
        return () => collection.clear();
      }
    }
  }, [currentNode]);

  return (
    <div className={styles.root}>
      <Editor
        defaultLanguage="typescript"
        defaultValue={source}
        options={{ fontSize: 14, tabSize: 2 }}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        onChange={(value) => setSource(value || '')}
      />
    </div>
  );
}

export default CodeEditor;

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
