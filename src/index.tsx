/**
 * @ Author: Joel D'Souza
 * @ Create Time: 2022-05-17 22:15:07
 * @ Modified by: Joel D'Souza
 * @ Modified time: 2022-05-19 10:33:49
 * @ Description:a clone of https://github.com/contentful/rich-text/tree/master/packages/rich-text-react-renderer
 *  but for solid-js
 * @format
 */

import {
  Component,
  JSXElement,
  ParentComponent,
  VoidComponent,
  For,
} from 'solid-js';
import {
  Document,
  Block,
  Inline,
  Text,
  BLOCKS,
  INLINES,
  MARKS,
  helpers,
} from '@contentful/rich-text-types';
import * as O from 'fp-ts/lib/Option';
import { flow, pipe } from 'fp-ts/lib/function';

export type CommonNode = Text | Block | Inline;
export type NodeRendererProps = {
  node: Block | Inline;
};

export interface RenderNode {
  [k: string]: ParentComponent<NodeRendererProps>;
}

export interface RenderMark {
  [k: string]: ParentComponent;
}

export interface RenderText {
  (text: string): JSXElement;
}

export interface Options {
  /**
   * Node renderers
   */
  renderNode?: RenderNode;
  /**
   * Mark renderers
   */
  renderMark?: RenderMark;
  /**
   * Text renderer
   */
  renderText?: RenderText;
}

const defaultNodeRenderers: RenderNode = {
  [BLOCKS.DOCUMENT]: (props) => <>{props.children}</>,
  [BLOCKS.PARAGRAPH]: (props) => <p>{props.children}</p>,
  [BLOCKS.HEADING_1]: (props) => <h1>{props.children}</h1>,
  [BLOCKS.HEADING_2]: (props) => <h2>{props.children}</h2>,
  [BLOCKS.HEADING_3]: (props) => <h3>{props.children}</h3>,
  [BLOCKS.HEADING_4]: (props) => <h4>{props.children}</h4>,
  [BLOCKS.HEADING_5]: (props) => <h5>{props.children}</h5>,
  [BLOCKS.HEADING_6]: (props) => <h6>{props.children}</h6>,
  [BLOCKS.EMBEDDED_ENTRY]: (props) => <div>{props.children}</div>,
  [BLOCKS.UL_LIST]: (props) => <ul>{props.children}</ul>,
  [BLOCKS.OL_LIST]: (props) => <ol>{props.children}</ol>,
  [BLOCKS.LIST_ITEM]: (props) => <li>{props.children}</li>,
  [BLOCKS.QUOTE]: (props) => <blockquote>{props.children}</blockquote>,
  [BLOCKS.HR]: () => <hr />,
  [BLOCKS.TABLE]: (props) => (
    <table>
      <tbody>{props.children}</tbody>
    </table>
  ),
  [BLOCKS.TABLE_ROW]: (props) => <tr>{props.children}</tr>,
  [BLOCKS.TABLE_HEADER_CELL]: (props) => <th>{props.children}</th>,
  [BLOCKS.TABLE_CELL]: (props) => <td>{props.children}</td>,
  [INLINES.ASSET_HYPERLINK]: (props) => (
    <DefaultInline type={INLINES.ASSET_HYPERLINK} node={props.node as Inline} />
  ),
  [INLINES.ENTRY_HYPERLINK]: (props) => (
    <DefaultInline type={INLINES.ENTRY_HYPERLINK} node={props.node as Inline} />
  ),
  [INLINES.EMBEDDED_ENTRY]: (props) => (
    <DefaultInline type={INLINES.EMBEDDED_ENTRY} node={props.node as Inline} />
  ),
  [INLINES.HYPERLINK]: (props) => (
    <a href={props.node.data.uri}>{props.children}</a>
  ),
};

type DefaultInlineProps = {
  type: string;
  node: Inline;
};

const DefaultInline: VoidComponent<DefaultInlineProps> = (props) => {
  return (
    <span>
      type: {props.node.nodeType} id: {props.node.data.target.sys.id}
    </span>
  );
};

const DefaultNode: ParentComponent<NodeRendererProps> = (props) => {
  return <>{props.children}</>;
};

const defaultMarkRenderers: RenderMark = {
  [MARKS.BOLD]: (props) => <b>{props.children}</b>,
  [MARKS.ITALIC]: (props) => <i>{props.children}</i>,
  [MARKS.UNDERLINE]: (props) => <u>{props.children}</u>,
  [MARKS.CODE]: (props) => <code>{props.children}</code>,
};

const DefaultMark: ParentComponent = (props) => <>{props.children}</>;

type SolidRichTextProps = {
  document: Document;
  options?: Options;
};

const SolidRichText: Component<SolidRichTextProps> = (props) => {
  return (
    <NodeToSolidComponent
      node={props.document}
      options={{
        renderNode: {
          ...defaultNodeRenderers,
          ...(props.options && props.options.renderNode),
        },
        renderMark: {
          ...defaultMarkRenderers,
          ...(props.options && props.options.renderMark),
        },
        renderText: props.options && props.options.renderText,
      }}
    />
  );
};

type NodeListToSolidComponentProps = {
  nodes: CommonNode[];
  options: Options;
};

const NodeListToSolidComponent: Component<NodeListToSolidComponentProps> = (
  props
) => {
  return (
    <For each={props.nodes}>
      {(node) => <NodeToSolidComponent node={node} options={props.options} />}
    </For>
  );
};

type NodeToSolidComponent = {
  node: CommonNode;
  options: Options;
};

export const NodeToSolidComponent: Component<NodeToSolidComponent> = (
  props
) => {
  // for text nodes
  if (helpers.isText(props.node)) {
    return props.node.marks.reduce(
      (v, m) => {
        const Value = pipe(
          props.options,
          O.fromNullable,
          O.map(({ renderMark }) => renderMark),
          O.chain(
            flow(
              O.fromNullable,
              O.map((r) => r[m.type] ?? DefaultMark)
            )
          ),
          O.getOrElse(() => DefaultMark)
        );

        return <Value>{v}</Value>;
      },
      pipe(
        props.options,
        O.fromNullable,
        O.map(({ renderText }) => renderText),
        O.chain(
          flow(
            O.fromNullable,
            O.map((r) => {
              return r((props.node as unknown as Text).value);
            })
          )
        ),
        O.getOrElse(() => (props.node as unknown as Text).value)
      )
    );
  }
  // for Nodes
  const children = (
    <NodeListToSolidComponent
      nodes={(props.node as unknown as Block).content}
      options={props.options}
    />
  );

  const Component = pipe(
    props.options,
    O.fromNullable,
    O.map(({ renderNode }) => renderNode),
    O.chain(
      flow(
        O.fromNullable,
        O.map((r) => {
          return r[props.node.nodeType] ?? DefaultNode;
        })
      )
    ),
    O.getOrElse(() => DefaultNode)
  );

  return (
    <Component node={props.node as unknown as Block | Inline}>
      {children}
    </Component>
  );
};

export default SolidRichText;
