import Editor from '@monaco-editor/react';
import { useAtom } from 'jotai';
import { scriptAtom } from '../../store/script';
import styles from './ScriptEditor.module.scss';

interface IScriptEditorProps {}

function ScriptEditor(_props: IScriptEditorProps) {
  const [script, setScript] = useAtom(scriptAtom);

  return (
    <div className={styles.root}>
      <Editor
        defaultLanguage="typescript"
        options={{ fontSize: 14, tabSize: 2 }}
        height={200}
        defaultValue={script}
        onChange={(value) => setScript(value || '')}
      />
    </div>
  );
}

export default ScriptEditor;
