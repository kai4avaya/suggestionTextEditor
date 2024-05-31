

import { Node, mergeAttributes } from '@tiptap/core';
import { jsonAgent } from '../../../agents/jsonAgent';
import {annotationSerializer, parseFirstValidJSON} from '../../editorUtils/annotationSerializer'

export default Node.create({
  name: 'formNode',

  group: 'block',

  atom: true, // This ensures that the node is treated as a single unit

  addAttributes() {
    return {
      // Any attributes you might want to save
    };
  },

  parseHTML() {
    return [
      {
        tag: 'form-node', // Ensure it matches the unique structure of your form
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['form-node', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      
      const dom = document.createElement('div');
      dom.classList.add("outer-container")
      const innerDom = document.createElement('div');
      dom.appendChild(innerDom)

      const heading = document.createElement('h3');
      heading.classList.add("node-heading")
      dom.setAttribute('data-type', 'form-node');
      // dom.setAttribute('contenteditable', 'true'); // Set contenteditable to true

      // dom.classList.add('w-7/8');
      innerDom.classList.add("node-container")

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

      // Prevent ProseMirror from handling input events inside the form
      form.addEventListener('keydown', (event) => {
        event.stopPropagation();
      });

      // Prevent ProseMirror from deselecting the input
      const handleFormEvent = (event) => {
        event.stopPropagation();
        return true;
      };

      form.addEventListener('mousedown', handleFormEvent);
      form.addEventListener('mouseup', handleFormEvent);
      form.addEventListener('click', handleFormEvent);

      let previousNodePosition = null;

      // Handle form submission
      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Extract text from input and textarea
        const queryText = input.value;
        const messageText = textarea.value;

        // Calculate the position right after the formNode
        const formNodePosition = getPos() + node.nodeSize;

        let count = 0;

        for await (const chunk of jsonAgent(messageText, queryText)) {
          let annotationNode = new TextDecoder("utf-8").decode(chunk);
          
          console.log("annotationNode", annotationNode)
          
            if (count === 0){
              annotationNode = annotationSerializer(annotationNode, messageText, queryText);
            }

            if (previousNodePosition !== null) {

              console.log("annotationNode", annotationNode)
              try{
                JSON.parse(annotationNode);

             
             

              // console.log("annotationNode", annotationNode)

              // Update the previously inserted node's attributes
              editor.commands.updateAttributes('annotationCreator', {
                text: messageText,// annotationNode.content[0].text,

                annotations: annotationNode //annotationNode.attrs.annotations,
              });
            }  catch(e){
              // return true;
              console.log("error JSON PARSE removing duplicates!", e)
              try{
               const removeDuplicates = parseFirstValidJSON(annotationNode)
                console.log("removeDuplicates", removeDuplicates)
               editor.commands.updateAttributes('annotationCreator', {
                text: messageText,// annotationNode.content[0].text,

                annotations: JSON.stringify(removeDuplicates) //annotationNode.attrs.annotations,
              });

              }
              catch (e){
                console.error("Error parsing  2nd time Repeating duplicates - JSON string:", e);
              }
            
            }

            } else {
              // Set the selection to the position right after the formNode
              editor.chain().setTextSelection(formNodePosition).focus().run();

              // Insert the content at the current cursor position
              editor.commands.insertContent(annotationNode);

              // Update the previous node position
              const { from } = editor.state.selection;
              previousNodePosition = from;
            }
          // } catch (error) {
          //   console.error("Error parsing JSON string:", error);
          // }
          count+=1
        }
    


        // Clear the form
        input.value = '';
        textarea.value = '';
      });


      return {
        dom,
        ignoreMutation: () => true,
        stopEvent: () => true,
        update: (updatedNode) => {
          // Update logic if needed
          return true;
        },
      };
    };
  },
});
