// import './styles.css';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
// import CharacterCount from '@tiptap/extension-character-count';
import Mention from '@tiptap/extension-mention';
import suggestion from './suggestions.js';
import AutoComplete from './AutoComplete';  // Importing the AutoComplete extension


// import Suggestion from '@tiptap/suggestion';

document.addEventListener('DOMContentLoaded', function () {
  const editor = new Editor({
    element: document.querySelector('#editor'),
    extensions: [
      StarterKit,
      // CharacterCount.configure({ limit: 280 }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
      }),

      AutoComplete.configure({  // Add AutoComplete to the editor's extensions
        suggestions: ['Suggestion1', 'Suggestion2', 'Suggestion3'], // initial dummy data
      }),
    ],
   
    content: `
      <p>
        What do you all think about the new <span data-type="mention" data-id="Winona Ryder"></span> movie?
      </p>
    `,
  });

  suggestion.render(editor)

  editor.on('update', () => {
    // const characterCount = editor.getCharacterCount();
    // const limit = 280;
    // const percentage = Math.round((100 / limit) * characterCount);
    // document.getElementById('character-count').textContent = `${characterCount}/${limit} characters (${percentage}%)`;
  });

 // Example: Update suggestions dynamically based on some logic or API calls
 editor.commands.updateSuggestions(['NewSuggestion1', 'NewSuggestion2']);
});
