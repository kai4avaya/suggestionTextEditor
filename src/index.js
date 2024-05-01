import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
// import CharacterCount from '@tiptap/extension-character-count';
import Mention from '@tiptap/extension-mention';
import suggestion from './suggestions.js';
// import AutoComplete from './AutoComplete';  // Importing the AutoComplete extension
import Placeholder from '@tiptap/extension-placeholder';
import { AutocompleteExtension } from './AutoComplete'; // adjust the path as necessary



// import Suggestion from '@tiptap/suggestion';

document.addEventListener('DOMContentLoaded', function () {
  const editor = new Editor({
    element: document.querySelector('#editor'),
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'You can type @ to bring up quick commands',
        // emptyNodeClass: 'is-empty', // This class will be toggled based on the cursor position and content
      }),
      AutocompleteExtension.configure({
        // You can pass any additional options if necessary
    }),
      // CharacterCount.configure({ limit: 280 }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
      }),

    ],
   
    content: ``,
  //   <p>
  //   What do you all think about the new <span data-type="mention" data-id="Winona Ryder"></span> movie?
  // </p>
  });

  suggestion.render(editor)

  editor.on('update', () => {
    // const characterCount = editor.getCharacterCount();
    // const limit = 280;
    // const percentage = Math.round((100 / limit) * characterCount);
    // document.getElementById('character-count').textContent = `${characterCount}/${limit} characters (${percentage}%)`;
  });

 // Example: Update suggestions dynamically based on some logic or API calls
//  editor.commands.updateSuggestions(['NewSuggestion1', 'NewSuggestion2']);


  // Monitor editor updates for cursor position and content
  editor.on('update', () => {
    // const doc = editor.state.doc;
    // // const firstNode = doc.content.firstChild;
    // const isStart = doc.textBetween(0, doc.content.size).trim() === '' && editor.state.selection.anchor === 1;

    // if (isStart) {
    //   document.querySelector('#editor').classList.add('is-empty');
    // } else {
    //   document.querySelector('#editor').classList.remove('is-empty');
    // }
  });

});
