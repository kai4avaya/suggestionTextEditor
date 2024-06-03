import { mergeAttributes, Node } from '@tiptap/core'

export default Node.create({
  name: 'analyzeText',

  group: 'block',
  content: '', // No child nodes allowed

  addAttributes() {
    return {
      query: {
        default: '',
      },
      text: {
        default: '',
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'analyzeText',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['analyzeText', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      // Markup
      /*
        <div class="node-view">
          <span class="label">Node view</span>

          <div class="content"></div>
        </div>
      */

      const dom = document.createElement('div')
      dom.classList.add("outer-container")
      const innerDom = document.createElement('div');
      dom.appendChild(innerDom)

      
      // const heading = document.createElement('h3');
      // heading.classList.add("node-heading")
      dom.setAttribute('data-type', 'form-node');

      innerDom.classList.add("node-container")
      // dom.classList.add('node-view')

      const label = document.createElement('span')

      label.classList.add('label')
      label.innerHTML = 'Analyze Text'
      label.contentEditable = false

      innerDom.appendChild(label)

      const content = document.createElement('div')

      content.classList.add('content')


      dom.append(content)

      
      const form = document.createElement('form');
      form.classList.add('p-3', 'm-4');

      const h2 = document.createElement('h2');
      h2.classList.add('text-lg', 'font-semibold', 'text-gray-700', 'mb-3');
      h2.textContent = 'Annotate and Highlight Text';

      const divInput = document.createElement('div');
      divInput.classList.add('mb-4');
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', 'What should I focus on in your text?');
      input.classList.add('node-border','input-query', 'w-full', 'p-2', 'border', 'border-black', 'dark:border-white', 'bg-white', 'dark:bg-zinc-700', 'dark:text-white');
      divInput.appendChild(input);

      const divTextarea = document.createElement('div');
      divTextarea.classList.add('mb-4');
      const textarea = document.createElement('textarea');
      textarea.setAttribute('placeholder', 'Input the text you want me to analyze');
      textarea.classList.add('node-border', 'resize-none', 'text-area-message', 'w-full', 'p-2', 'border', 'border-black', 'dark:border-white', 'h-24', 'bg-white', 'dark:bg-zinc-700', 'dark:text-white');
      divTextarea.appendChild(textarea);

      const divButton = document.createElement('div');
      const button = document.createElement('button');
      button.setAttribute('type', 'submit');
      button.classList.add('submit-button', 'node-button');
      button.textContent = 'Submit';
      divButton.appendChild(button);

      form.appendChild(h2);
      form.appendChild(divInput);
      form.appendChild(divTextarea);
      form.appendChild(divButton);

      innerDom.appendChild(form);

      input.addEventListener('mousedown', event => event.stopPropagation())
      input.addEventListener('keydown', event => event.stopPropagation())
      textarea.addEventListener('mousedown', event => event.stopPropagation())
      textarea.addEventListener('keydown', event => event.stopPropagation())
 
 
      // Debounce function to delay execution of input event handlers
 function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
// Flag to track first interaction
let isFirstInput = true;
let isFirstTextarea = true;

// Event listeners for input changes with debouncing
input.addEventListener(
  'input',
  debounce(() => {
    if (isFirstInput) {
      isFirstInput = false;
      return;
    }
    const transaction = editor.state.tr.setNodeMarkup(getPos(), undefined, {
      ...node.attrs,
      query: input.value,
    });
    editor.view.dispatch(transaction);
  }, 300)
);

textarea.addEventListener(
  'input',
  debounce(() => {
    if (isFirstTextarea) {
      isFirstTextarea = false;
      return;
    }
    const transaction = editor.state.tr.setNodeMarkup(getPos(), undefined, {
      ...node.attrs,
      text: textarea.value,
    });
    editor.view.dispatch(transaction);
  }, 300)
);


      
            // Set initial values from node attributes
            input.value = node.attrs.query || ''
            textarea.value = node.attrs.text || ''
      

      return {
        dom,
      }
    }
  },
})