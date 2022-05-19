[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Strict TypeScript Checked](https://badgen.net/badge/TS/Strict "Strict TypeScript Checked")](https://www.typescriptlang.org)
# `rich-text-solid-renderer`

Solid-js renderer for contentful rich text.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @joeldsouzax/rich-text-solid-renderer
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @joeldsouzax/rich-text-solid-renderer
```

## Usage

```typescript
import {ParentComponent} from 'solid-js';
import SolidRichText from '@joeldsouzax/rich-text-solid-renderer';

const document = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Hello world!',
          marks: [],
          data: {}
        },
      ],
    },
  ],
};

const Parent: ParentComponent = (props) => {
    return <SolidRichText document={document}/>
}; // -> <p>Hello world!</p>
```

```typescript
import {ParentComponent} from 'solid-js';
import SolidRichText from '@joeldsouzax/rich-text-solid-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          marks: [{ type: 'bold' }],
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }],
        },
      ],
    },
  ],
};


const Parent: ParentComponent = (props) => {
    return <SolidRichText document={document}/>
};
// -> <p><b>Hello</b><u> world!</u></p>
```

You can also pass custom renderers for both marks and nodes as an optional parameter like so:

```javascript
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import {ParentComponent} from 'solid-js';
import SolidRichText, { NodeRendererProps } from '@joeldsouzax/rich-text-solid-renderer';


const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          marks: [{ type: 'bold' }],
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }],
        },
      ],
    },
  ],
};

const Bold = (props) => <p className="bold">{props.children}</p>;

const Text = (props) => <p className="align-center">{props.children}</p>;

const options = {
  renderMark: {
    [MARKS.BOLD]: props => <Bold>{props.children}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (props) => <Text>{props.children}</Text>,
  },
  renderText: text => text.replace('!', '?'),
};

const Parent: ParentComponent = (props) => {
    return <SolidRichText document={document} option={options}/>
};
// -> <p class="align-center"><p class="bold">Hello</p><u> world?</u></p>
```

Last, but not least, you can pass a custom rendering component for an embedded entry:

```typescript
import { BLOCKS } from '@contentful/rich-text-types';
import SolidRichText from '@joeldsouzax/rich-text-solid-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'embedded-entry-block',
      data: {
        target: (...)Link<'Entry'>(...);
      },
    },
  ]
};

const CustomComponent = (props) => (
  <div>
    <h2>{props.title}</h2>
    <p>{props.description}</p>
  </div>
);

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (props) => {
      return <CustomComponent title={props.node.data.target.fields.title} description={props.node.data.target.fields.description} />
    }
  }
};

const Parent: ParentComponent = (props) => {
    return <SolidRichText document={document} option={options}/>
};
// -> <div><h2>[title]</h2><p>[description]</p></div>
```

The `renderNode` keys should be one of the following `BLOCKS` and `INLINES` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BLOCKS`

  - `DOCUMENT`
  - `PARAGRAPH`
  - `HEADING_1`
  - `HEADING_2`
  - `HEADING_3`
  - `HEADING_4`
  - `HEADING_5`
  - `HEADING_6`
  - `UL_LIST`
  - `OL_LIST`
  - `LIST_ITEM`
  - `QUOTE`
  - `HR`
  - `EMBEDDED_ENTRY`
  - `EMBEDDED_ASSET`

- `INLINES`
  - `EMBEDDED_ENTRY` (this is different from the `BLOCKS.EMBEDDED_ENTRY`)
  - `HYPERLINK`
  - `ENTRY_HYPERLINK`
  - `ASSET_HYPERLINK`

The `renderMark` keys should be one of the following `MARKS` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BOLD`
- `ITALIC`
- `UNDERLINE`
- `CODE`

The `renderText` callback is a function that has a single string argument and returns a React node. Each text node is evaluated individually by this callback. A possible use case for this is to replace instances of `\n` produced by `Shift + Enter` with `<br/>` React elements. This could be accomplished in the following way:

```javascript
const options = {
  renderText: (props) => {
            return props.split('\n').reduce((children, textSegment, index) => {
              return [...children, index > 0 && <br />, textSegment];
            }, []);
          },
};
```
