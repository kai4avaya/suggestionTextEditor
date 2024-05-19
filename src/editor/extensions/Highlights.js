// import { Highlight as DefaultHighlight } from '@tiptap/extension-highlight';
// import { Plugin, PluginKey } from 'prosemirror-state';
// import { Decoration, DecorationSet } from 'prosemirror-view';

// // Custom Highlight Extension
// const Highlight = DefaultHighlight.extend({
//   addOptions() {
//     return {
//       ...this.parent?.(),
//       annotations: [],
//     };
//   },
  
//   addProseMirrorPlugins() {
//     const { annotations } = this.options;
//     return [
//       new Plugin({
//         key: new PluginKey('highlightAnnotations'),
//         state: {
//           init(_, { doc }) {
//             const decorations = annotations.map(({ from, to, text }) => {
//               const decoration = Decoration.inline(from, to, { class: 'highlight' });
//               const annotationDecoration = Decoration.widget(to, () => {
//                 const div = document.createElement('div');
//                 div.className = 'annotation';
//                 div.contentEditable = true;
//                 div.textContent = text;
//                 return div;
//               });
//               return [decoration, annotationDecoration];
//             }).flat();
//             return DecorationSet.create(doc, decorations);
//           },
//           apply(tr, oldState, oldDoc, newDoc) {
//             if (!tr.docChanged) return oldState;
//             const decorations = annotations.map(({ from, to, text }) => {
//               const decoration = Decoration.inline(from, to, { class: 'highlight' });
//               const annotationDecoration = Decoration.widget(to, () => {
//                 const div = document.createElement('div');
//                 div.className = 'annotation';
//                 div.contentEditable = true;
//                 div.textContent = text;
//                 return div;
//               });
//               return [decoration, annotationDecoration];
//             }).flat();
//             return DecorationSet.create(newDoc, decorations);
//           },
//         },
        
//         props: {
//           decorations(state) {
//             return this.getState(state);
//           },
//         },
//       }),
//     ];
//   },
// });

// export default Highlight;

import { Highlight as DefaultHighlight } from '@tiptap/extension-highlight';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
let oldBottom = 0;
let oldBottomApply = 0
// Custom Highlight Extension
const Highlight = DefaultHighlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      annotations: [],
    };
  },
  
  addProseMirrorPlugins() {
    const { annotations } = this.options;
    return [
      new Plugin({
        key: new PluginKey('highlightAnnotations'),
        state: {
          init(_, { doc }) {
            const decorations = annotations.map(({ from, to, text }) => {
              const decoration = Decoration.inline(from, to, { class: 'highlight' });
              const annotationDecoration = Decoration.widget(to, (view, getPos) => {
                const div = document.createElement('div');
                div.className = 'annotation';
                div.contentEditable = true;
                div.textContent = text;
                
                
                // Calculate position to the right of the text
                const { bottom, left, right, top } = view.coordsAtPos(getPos());

                console.log("view.coordsAtPos", view.coordsAtPos(getPos()))
                div.style.top = `${top}px`;
                div.style.left = `${left + right + 2}px`; // Position 10px to the right
                oldBottom = top;
                console.log('bottom, left, right, top',bottom, left, right, top)
                return div;
              });
              return [decoration, annotationDecoration];
            }).flat();
            return DecorationSet.create(doc, decorations);
          },
          apply(tr, oldState, oldDoc, newDoc) {
            if (!tr.docChanged) return oldState;
            const decorations = annotations.map(({ from, to, text }) => {
              const decoration = Decoration.inline(from, to, { class: 'highlight' });
              const annotationDecoration = Decoration.widget(to, (view, getPos) => {
                const div = document.createElement('div');
                div.className = 'annotation';
                div.contentEditable = true;
                div.textContent = text;
                
                // Calculate position to the right of the text
                const { bottom, left, right, top } = view.coordsAtPos(getPos());

                div.style.top = `${top - oldBottomApply}px`;
                div.style.left = `${left + right + 2}px`; // Position 10px to the right
                oldBottomApply = top;
                return div;
              });
              return [decoration, annotationDecoration];
            }).flat();
            return DecorationSet.create(newDoc, decorations);
          },
        },
        
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

export default Highlight;
