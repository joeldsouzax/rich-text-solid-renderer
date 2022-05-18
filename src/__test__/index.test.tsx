/** @format */

import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';
import { cleanup, render } from 'solid-testing-library';
import {
  embeddedEntryDoc,
  headingDoc,
  hrDoc,
  invalidMarksDoc,
  invalidTypeDoc,
  marksDoc,
  multiMarkDoc,
  olDoc,
  paragraphDoc,
  quoteDoc,
  tableDoc,
  ulDoc,
  tableWithHeaderDoc,
  hyperlinkDoc,
  inlineEntityDoc,
} from './documents';
import SolidRichText, { Options } from '../index';
import multiMark from './documents/multi-mark';

describe('rich text solid renderer', () => {
  afterEach(cleanup);

  it('should give an empty div element when given an empty document', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('returns an tree of elements when given a populated document', () => {
    const document: Document = hrDoc;
    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;
    expect(tree).toMatchSnapshot();
  });

  it('renders node with default node renderers', () => {
    const docs: Document[] = [
      paragraphDoc,
      headingDoc(BLOCKS.HEADING_1),
      headingDoc(BLOCKS.HEADING_2),
    ];

    docs.forEach((doc) => {
      const tree = render(() => <SolidRichText document={doc} />).baseElement;
      expect(tree).toMatchSnapshot();
      cleanup();
    });
  });

  it('renders nodes with default mark renderer', () => {
    const docs: Document[] = [
      marksDoc(MARKS.ITALIC),
      marksDoc(MARKS.BOLD),
      marksDoc(MARKS.UNDERLINE),
      marksDoc(MARKS.CODE),
    ];

    docs.forEach((doc) => {
      const tree = render(() => <SolidRichText document={doc} />).baseElement;

      expect(tree).toMatchSnapshot();
      cleanup();
    });
  });

  it('renders unaltered text with default text renderer', () => {
    const document: Document = paragraphDoc;
    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders multiple marks with default mark renderer', () => {
    const document: Document = multiMark();
    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders nodes with passed custom node renderer', () => {
    const options: Options = {
      renderNode: {
        [BLOCKS.DOCUMENT]: (props) => (
          <div id="custom-doc">{props.children}</div>
        ),
        [BLOCKS.PARAGRAPH]: (props) => <p id="custom-para">{props.children}</p>,
      },
    };

    const document: Document = quoteDoc;
    const tree = render(() => (
      <SolidRichText document={document} options={options} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders marks with the passed custom mark renderer', () => {
    const options: Options = {
      renderMark: {
        [MARKS.BOLD]: (props) => (
          <strong id="custom-props">{props.children}</strong>
        ),
      },
    };

    const document: Document = multiMarkDoc();

    const tree = render(() => (
      <SolidRichText document={document} options={options} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders text with the passed custom text renderer', () => {
    const options: Options = {
      renderText: (text) => text.replace(/world/, 'Earth'),
    };

    const document: Document = paragraphDoc;

    const tree = render(() => (
      <SolidRichText document={document} options={options} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('does not render unrecognized marks', () => {
    const document: Document = invalidMarksDoc;
    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders empty node if type is not recognized', () => {
    const document: Document = invalidTypeDoc;
    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders default entry line block', () => {
    const entrySys = {
      sys: {
        id: '9mpxT4zsRi6Iwukey8KeM',
        link: 'Link',
        linkType: 'Entry',
      },
    };

    const document: Document = embeddedEntryDoc(entrySys);

    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders ordered list', () => {
    const document: Document = olDoc;
    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders unordered list', () => {
    const document: Document = ulDoc;
    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders blockquotes', () => {
    const document: Document = quoteDoc;

    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders horizontal rule', () => {
    const document: Document = hrDoc;

    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders tables', () => {
    const document: Document = tableDoc;

    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders tables with header', () => {
    const tree = render(() => (
      <SolidRichText document={tableWithHeaderDoc} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  /// show time

  it('does not crash with inline elements (e.g. hyperlink)', () => {
    const document: Document = hyperlinkDoc;

    const tree = render(() => <SolidRichText document={document} />);

    expect(tree).toBeTruthy();
  });

  it('renders hyperlink', () => {
    const document: Document = hyperlinkDoc;

    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });

  it('renders asset hyperlink', () => {
    const asset = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Asset',
        },
      },
    };
    const document: Document = inlineEntityDoc(asset, INLINES.ASSET_HYPERLINK);

    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });
  it('renders entry hyperlink', () => {
    const entry = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Entry',
        },
      },
    };
    const document: Document = inlineEntityDoc(entry, INLINES.ENTRY_HYPERLINK);

    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });
  it('renders embedded entry', () => {
    const entry = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Entry',
        },
      },
    };
    const document: Document = inlineEntityDoc(entry, INLINES.EMBEDDED_ENTRY);

    const tree = render(() => (
      <SolidRichText document={document} />
    )).baseElement;

    expect(tree).toMatchSnapshot();
  });
});
