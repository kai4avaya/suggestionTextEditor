import { Mark, markInputRule, mergeAttributes } from '@tiptap/core';

const Comment = Mark.create({
  name: 'comment',

  addAttributes() {
    return {
      data: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment'),
        renderHTML: attributes => {
          return { 'data-comment': attributes.data }
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-comment]',
        getAttrs: dom => dom.getAttribute('data-comment') != null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },

  addInputRules() {
    return [
      markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, this.type, match => ({ data: match[1] })),
    ];
  },

  addCommands() {
    return {
      setComment: attributes => ({ commands }) => {
        return commands.setMark('comment', attributes);
      },
      toggleComment: attributes => ({ commands }) => {
        return commands.toggleMark('comment', attributes);
      },
      unsetComment: () => ({ commands }) => {
        return commands.unsetMark('comment');
      },
    };
  },
});

export default Comment;
