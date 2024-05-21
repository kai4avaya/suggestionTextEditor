import { Mark } from '@tiptap/core';

export const TextStyle = Mark.create({
  name: 'textStyle',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, style: `color: ${HTMLAttributes.color}` }, 0];
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.style.color.replace(/ /g, ''),
        renderHTML: attributes => {
          if (!attributes.color) {
            return {};
          }
          return {
            style: `color: ${attributes.color}`,
          };
        },
      },
    };
  },
});
