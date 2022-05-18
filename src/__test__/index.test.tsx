/** @format */

import { BLOCKS, Document, MARKS } from '@contentful/rich-text-types';
import { cleanup, render } from 'solid-testing-library';
import { headingDoc, hrDoc, marksDoc, paragraphDoc } from './documents';
import SolidRichText from '../index';

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
      marksDoc[MARKS.UNDERLINE],
      marksDoc[MARKS.CODE],
    ];

    docs.forEach((doc) => {
      const tree = render(() => <SolidRichText document={doc} />).baseElement;

      expect(tree).toMatchSnapshot();
      cleanup();
    });
  });
});
