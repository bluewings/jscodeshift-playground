import Editor from '@monaco-editor/react';
import styles from './ScriptEditor.module.scss';

interface IScriptEditorProps {}

function ScriptEditor(props: IScriptEditorProps) {
  return (
    <div className={styles.root}>
      <Editor defaultLanguage="typescript" options={{ fontSize: 14, tabSize: 2 }} height={200} />
    </div>
  );
}

export default ScriptEditor;
