import * as babylon from '@babel/parser';
import { useAtom, useAtomValue } from 'jotai';
import j from 'jscodeshift';
import { useEffect, useMemo } from 'react';
import { currentNodeAtom } from '../../store/ast';
import { cursorOffsetAtom, sourceAtom } from '../../store/source';
import styles from './ASTOutput.module.scss';

interface IASTOutputProps {}

function ASTOutput(props: IASTOutputProps) {
  const code = useAtomValue(sourceAtom);
  const cursorOffset = useAtomValue(cursorOffsetAtom);
  const [selectedNode, setCurrentNode] = useAtom(currentNodeAtom);

  const { ast, error } = useMemo(() => {
    try {
      const root = jsc(code ?? '');
      return { ast: pruneAstData(root.getAST()[0]?.value?.program), error: null };
    } catch (err: any) {
      return { ast: null, error: err?.message as string };
    }
  }, [code]);

  useEffect(() => {
    let currentNode = null;
    if (ast && typeof cursorOffset === 'number') {
      const nodes: any[] = [];
      const findNode = (node: any) => {
        if (Array.isArray(node)) {
          node.forEach(findNode);
        } else if (typeof node === 'object' && node) {
          const start = node.range?.start;
          const end = node.range?.end;
          if (typeof start === 'number' && typeof end === 'number' && start <= cursorOffset && cursorOffset <= end) {
            nodes.push(node);
          }
          Object.values(node).forEach(findNode);
        }
      };
      findNode(ast);
      currentNode = nodes.sort((a, b) => a.range.end - a.range.start - (b.range.end - b.range.start))[0] ?? null;
    }
    setCurrentNode(currentNode);
  }, [ast, cursorOffset, setCurrentNode]);

  return (
    <div className={styles.root}>
      <table>
        <tbody>
          <tr>
            <td valign="top">
              <pre>{ast ? JSON.stringify(ast, null, 2) : error}</pre>
            </td>
            <td valign="top">
              <pre>{JSON.stringify(selectedNode, null, 2)}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ASTOutput;

const jsc = (source: string) =>
  j(source, {
    parser: {
      parse: (source: string) => {
        return babylon.parse(source, {
          sourceType: 'module',
          plugins: ['typescript'],
        });
      },
    },
  });

const pruneAstData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(pruneAstData);
  } else if (typeof data === 'object' && data && 'type' in data) {
    const { start, end, ...rest } = Object.fromEntries(
      Object.entries(data)
        .filter(([k, v]) => !['loc', 'extra'].includes(k))
        .map(([k, v]): [string, any] => [k, pruneAstData(v)]),
    );
    if (typeof start === 'number' && typeof end === 'number') {
      rest.range = { start, end };
    }
    return rest;
  }
  return data;
};
