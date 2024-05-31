import { Node, mergeAttributes } from '@tiptap/core';
// import { TextSelection } from 'prosemirror-state';


const MarkdownNode = Node.create({
  name: 'markdown',

  group: 'block',

  content: 'block*', // Allow block content inside the markdown node

  parseHTML() {
    return [{ tag: 'div[data-type="markdown"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'markdown' }), 0];
  },

  addAttributes() {
    return {
      content: {
        default: '',
        parseHTML: element => element.getAttribute('data-content'),
        renderHTML: attributes => ({ 'data-content': attributes.content }),
      },
    };
  },

  // addKeyboardShortcuts() {
  //   return {
  //     Enter: ({ editor }) => {
  //       const { state, dispatch } = editor.view;
  //       const { $from, from } = state.selection;

  //       // Insert a new paragraph at the current position
  //       const newParagraph = state.schema.nodes.paragraph.create();
  //       let tr = state.tr.insert(from, newParagraph);

  //       // Set the selection to the new paragraph
  //       const newPos = tr.mapping.map(from) + 1;
  //       tr = tr.setSelection(TextSelection.create(tr.doc, newPos));

  //       dispatch(tr.scrollIntoView());

  //       return true;
  //     },
  //   };
  // },

  addNodeView() {
    return (node, view, getPos, decorations) => new MarkdownView(node, view, getPos, decorations);
  },
});

export default MarkdownNode;
