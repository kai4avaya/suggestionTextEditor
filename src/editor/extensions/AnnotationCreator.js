import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const AnnotationExtension = Node.create({
  name: 'annotationCreator',

  group: 'block',

  addOptions() {
    return {
      annotations: [],
    };
  },

  addAttributes() {
    return {
      title: {
        default: 'Annotations',
      },
      text: {
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
        tag: 'annotation-creator',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['annotation-creator', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className = 'font-mono flex md:flex-row flex-col';
      // dom.style.userSelect = 'text!important';
      dom.setAttribute('tabindex', '-1'); // Allow text selection


      const leftPanel = document.createElement('div');
      leftPanel.className = 'flex-1 md:flex-[3] p-4';
      leftPanel.id = 'leftPanel';

      const rightPanel = document.createElement('div');
      rightPanel.className = 'flex-1 md:flex-[2] p-4';
      rightPanel.id = 'rightPanel';

      const h2 = document.createElement('h2');
      h2.className = 'text-xl font-bold mb-4 tracking-tighter text-gray-900 dark:text-white';
      h2.textContent = node.attrs.title;

      // Function to escape special characters in a string for use in a regex
      const escapeRegExp = (string) => {
        if (string)
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      };

      // Function to wrap text parts with special code blocks
      // const wrapTextWithCodeBlocks = (text, dataArray) => {
      //   dataArray.forEach(annotation => {
      //     const regex = new RegExp(escapeRegExp(annotation.highlight), 'g');
      //     text = text.replace(regex, `<code class="bg-gray-100 dark:bg-gray-700 text-red-500 p-1 rounded">${annotation.highlight}</code>`);
      //   });

      //   console.log("i am text", text)
      //   return text;
      // };

      const wrapTextWithCodeBlocks = (text, dataArray) => {
        // let originalText = text;  // Store the original text
    
      
        dataArray.forEach(annotation => {
          if (annotation.highlight && typeof annotation.highlight === 'string') {  // Check if highlight is valid
            const regex = new RegExp(escapeRegExp(annotation.highlight), 'g');
            text = text.replace(regex, `<code class="bg-gray-100 dark:bg-gray-700 text-red-500 p-1 rounded">${annotation.highlight}</code>`);
          } else {
            console.log('Invalid annotation highlight:', annotation.highlight);
            // text = originalText;  // Revert to original text if there's an issue
          }
        });

        if(!text){
          return text
        }
      
        // console.log("i am text", text);
        return text;
      };
      
      const ul = document.createElement('ul');
      ul.className = 'list-disc space-y-2 text-gray-600 dark:text-gray-400';

      let dataArray = [];
      try {
        dataArray = JSON.parse(node.attrs.annotations);
      } catch (error) {
        console.error("Error parsing JSON string:", error);
        return;
      }

      const p = document.createElement('p');
      p.className = 'mb-4 text-gray-900 dark:text-gray-300';
      p.innerHTML = wrapTextWithCodeBlocks(node.attrs.text, dataArray);
      p.setAttribute('draggable', 'false')
      p.setAttribute('tabindex', '-1'); // Allow text selection
      p.style.userSelect = 'text';
      // p.setAttribute('contenteditable', 'true'); // Set contenteditable to true


      dataArray.forEach((annotation, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${annotation.label}:</strong> ${annotation.description}`;
        li.dataset.annotationIndex = index;
        ul.appendChild(li);
      });

      leftPanel.appendChild(h2);
      leftPanel.appendChild(p);
      rightPanel.appendChild(ul);

      dom.appendChild(leftPanel);
      dom.appendChild(rightPanel);

      // // Ensure text selection is possible
        // Allow text selection within the node view
        dom.addEventListener('mousedown', (event) => {
          console.log("Mouse down! Allowing selection");
          event.stopPropagation(); // Prevent ProseMirror from handling this event
        });
  
        dom.addEventListener('mouseup', (event) => {
          console.log("Mouse up! Selection allowed");
          event.stopPropagation(); // Prevent ProseMirror from handling this event
        });

      // Add hover event listeners
      const codeBlocks = p.querySelectorAll('code');
      codeBlocks.forEach((codeBlock, index) => {
        codeBlock.addEventListener('mouseenter', () => {
          if (ul.querySelectorAll('li')[index])
            ul.querySelectorAll('li')[index].classList.add('bg-yellow-200');
        });
        codeBlock.addEventListener('mouseleave', () => {
          if (ul.querySelectorAll('li')[index])
            ul.querySelectorAll('li')[index].classList.remove('bg-yellow-200');
        });
      });

      ul.querySelectorAll('li').forEach((li, index) => {
        li.addEventListener('mouseenter', () => {
          if (codeBlocks[index])
            codeBlocks[index].classList.add('bg-yellow-200');
        });
        li.addEventListener('mouseleave', () => {
          if (codeBlocks[index])
            codeBlocks[index].classList.remove('bg-yellow-200');
        });
      });

      let lastSuccessfulAnnotations = node.attrs.annotations;

      return {
        dom,
        update: updatedNode => {
          if (updatedNode.attrs.text !== node.attrs.text) {
            h2.textContent = updatedNode.attrs.text;
            p.innerHTML = wrapTextWithCodeBlocks(updatedNode.attrs.text, dataArray);
          }
          if (updatedNode.attrs.annotations !== node.attrs.annotations) {
            ul.innerHTML = '';
            let dataArray;
            try {

              
              dataArray = JSON.parse(updatedNode.attrs.annotations);
              lastSuccessfulAnnotations = updatedNode.attrs.annotations; // Update the backup
              p.innerHTML = wrapTextWithCodeBlocks(updatedNode.attrs.text, dataArray);
            // p.setAttribute('contenteditable', 'true'); // Set contenteditable to true


              console.log("i am dataArray", dataArray)

              dataArray.forEach((annotation, index) => {
                if(annotation.label && annotation.description){
                const li = document.createElement('li');
                li.innerHTML = `<strong>${annotation.label}:</strong> ${annotation.description}`;
                li.dataset.annotationIndex = index;
                ul.appendChild(li);}
              });

              // Reapply hover event listeners
              const codeBlocks = p.querySelectorAll('code');
              codeBlocks.forEach((codeBlock, index) => {
                codeBlock.addEventListener('mouseenter', () => {
                  if (ul.querySelectorAll('li')[index])
                    ul.querySelectorAll('li')[index].classList.add('bg-yellow-200');
                });
                codeBlock.addEventListener('mouseleave', () => {
                  if (ul.querySelectorAll('li')[index])
                    ul.querySelectorAll('li')[index].classList.remove('bg-yellow-200');
                });
              });

              ul.querySelectorAll('li').forEach((li, index) => {
                li.addEventListener('mouseenter', () => {
                  if (codeBlocks[index])
                    codeBlocks[index].classList.add('bg-yellow-200');
                });
                li.addEventListener('mouseleave', () => {
                  if (codeBlocks[index])
                    codeBlocks[index].classList.remove('bg-yellow-200');
                });
              });
            } catch (error) {
              console.error("Error parsing JSON string in return:", error);
              dataArray = JSON.parse(lastSuccessfulAnnotations); // Use the backup
              p.innerHTML = wrapTextWithCodeBlocks(updatedNode.attrs.text, dataArray);

              dataArray.forEach((annotation, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${annotation.label}:</strong> ${annotation.description}`;
                li.dataset.annotationIndex = index;
                ul.appendChild(li);
              });

              // Reapply hover event listeners
              const codeBlocks = p.querySelectorAll('code');
              codeBlocks.forEach((codeBlock, index) => {
                codeBlock.addEventListener('mouseenter', () => {
                  if (ul.querySelectorAll('li')[index])
                    ul.querySelectorAll('li')[index].classList.add('bg-yellow-200');
                });
                codeBlock.addEventListener('mouseleave', () => {
                  if (ul.querySelectorAll('li')[index])
                    ul.querySelectorAll('li')[index].classList.remove('bg-yellow-200');
                });
              });

              ul.querySelectorAll('li').forEach((li, index) => {
                li.addEventListener('mouseenter', () => {
                  if (codeBlocks[index])
                    codeBlocks[index].classList.add('bg-yellow-200');
                });
                li.addEventListener('mouseleave', () => {
                  if (codeBlocks[index])
                    codeBlocks[index].classList.remove('bg-yellow-200');
                });
              });
            }
          }
          return true;
        },
      };
    };
  },

  addProseMirrorPlugins() {
    const self = this; // Capture the context of this extension

    return [
      new Plugin({
        key: new PluginKey('annotationPlugin'),
        state: {
          init(_, { doc }) {
            const decorations = self.options.annotations.map(({ from, to, label, description }) => {
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
            const decorations = self.options.annotations.map(({ from, to, label, description }) => {
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
