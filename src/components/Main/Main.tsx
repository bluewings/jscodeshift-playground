import { Container, Flex, Grid } from '@radix-ui/themes';
import ASTOutput from '../ASTOutput';
import ScriptEditor from '../ScriptEditor';
import SourceEditor from '../SourceEditor';
import styles from './Main.module.scss';

interface IMainProps {
  message?: string;
}

function Main(props: IMainProps) {
  return (
    <Container className={styles.root}>
      <Grid columns="2" gap="3">
        <Flex>
          <SourceEditor />
        </Flex>
        <Flex direction="column">
          <ScriptEditor />
          <ASTOutput />
        </Flex>
      </Grid>
    </Container>
  );
}

export default Main;
