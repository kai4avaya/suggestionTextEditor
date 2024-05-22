// import { Node } from '@tiptap/core';
// import pdfIcon from '../../../../assets/pdf.png';
// import { searchVectorizedText } from '../../../memory/memory.js';
// import {createMarkdownRenderer} from '../../../utils/markdown.js'
// import {query_agent} from '../../../agents/streamAgent.js'

// export const PdfFormNode = Node.create({
//   name: 'pdfFormNode',

//   group: 'block',

//   atom: true,

//   addAttributes() {
//     return {
//       src: {
//         default: pdfIcon,
//       },
//       title: {
//         default: '',
//       },
//       href: {
//         default: '',
//       },
//       filename: {
//         default: '',
//       },
//       filesize: {
//         default: '',
//       },
//       dateAccessed: {
//         default: new Date().toLocaleString(),
//       },
//       dbName: {
//         default: '',
//       },
//       vectorIndices: {
//         default: [],
//       },
//     };
//   },

//   parseHTML() {
//     return [
//       {
//         tag: 'div[data-type="pdf-form-node"]',
//       },
//     ];
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'pdf-form-node' })];
//   },

//   addNodeView() {
//     return ({ node }) => {
//       const dom = document.createElement('div');
//       dom.setAttribute('data-type', 'pdf-form-node');
//       dom.classList.add('flex', 'flex-col', 'space-y-2', 'p-4');
//       dom.style.border = '1px solid';
//       dom.style.boxShadow = '5px 10px';
//       dom.style.margin = '0 30px 30px';
//       dom.style.padding = '10px 15px 10px 10px';

//       const info = document.createElement('div');
//       info.classList.add('flex', 'flex-col', 'mb-2', 'font-mono', 'text-sm');

//       const title = document.createElement('div');
//       title.textContent = `Title: ${node.attrs.title || node.attrs.filename}`;
//       info.appendChild(title);

//       const filesize = document.createElement('div');
//       filesize.textContent = `File Size: ${node.attrs.filesize}`;
//       info.appendChild(filesize);

//       const dateAccessed = document.createElement('div');
//       dateAccessed.textContent = `Date Accessed: ${node.attrs.dateAccessed}`;
//       info.appendChild(dateAccessed);

//       dom.appendChild(info);

//       const img = document.createElement('img');
//       img.src = node.attrs.src || pdfIcon;
//       img.style.width = '96px';
//       img.style.height = '96px';
//       img.classList.add('flex-shrink-0');
//       dom.appendChild(img);

//       const formContainer = document.createElement('div');
//       formContainer.classList.add('form-container');

//       const form = document.createElement('form');
//       form.classList.add('flex', 'flex-col', 'space-y-2', 'flex-grow');

//       const inputContainer = document.createElement('div');
//       inputContainer.classList.add('flex', 'items-center', 'space-x-2');

//       const input = document.createElement('input');
//       input.type = 'text';
//       input.placeholder = 'What is your query?';
//       input.classList.add('p-2', 'border', 'border-gray-300', 'rounded', 'flex-grow');
//       inputContainer.appendChild(input);

//       // Create the spinner element
//       const spinner = document.createElement('div');
//       spinner.classList.add('spinner', 'hidden');
//       inputContainer.appendChild(spinner);

//       form.appendChild(inputContainer);

//       const buttonContainer = document.createElement('div');
//       buttonContainer.classList.add('flex', 'items-center', 'space-x-8');

//       const button = document.createElement('button');
//       button.type = 'submit';
//       button.textContent = 'Submit';
//       button.style.backgroundColor = '#fff';
//       button.style.border = '0.5px solid #000';
//       button.style.fontSize = '12px';
//       button.style.margin = '4px -6px 0 auto';
//       button.style.padding = '1px 2px';
//       buttonContainer.appendChild(button);

//       const toggleContainer = document.createElement('div');
//       toggleContainer.classList.add('flex', 'items-center', 'ml-2');

//       const toggleLabel = document.createElement('label');
//       toggleLabel.classList.add('flex', 'items-center', 'cursor-pointer');

//       const toggleInput = document.createElement('input');
//       toggleInput.type = 'checkbox';
//       toggleInput.classList.add('sr-only');

//       const toggleSpan = document.createElement('span');
//       toggleSpan.classList.add('toggle-switch');

//       toggleInput.addEventListener('change', () => {
//         toggleSpan.classList.toggle('checked');
//       });

//       toggleLabel.appendChild(toggleInput);
//       toggleLabel.appendChild(toggleSpan);
//       toggleContainer.appendChild(toggleLabel);
//       toggleContainer.appendChild(document.createTextNode(' Show Highlighted Text'));
//       buttonContainer.appendChild(toggleContainer);

//       form.appendChild(buttonContainer);

//       let isSubmitting = false;

//       form.onsubmit = async (e) => {
//         e.preventDefault();

//         if (isSubmitting || input.value === '') return;

//         isSubmitting = true;
//         spinner.classList.remove('hidden'); // Show the spinner

//         try {
//           const foundIndices = await searchVectorizedText(node.attrs.dbName, input.value, 5, "none");

//           if (foundIndices.length > 0) {
//             input.value = ''; // Clear the input after logging
//           }

//           let bigChunky = ''
//           for await (let chunk of query_agent(params, 'none')) {
//             bigChunky += chunk
//           const markdownChunk = createMarkdownRenderer(bigChunky)
//           console.log("markdownChunk     ", markdownChunk)
//           }
//           console.log("foundIndices", foundIndices);
//         } catch (error) {
//           console.error("Error during search:", error);
//         } finally {
//           spinner.classList.add('hidden'); // Hide the spinner
//           isSubmitting = false;
//         }
//       };

//       // Allow interactions with form elements by stopping ProseMirror event handling
//       function stopProseMirrorHandling(e) {
//         const toggleSwitch = formContainer.querySelector('.toggle-switch');
//         // Check if the event target is not the toggle switch or its children
//         if (!toggleSwitch.contains(e.target)) {
//           e.stopPropagation();
//         }
//       }

//       dom.addEventListener('mousedown', stopProseMirrorHandling);
//       dom.addEventListener('mouseup', stopProseMirrorHandling);
//       dom.addEventListener('click', stopProseMirrorHandling);
//       dom.addEventListener('keydown', stopProseMirrorHandling);

//       formContainer.appendChild(form);
//       dom.appendChild(formContainer);

//       // Add styles for the toggle switch and spinner
//       const style = document.createElement('style');
//       style.textContent = `
//         .toggle-switch {
//           width: 34px;
//           height: 14px;
//           background-color: #ccc;
//           border: 1px solid #000;
//           position: relative;
//           transition: background-color 0.3s;
//         }
//         .toggle-switch:before {
//           content: "";
//           position: absolute;
//           top: -1px;
//           left: -1px;
//           width: 16px;
//           height: 16px;
//           background-color: white;
//           border: 1px solid #000;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//           transition: left 0.3s;
//         }
//         .toggle-switch.checked {
//           background-color: #4caf50;
//         }
//         .toggle-switch.checked:before {
//           left: 17px;
//         }
//         .spinner {
//           border: 4px solid rgba(0, 0, 0, 0.1);
//           border-left-color: #000;
//           border-radius: 50%;
//           width: 20px;
//           height: 20px;
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         .hidden {
//           display: none;
//         }
//       `;
//       document.head.appendChild(style);

//       return {
//         dom,
//         stopEvent: () => true,
//         contentDOM: formContainer, // Allow content editing outside of ProseMirror's control
//         ignoreMutation: (mutation) => {
//           // Ignore all mutations
//           return true;
//         },
//       };
//     };
//   },
// });
import { Node } from '@tiptap/core';
import pdfIcon from '../../../../assets/pdf.png';
import { searchVectorizedText } from '../../../memory/memory.js';

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
      dbName: {
        default: '',
      },
      vectorIndices: {
        default: [],
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
      // Create the heading element
      const heading = document.createElement('h3');
      heading.textContent = 'PDF Analysis';
      heading.classList.add('heading');
      heading.classList.add('node-heading');

      

      // Create the main dom element
      const dom = document.createElement('div');
      const innerDom = document.createElement('div');
      dom.setAttribute('data-type', 'pdf-form-node');
      innerDom.classList.add('pdf-form-node-container');
      innerDom.classList.add('node-container');


      // Append the heading to the dom element
      dom.appendChild(heading);
      dom.appendChild(innerDom);

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

      innerDom.appendChild(info);

      const img = document.createElement('img');
      img.src = node.attrs.src || pdfIcon;
      img.style.width = '96px';
      img.style.height = '96px';
      img.classList.add('flex-shrink-0');
      innerDom.appendChild(img);

      const formContainer = document.createElement('div');
      formContainer.classList.add('form-container');

      const form = document.createElement('form');
      form.classList.add('flex', 'flex-col', 'space-y-2', 'flex-grow');

      const inputContainer = document.createElement('div');
      inputContainer.classList.add('flex', 'items-center', 'space-x-2');

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'What is your query?';
      input.classList.add('p-2', 'border', 'border-gray-300', 'rounded', 'flex-grow');
      inputContainer.appendChild(input);

      // Create the spinner element
      const spinner = document.createElement('div');
      spinner.classList.add('spinner', 'hidden');
      inputContainer.appendChild(spinner);

      form.appendChild(inputContainer);

      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('flex', 'items-center', 'space-x-8');

      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = 'Submit';
      button.classList.add('custom-button');
      button.classList.add('node-button');

      buttonContainer.appendChild(button);

      const toggleContainer = document.createElement('div');
      toggleContainer.classList.add('flex', 'items-center', 'ml-2');

      const toggleLabel = document.createElement('label');
      toggleLabel.classList.add('flex', 'items-center', 'cursor-pointer');

      const toggleInput = document.createElement('input');
      toggleInput.type = 'checkbox';
      toggleInput.classList.add('sr-only');

      const toggleSpan = document.createElement('span');
      toggleSpan.classList.add('toggle-switch');

      toggleInput.addEventListener('change', () => {
        toggleSpan.classList.toggle('checked');
      });

      toggleLabel.appendChild(toggleInput);
      toggleLabel.appendChild(toggleSpan);
      toggleContainer.appendChild(toggleLabel);
      toggleContainer.appendChild(document.createTextNode(' Show Highlighted Text'));
      buttonContainer.appendChild(toggleContainer);

      form.appendChild(buttonContainer);

      let isSubmitting = false;

      form.onsubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting || input.value === '') return;

        isSubmitting = true;
        spinner.classList.remove('hidden'); // Show the spinner

        try {
          const foundIndices = await searchVectorizedText(node.attrs.dbName, input.value, 5, "none");

          if (foundIndices.length > 0) {
            input.value = ''; // Clear the input after logging
          }
          console.log("foundIndices", foundIndices);
        } catch (error) {
          console.error("Error during search:", error);
        } finally {
          spinner.classList.add('hidden'); // Hide the spinner
          isSubmitting = false;
        }
      };

      // Allow interactions with form elements by stopping ProseMirror event handling
      function stopProseMirrorHandling(e) {
        const toggleSwitch = formContainer.querySelector('.toggle-switch');
        // Check if the event target is not the toggle switch or its children
        if (!toggleSwitch.contains(e.target)) {
          e.stopPropagation();
        }
      }

      dom.addEventListener('mousedown', stopProseMirrorHandling);
      dom.addEventListener('mouseup', stopProseMirrorHandling);
      dom.addEventListener('click', stopProseMirrorHandling);
      dom.addEventListener('keydown', stopProseMirrorHandling);

      formContainer.appendChild(form);
      innerDom.appendChild(formContainer);

      // Add styles for the toggle switch, spinner, and heading
      const style = document.createElement('style');
      style.textContent = `
        .toggle-switch {
          width: 34px;
          height: 14px;
          background-color: #ccc;
          border: 1px solid #000;
          position: relative;
          transition: background-color 0.3s;
        }
        .toggle-switch:before {
          content: "";
          position: absolute;
          top: -1px;
          left: -1px;
          width: 16px;
          height: 16px;
          background-color: white;
          border: 1px solid #000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: left 0.3s;
        }
        .toggle-switch.checked {
          background-color: #4caf50;
        }
        .toggle-switch.checked:before {
          left: 17px;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #000;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .hidden {
          display: none;
        }
      `;
      document.head.appendChild(style);

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
