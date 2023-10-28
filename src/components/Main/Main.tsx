import { Container, Flex, Grid } from '@radix-ui/themes';
import { useState } from 'react';
import ASTOutput from '../ASTOutput';
import CodeEditor, { type CursorPosition } from '../CodeEditor';
import styles from './Main.module.scss';

interface IMainProps {
  message?: string;
}

const defaultValue = `export enum Value {
  Foo = 'foo',
  Bar = 'bar',
}
`;

function Main(props: IMainProps) {
  const [code, setCode] = useState<string | undefined>(defaultValue);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | undefined>();

  const [selectedNode, setSelectedNode] = useState<any>();

  return (
    <Container className={styles.root}>
      <Grid columns="2" gap="3">
        <Flex>
          <CodeEditor
            defaultValue={defaultValue}
            onChange={setCode}
            onCursorPositionChange={setCursorPosition}
            selectedNode={selectedNode}
          />
        </Flex>
        <Flex>
          <ASTOutput code={code ?? ''} cursorOffset={cursorPosition?.offset} onNodeSelect={setSelectedNode} />
        </Flex>
      </Grid>
    </Container>
  );
}

export default Main;
