import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const highlightPluginKey = new PluginKey('highlightPlugin');

const highlightPlugin = (highlightData) => new Plugin({
  key: highlightPluginKey,

  state: {
    init(_, { doc }) {
      const decorations = highlightData.highlights.map(({ from, to, annotation }) => {
        const decoration = Decoration.inline(from, to, { class: 'highlight' });
        const annotationDecoration = Decoration.widget(to, () => {
          const div = document.createElement('div');
          div.className = 'annotation';
          div.textContent = annotation;
          return div;
        });
        return [decoration, annotationDecoration];
      }).flat();
      return DecorationSet.create(doc, decorations);
    },
    apply(tr, oldState) {
      // Ensure decorations are reapplied after transactions
      if (tr.docChanged) {
        const decorations = highlightData.highlights.map(({ from, to, annotation }) => {
          const decoration = Decoration.inline(from, to, { class: 'highlight' });
          const annotationDecoration = Decoration.widget(to, () => {
            const div = document.createElement('div');
            div.className = 'annotation';
            div.textContent = annotation;
            return div;
          });
          return [decoration, annotationDecoration];
        }).flat();
        return DecorationSet.create(tr.doc, decorations);
      }
      return oldState.map(tr.mapping, tr.doc);
    },
  },

  props: {
    decorations(state) {
      return this.getState(state);
    },
  },
});

export default highlightPlugin;
