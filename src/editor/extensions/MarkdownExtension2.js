import { Node, mergeAttributes } from '@tiptap/core';

const MarkdownNode = Node.create({
  name: 'markdown',

  group: 'block',

  content: 'text*',

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
});

export default MarkdownNode;
