
import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const AnnotationExtension = Node.create({
  name: 'annotationExtension',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      annotations: [],
    };
  },

  addAttributes() {
    return {
      text: {
        default: '',
      },
      title: {
        default: '',
      },
      annotations: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'annotation-extension',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['annotation-extension', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className = 'bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg font-mono flex md:flex-row flex-col';

      const leftPanel = document.createElement('div');
      leftPanel.className = 'flex-1 md:flex-[3] p-4';
      leftPanel.id = 'leftPanel';

      const rightPanel = document.createElement('div');
      rightPanel.className = 'flex-1 md:flex-[2] p-4';
      rightPanel.id = 'rightPanel';

      const h2 = document.createElement('h2');
      h2.className = 'text-xl font-bold mb-4 tracking-tighter text-gray-900 dark:text-white';
      console.log("node.attrs.title", node.attrs.title, node.attrs.text, "node.attrs", node.attrs)
      h2.textContent = node.attrs.title;

      const p = document.createElement('p');
      p.className = 'mb-4 text-gray-900 dark:text-gray-300';
      p.innerHTML = `
        On click, we call
        <code class="bg-gray-100 dark:bg-gray-700 text-red-500 p-1 rounded">pmView.coordsAtPos({cursor.pos})</code>
        to get coordinates. Then, we immediately call
        <code class="bg-gray-100 dark:bg-gray-700 text-red-500 p-1 rounded">pmView.posAtCoords(cursorCoords).pos</code>
        to get back the position,
        <code class="bg-gray-100 dark:bg-gray-700 text-red-500 p-1 rounded">doc.resolve(..)</code> the
        position, and create a
        <code class="bg-gray-100 dark:bg-gray-700 text-red-500 p-1 rounded">TextSelection</code> from
        that position.
      `;

      const p2 = document.createElement('p');
      p2.className = 'mb-4 text-gray-900 dark:text-gray-300';
      p2.textContent = 'Here is a paragraph that extends into multiple lines, and on lower lines we get accurate coords.';

      const p3 = document.createElement('p');
      p3.className = 'text-gray-900 dark:text-gray-300';
      p3.textContent = 'Sample - another single line of text.';

      leftPanel.appendChild(h2);
      leftPanel.appendChild(p);
      leftPanel.appendChild(p2);
      leftPanel.appendChild(p3);

      const ul = document.createElement('ul');
      ul.className = 'list-disc space-y-2 text-gray-600 dark:text-gray-400';
      let dataArray;
try {
  dataArray = JSON.parse(node.attrs.annotations);
} catch (error) {
  console.error("Error parsing JSON string:", error);
}

      console.log("node", node.attrs.annotations)
      console.log( typeof node.attrs.annotations)
      dataArray.forEach(annotation => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${annotation.label}:</strong> ${annotation.description}`;
        ul.appendChild(li);
      });

      rightPanel.appendChild(ul);

      dom.appendChild(leftPanel);
      dom.appendChild(rightPanel);

      return {
        dom,
        update: updatedNode => {
          if (updatedNode.attrs.text !== node.attrs.text) {
            h2.textContent = updatedNode.attrs.text;
            p.textContent = updatedNode.attrs.text;
          }
          if (updatedNode.attrs.annotations !== node.attrs.annotations) {
            ul.innerHTML = '';
            updatedNode.attrs.annotations.forEach(annotation => {
              const li = document.createElement('li');
              li.innerHTML = `<strong>${annotation.label}:</strong> ${annotation.description}`;
              ul.appendChild(li);
            });
          }
          return true;
        },
      };
    };
  },

  addProseMirrorPlugins() {
    const self = this;

    return [
      new Plugin({
        key: new PluginKey('annotationPlugin'),
        state: {
          init(_, { doc }) {
            const { annotations } = self.options;
            const decorations = annotations.map(({ from, to, label, description }) => {
              const decoration = Decoration.inline(from, to, { class: 'highlight' });
              const annotationDecoration = Decoration.widget(to, () => {
                const div = document.createElement('div');
                div.className = 'annotation';
                div.textContent = description;
                div.style.position = 'absolute';
                div.style.backgroundColor = 'white';
                div.style.border = '1px solid black';
                div.style.padding = '5px';
                div.style.borderRadius = '5px';
                div.style.zIndex = '10';
                div.style.width = '100px';
                div.style.height = '100px';
                div.style.right = '0';
                return div;
              });
              return [decoration, annotationDecoration];
            }).flat();
            return DecorationSet.create(doc, decorations);
          },
          apply(tr, oldState, oldDoc, newDoc) {
            if (!tr.docChanged) return oldState;
            const { annotations } = self.options;
            const decorations = annotations.map(({ from, to, label, description }) => {
              const decoration = Decoration.inline(from, to, { class: 'highlight' });
              const annotationDecoration = Decoration.widget(to, () => {
                const div = document.createElement('div');
                div.className = 'annotation';
                div.textContent = description;
                div.style.position = 'absolute';
                div.style.backgroundColor = 'white';
                div.style.border = '1px solid black';
                div.style.padding = '5px';
                div.style.borderRadius = '5px';
                div.style.zIndex = '10';
                div.style.width = '100px';
                div.style.height = '100px';
                div.style.right = '0';
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

export default AnnotationExtension;
