// import { Editor } from '@tiptap/core';

import { EditorContent, Editor } from "@tiptap/vue-3";

import NodeView from "./editor/extensions/nodeViews/analyze_text.js";
import Analyze_text from "./editor/extensions/nodeViews/analyze_text2.js";

import Clicker from "./editor/extensions/nodeViews/counter.js";

import StarterKit from "@tiptap/starter-kit";
// import CharacterCount from '@tiptap/extension-character-count';
import Mention from "@tiptap/extension-mention";
import suggestion from "./editor/extensions/suggestions.js";
// import AutoComplete from './AutoComplete';  // Importing the AutoComplete extension
import Placeholder from "@tiptap/extension-placeholder";
import { AutocompleteExtension } from "./editor/extensions/AutoComplete.js"; // adjust the path as necessary
// import { commandsExtension } from "./editor/slashCommands/commands.js";
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
import DragAndDrop from './editor/extensions/DragDropImages.js';
import {TextStyle} from './editor/extensions/TextStyle.js';
import {DragAndDropPDF} from './editor/extensions/DragDropPDF.js';
import { PdfFormNode } from "./editor/extensions/nodeViews/pdfFormNode.js";
// import {CustomMarkdown} from './editor/extensions/MarkdownExtension.js'
// import { Markdown } from 'tiptap-markdown';
import MarkdownView from './editor/extensions/nodeViews/markdown_extension.js'
import  MarkdownNode  from './editor/extensions/MarkdownExtension2.js'
import SlashMenu from './editor/extensions/SlashMenu.js'
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
      Analyze_text,
      TextStyle,
      Clicker,
      Sortable_list,
      DragAndDrop,
      DragAndDropPDF,
      PdfFormNode,
      SlashMenu,
      MarkdownNode.extend({
        addNodeView() {
          return (node, view, getPos, decorations) => new MarkdownView(node, view, getPos, decorations);
        },
      }),
      // CustomMarkdown,
      // Markdown,
      // Highlight.configure({
      //   annotations: [
      //     { from: 5, to: 10, text: "Annotation 1" },
      //     { from: 15, to: 20, text: "Annotation 2" },
      //   ],
      // }),
      // AnnotationExtension,

      AnnotationCreator,
      
      // commandsExtension.configure({
      //   suggestion,
      //   // initiateSuggestions
      // }),
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
    
  <div data-type="markdown" data-content="# Hello World\n\nThis is a markdown example."># Hello World\n\nThis is a markdown example.</div>
  <form-node></form-node>
 
  <analyzeText>
  <p>This is editable.</p>
  </analyzeText>`
    ,
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
        style: "min-height: 100px; height: auto;", // Ensure it starts with a reasonable minimum height and can grow
      },
    },
    onCreate({ editor }) {
      console.log("Editor content (onCreate):", editor.getJSON());
      console.log("Editor schema:", editor.schema);
    },
  });

  suggestion.render(editor);
  
  editor.on("update", () => {

    // ADD INDEX, and quick scroll up, where it shows an outline refer to openai discuss as example
    // Update annotations when the editor content changes
    // const annotations = [
    //   { from: 5, to: 10, text: "Annotation 1" },
    //   { from: 15, to: 20, text: "Annotation 2" },
    // ];
    // editor.commands.setAnnotation(annotations);
    // const markdownOutput = editor.storage.markdown.getMarkdown();
    // console.log("markdownOutput", markdownOutput)
    console.log("editor.getJSON", editor.getJSON())

    
  });
    // Expose the editor globally for debugging purposes
    // window.editor = editor;
});
