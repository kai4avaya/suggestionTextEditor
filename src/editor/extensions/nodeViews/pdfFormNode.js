import { Node } from '@tiptap/core';
import pdfIcon from '../../../../assets/pdf.png';


export const PdfFormNode = Node.create({
  name: 'pdfFormNode',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: pdfIcon,
      },
      title: {
        default: '',
      },
      href: {
        default: '',
      },
      filename: {
        default: '',
      },
      filesize: {
        default: '',
      },
      dateAccessed: {
        default: new Date().toLocaleString(),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="pdf-form-node"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'pdf-form-node' })];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'pdf-form-node');
      dom.classList.add('flex', 'flex-col', 'space-y-2', 'p-4', 'border', 'border-gray-300', 'rounded-lg');

      const info = document.createElement('div');
      info.classList.add('flex', 'flex-col', 'mb-2', 'font-mono', 'text-sm');

      const title = document.createElement('div');
      title.textContent = `Title: ${node.attrs.title || node.attrs.filename}`;
      info.appendChild(title);

      const filesize = document.createElement('div');
      filesize.textContent = `File Size: ${node.attrs.filesize}`;
      info.appendChild(filesize);

      const dateAccessed = document.createElement('div');
      dateAccessed.textContent = `Date Accessed: ${node.attrs.dateAccessed}`;
      info.appendChild(dateAccessed);

      dom.appendChild(info);

      const img = document.createElement('img');
      img.src = node.attrs.src || pdfIcon;
      img.style.width = '96px';
      img.style.height = '96px';
      img.classList.add('flex-shrink-0');
      dom.appendChild(img);

      const formContainer = document.createElement('div');
      formContainer.classList.add('form-container');

      const form = document.createElement('form');
      form.classList.add('flex', 'flex-col', 'space-y-2', 'flex-grow');

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'What is your query?';
      input.classList.add('p-2', 'border', 'border-gray-300', 'rounded', 'flex-grow');
      form.appendChild(input);

      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = 'Submit';
      button.classList.add('p-2', 'bg-blue-500', 'text-white', 'rounded', 'self-start');
      form.appendChild(button);

      form.onsubmit = (e) => {
        e.preventDefault();
        console.log(input.value);
        input.value = ''; // Clear the input after logging
      };

      // Prevent ProseMirror from handling events within the form
      form.addEventListener('mousedown', (e) => e.stopPropagation());
      form.addEventListener('mouseup', (e) => e.stopPropagation());
      form.addEventListener('click', (e) => e.stopPropagation());
      form.addEventListener('keydown', (e) => e.stopPropagation());

      formContainer.appendChild(form);
      dom.appendChild(formContainer);

      return {
        dom,
        stopEvent: () => true,
        contentDOM: formContainer, // Allow content editing outside of ProseMirror's control
        ignoreMutation: (mutation) => {
          // Ignore all mutations
          return true;
        },
      };
    };
  },
});
