/**
 * @ Author: Joel D'Souza
 * @ Create Time: 2022-05-17 22:15:07
 * @ Modified by: Joel D'Souza
 * @ Modified time: 2022-05-17 22:40:13
 * @ Description:a clone of https://github.com/contentful/rich-text/tree/master/packages/rich-text-react-renderer
 *  but for solid-js
 * @format
 */

import { FlowComponent, JSXElement } from 'solid-js';
import {
  Block,
  BLOCKS,
  Inline,
  INLINES,
  Text,
} from '@contentful/rich-text-types';

export type CommonNode = Text | Block | Inline;
export type NodeRendererProps = {
  node: Block | Inline;
};

export interface RenderNode {
  [k: string]: FlowComponent<NodeRendererProps>;
}

export interface RenderMark {
  [k: string]: (text: JSXElement) => JSXElement;
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
