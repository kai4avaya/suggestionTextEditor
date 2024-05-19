// import { Editor } from '@tiptap/core';

import { EditorContent, Editor } from "@tiptap/vue-3";

import NodeView from "./editor/extensions/nodeViews/analyze_text.js";
import Clicker from "./editor/extensions/nodeViews/counter.js";

import StarterKit from "@tiptap/starter-kit";
// import CharacterCount from '@tiptap/extension-character-count';
import Mention from "@tiptap/extension-mention";
import suggestion from "./editor/extensions/suggestions.js";
// import AutoComplete from './AutoComplete';  // Importing the AutoComplete extension
import Placeholder from "@tiptap/extension-placeholder";
import { AutocompleteExtension } from "./editor/extensions/AutoComplete.js"; // adjust the path as necessary
import { commandsExtension } from "./editor/slashCommands/commands.js";
// import initiateSuggestions from './slashCommands/initiateSuggestions.js'
// import DraggableItem from './nodeViews/draggables/DraggableItem.js'
import Sortable_list from "./editor/extensions/nodeViews/sortable_list.js";
// import Suggestion from '@tiptap/suggestion';
// import Annotation from "./Annotations.js";
// import { HighlightNode } from './Highlights.js';
// import highlightPlugin from './nodeViews/highlight_plugin.js';
// import Highlight from "./Highlights.js"; // Path to the custom Highlight extension
// import AnnotationExtension from './AnnotationExtension'; // Path to your custom extension
import AnnotationCreator from './editor/extensions/AnnotationCreator.js'; // Path to your custom extension

const sample = {
  lists: [
    {
      title: "List 1",
      items: ["Item 1", "Item 2", "Item 3"],
    },
    {
      title: "List 2",
      items: ["Item 4", "Item 5"],
    },
  ],
};

document.addEventListener("DOMContentLoaded", function () {
  const editor = new Editor({
    element: document.querySelector("#editor"),
    extensions: [
      StarterKit,
      NodeView,
      Clicker,
      Sortable_list,
      // Highlight.configure({
      //   annotations: [
      //     { from: 5, to: 10, text: "Annotation 1" },
      //     { from: 15, to: 20, text: "Annotation 2" },
      //   ],
      // }),
      // AnnotationExtension,

      AnnotationCreator,
      
      commandsExtension.configure({
        suggestion,
        // initiateSuggestions
      }),
      // Annotation,

      Placeholder.configure({
        placeholder: "Ask your query. Type @ or / to combine agents",
        // emptyNodeClass: 'is-empty', // This class will be toggled based on the cursor position and content
      }),
      AutocompleteExtension.configure({
        // You can pass any additional options if necessary
      }),
      // CharacterCount.configure({ limit: 280 }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },

        suggestion,
      }),
    ],

    content: `
  <form-node></form-node>
  <p>Drag around these items:</p>
  <node-list data-data='${JSON.stringify(sample)}'></node-list>
  <p>
      Round-trip coordsAtPos and posAtCoords
    </p>
  
    <p>
      Here is a paragraph that extends into multiple lines, and on lower lines we get accurate
      coords.
    </p>
    <p>Sample - another single line of text.</p>
    <annotation-creator title="Annotation Extension" text="On click, we call pmView.coordsAtPos({cursor.pos}) to get coordinates. Then, we immediately call pmView.posAtCoords(cursorCoords).pos to get back the position, doc.resolve(..) the position, and create a TextSelection from that position. Here is a paragraph that extends into multiple lines, and on lower lines we get accurate coords. Sample - another single line of text." annotations='${JSON.stringify([
      { label: 'coordsAtPos', highlight: "pmView.coordsAtPos({cursor.pos})", description: 'Retrieves the coordinates at the specified position.' },
      { label: 'posAtCoords', highlight: "pmView.posAtCoords(cursorCoords).pos", description: 'Finds the position at the given screen coordinates.' },
      { label: 'doc.resolve', highlight: "doc.resolve(..)", description: 'Resolves a position in the document, returning a detailed position description.' },
      { label: 'TextSelection', highlight:"TextSelection", description: 'A selection object specifically for text.' }
    ])}'></annotation-creator>
   `,
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
        style: "min-height: 100px; height: auto;", // Ensure it starts with a reasonable minimum height and can grow
      },
    },
  });

  suggestion.render(editor);
  editor.on("update", () => {
    // Update annotations when the editor content changes
    // const annotations = [
    //   { from: 5, to: 10, text: "Annotation 1" },
    //   { from: 15, to: 20, text: "Annotation 2" },
    // ];
    // editor.commands.setAnnotation(annotations);
  });
});
