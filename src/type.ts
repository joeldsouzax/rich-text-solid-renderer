/** @format */

export enum MARKS {
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  CODE = 'code',
}

/**
 * Map of all Contentful block types. Blocks contain inline or block nodes.
 */
export enum BLOCKS {
  DOCUMENT = 'document',
  PARAGRAPH = 'paragraph',

  HEADING_1 = 'heading-1',
  HEADING_2 = 'heading-2',
  HEADING_3 = 'heading-3',
  HEADING_4 = 'heading-4',
  HEADING_5 = 'heading-5',
  HEADING_6 = 'heading-6',

  OL_LIST = 'ordered-list',
  UL_LIST = 'unordered-list',
  LIST_ITEM = 'list-item',

  HR = 'hr',
  QUOTE = 'blockquote',

  EMBEDDED_ENTRY = 'embedded-entry-block',
  EMBEDDED_ASSET = 'embedded-asset-block',

  TABLE = 'table',
  TABLE_ROW = 'table-row',
  TABLE_CELL = 'table-cell',
  TABLE_HEADER_CELL = 'table-header-cell',
}

export enum INLINES {
  HYPERLINK = 'hyperlink',
  ENTRY_HYPERLINK = 'entry-hyperlink',
  ASSET_HYPERLINK = 'asset-hyperlink',
  EMBEDDED_ENTRY = 'embedded-entry-inline',
}

type EmptyNodeData = Record<string, never>;
// BLOCKS

// Heading
export interface Heading1 extends Block {
  nodeType: BLOCKS.HEADING_1;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading2 extends Block {
  nodeType: BLOCKS.HEADING_2;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading3 extends Block {
  nodeType: BLOCKS.HEADING_3;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading4 extends Block {
  nodeType: BLOCKS.HEADING_4;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading5 extends Block {
  nodeType: BLOCKS.HEADING_5;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading6 extends Block {
  nodeType: BLOCKS.HEADING_6;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

// Paragraph
export interface Paragraph extends Block {
  nodeType: BLOCKS.PARAGRAPH;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

// Quote
export interface Quote extends Block {
  nodeType: BLOCKS.QUOTE;
  data: EmptyNodeData;
  content: Paragraph[];
}
// Horizontal rule
export interface Hr extends Block {
  nodeType: BLOCKS.HR;
  /**
   *
   * @maxItems 0
   */
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

// OL
export interface OrderedList extends Block {
  nodeType: BLOCKS.OL_LIST;
  data: EmptyNodeData;
  content: ListItem[];
}
// UL
export interface UnorderedList extends Block {
  nodeType: BLOCKS.UL_LIST;
  data: EmptyNodeData;
  content: ListItem[];
}

export interface ListItem extends Block {
  nodeType: BLOCKS.LIST_ITEM;
  data: EmptyNodeData;
  content: ListItemBlock[];
}

// taken from graphql schema-generator/contentful-types/link.ts
export interface Link<T extends string = string> {
  sys: {
    type: 'Link';
    linkType: T;
    id: string;
  };
}

export interface EntryLinkBlock extends Block {
  nodeType: BLOCKS.EMBEDDED_ENTRY;
  data: {
    target: Link<'Entry'>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Array<Inline | Text>;
}

export interface AssetLinkBlock extends Block {
  nodeType: BLOCKS.EMBEDDED_ASSET;
  data: {
    target: Link<'Asset'>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Array<Inline | Text>;
}

// INLINE

export interface EntryLinkInline extends Inline {
  nodeType: INLINES.EMBEDDED_ENTRY;
  data: {
    target: Link<'Entry'>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Text[];
}

export interface Hyperlink extends Inline {
  nodeType: INLINES.HYPERLINK;
  data: {
    uri: string;
  };
  content: Text[];
}

export interface AssetHyperlink extends Inline {
  nodeType: INLINES.ASSET_HYPERLINK;
  data: {
    target: Link<'Asset'>;
  };
  content: Text[];
}

export interface EntryHyperlink extends Inline {
  nodeType: INLINES.ENTRY_HYPERLINK;
  data: {
    target: Link<'Entry'>;
  };
  content: Text[];
}

export interface TableCell extends Block {
  nodeType: BLOCKS.TABLE_HEADER_CELL | BLOCKS.TABLE_CELL;
  data: {
    colspan?: number;
    rowspan?: number;
  };

  /**
   * @minItems 1
   */
  content: Paragraph[];
}

export interface TableHeaderCell extends TableCell {
  nodeType: BLOCKS.TABLE_HEADER_CELL;
}

// An abstract table row can have both table cell types

export interface TableRow extends Block {
  nodeType: BLOCKS.TABLE_ROW;
  data: EmptyNodeData;

  /**
   * @minItems 1
   */
  content: TableCell[];
}

export interface Table extends Block {
  nodeType: BLOCKS.TABLE;
  data: EmptyNodeData;

  /**
   * @minItems 1
   */
  content: TableRow[];
}

/**
 * @additionalProperties true
 */
export type NodeData = Record<string, any>; // tslint:disable-line:no-any
export interface Node {
  readonly nodeType: string;

  data: NodeData;
}

export interface Block extends Node {
  nodeType: BLOCKS;
  content: Array<Block | Inline | Text>;
}

export interface Inline extends Node {
  nodeType: INLINES;
  content: Array<Inline | Text>;
}

export interface TopLevelBlock extends Block {
  nodeType: TopLevelBlockEnum;
}

export interface Document extends Node {
  nodeType: BLOCKS.DOCUMENT;
  content: TopLevelBlock[];
}

export interface Text extends Node {
  nodeType: 'text';
  value: string;
  marks: Mark[];
}

export interface Mark {
  type: string;
}

export interface ListItemBlock extends Block {
  nodeType: ListItemBlockEnum;
}

export type TopLevelBlockEnum =
  | BLOCKS.PARAGRAPH
  | BLOCKS.HEADING_1
  | BLOCKS.HEADING_2
  | BLOCKS.HEADING_3
  | BLOCKS.HEADING_4
  | BLOCKS.HEADING_5
  | BLOCKS.HEADING_6
  | BLOCKS.OL_LIST
  | BLOCKS.UL_LIST
  | BLOCKS.HR
  | BLOCKS.QUOTE
  | BLOCKS.EMBEDDED_ENTRY
  | BLOCKS.EMBEDDED_ASSET
  | BLOCKS.TABLE;

/**
 * Array of all top level block types.
 * Only these block types can be the direct children of the document.
 */
export const TOP_LEVEL_BLOCKS: TopLevelBlockEnum[] = [
  BLOCKS.PARAGRAPH,
  BLOCKS.HEADING_1,
  BLOCKS.HEADING_2,
  BLOCKS.HEADING_3,
  BLOCKS.HEADING_4,
  BLOCKS.HEADING_5,
  BLOCKS.HEADING_6,
  BLOCKS.OL_LIST,
  BLOCKS.UL_LIST,
  BLOCKS.HR,
  BLOCKS.QUOTE,
  BLOCKS.EMBEDDED_ENTRY,
  BLOCKS.EMBEDDED_ASSET,
  BLOCKS.TABLE,
];

export type ListItemBlockEnum =
  | BLOCKS.PARAGRAPH
  | BLOCKS.HEADING_1
  | BLOCKS.HEADING_2
  | BLOCKS.HEADING_3
  | BLOCKS.HEADING_4
  | BLOCKS.HEADING_5
  | BLOCKS.HEADING_6
  | BLOCKS.OL_LIST
  | BLOCKS.UL_LIST
  | BLOCKS.HR
  | BLOCKS.QUOTE
  | BLOCKS.EMBEDDED_ENTRY
  | BLOCKS.EMBEDDED_ASSET;

/**
 * Array of all allowed block types inside list items
 */
export const LIST_ITEM_BLOCKS: TopLevelBlockEnum[] = [
  BLOCKS.PARAGRAPH,
  BLOCKS.HEADING_1,
  BLOCKS.HEADING_2,
  BLOCKS.HEADING_3,
  BLOCKS.HEADING_4,
  BLOCKS.HEADING_5,
  BLOCKS.HEADING_6,
  BLOCKS.OL_LIST,
  BLOCKS.UL_LIST,
  BLOCKS.HR,
  BLOCKS.QUOTE,
  BLOCKS.EMBEDDED_ENTRY,
  BLOCKS.EMBEDDED_ASSET,
];

export const TABLE_BLOCKS = [
  BLOCKS.TABLE,
  BLOCKS.TABLE_ROW,
  BLOCKS.TABLE_CELL,
  BLOCKS.TABLE_HEADER_CELL,
];

/**
 * Array of all void block types
 */
export const VOID_BLOCKS = [
  BLOCKS.HR,
  BLOCKS.EMBEDDED_ENTRY,
  BLOCKS.EMBEDDED_ASSET,
];

/**
 * Dictionary of all container block types, and the set block types they accept as children.
 *
 * Note: This does not include `[BLOCKS.DOCUMENT]: TOP_LEVEL_BLOCKS`
 */
export const CONTAINERS = {
  [BLOCKS.OL_LIST]: [BLOCKS.LIST_ITEM],
  [BLOCKS.UL_LIST]: [BLOCKS.LIST_ITEM],
  [BLOCKS.LIST_ITEM]: LIST_ITEM_BLOCKS,
  [BLOCKS.QUOTE]: [BLOCKS.PARAGRAPH],
  [BLOCKS.TABLE]: [BLOCKS.TABLE_ROW],
  [BLOCKS.TABLE_ROW]: [BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL],
  [BLOCKS.TABLE_CELL]: [BLOCKS.PARAGRAPH],
  [BLOCKS.TABLE_HEADER_CELL]: [BLOCKS.PARAGRAPH],
};

/**
 * Array of all heading levels
 */
export const HEADINGS = [
  BLOCKS.HEADING_1,
  BLOCKS.HEADING_2,
  BLOCKS.HEADING_3,
  BLOCKS.HEADING_4,
  BLOCKS.HEADING_5,
  BLOCKS.HEADING_6,
];

/**
 * Array of all block types that may contain text and inline nodes.
 */
export const TEXT_CONTAINERS = [BLOCKS.PARAGRAPH, ...HEADINGS];

/**
 * Node types before `tables` release.
 */
export const V1_NODE_TYPES = [
  BLOCKS.DOCUMENT,
  BLOCKS.PARAGRAPH,
  BLOCKS.HEADING_1,
  BLOCKS.HEADING_2,
  BLOCKS.HEADING_3,
  BLOCKS.HEADING_4,
  BLOCKS.HEADING_5,
  BLOCKS.HEADING_6,
  BLOCKS.OL_LIST,
  BLOCKS.UL_LIST,
  BLOCKS.LIST_ITEM,
  BLOCKS.HR,
  BLOCKS.QUOTE,
  BLOCKS.EMBEDDED_ENTRY,
  BLOCKS.EMBEDDED_ASSET,
  INLINES.HYPERLINK,
  INLINES.ENTRY_HYPERLINK,
  INLINES.ASSET_HYPERLINK,
  INLINES.EMBEDDED_ENTRY,
  'text',
];

/**
 * Tiny replacement for Object.values(object).includes(key) to
 * avoid including CoreJS polyfills
 */
function hasValue(obj: Record<string, unknown>, value: unknown) {
  for (const key of Object.keys(obj)) {
    if (value === obj[key]) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if the node is an instance of Inline.
 */
export function isInline(node: Node): node is Inline {
  return hasValue(INLINES, node.nodeType);
}

/**
 * Checks if the node is an instance of Block.
 */
export function isBlock(node: Node): node is Block {
  return hasValue(BLOCKS, node.nodeType);
}

/**
 * Checks if the node is an instance of Text.
 */
export function isText(node: Node): node is Text {
  return node.nodeType === 'text';
}
