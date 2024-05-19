<template>
    <div class="editor-container m-auto editor rounded-lg border border-zinc-300 bg-white">
      <div class="toolbar flex items-center border-b border-zinc-300 p-2">
        <select class="format-dropdown mr-2 rounded border bg-white p-1" v-model="format">
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <button class="tool-button mx-1" @click="execCmd('bold')"><b>B</b></button>
        <button class="tool-button mx-1" @click="execCmd('italic')"><i>I</i></button>
        <button class="tool-button mx-1" @click="execCmd('underline')"><u>U</u></button>
        <button class="tool-button mx-1" @click="execCmd('insertUnorderedList')">&#8226;</button>
        <button class="tool-button mx-1" @click="execCmd('insertOrderedList')">&#35;</button>
        <button class="tool-button mx-1" @click="execCmd('insertParagraph')">&lt;p&gt;</button>
      </div>
      <div ref="editor" id="editor" contenteditable="true" class="text-area h-40 p-3"></div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        format: 'p'  // Default paragraph format
      };
    },
    methods: {
      execCmd(command) {
        document.execCommand(command, false, null);
        this.$refs.editor.focus();
      }
    },
    watch: {
      format(newVal) {
        this.execCmd('formatBlock', newVal);
      }
    }
  }
  </script>
  
  <style scoped>
  .editor-container {
    display: flex;
    flex-direction: column;
    max-width: 600px;
  }
  .toolbar select, .toolbar button {
    cursor: pointer;
  }
  .text-area {
    min-height: 150px; /* Minimum height */
    overflow: hidden; /* Hides scrollbars */
    resize: none; /* Disables resizing */
  }
  .tiptap {
    padding: 2px;
    margin-top: -12px;
    margin-bottom: -12px;
  }
  .tiptap:focus {
    outline: none !important;
  }
  .items {
    padding: 0.2rem;
    position: relative;
    border-radius: 0.5rem;
    background: #FFF;
    color: rgba(0, 0, 0, 0.8);
    overflow: hidden;
    font-size: 0.9rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  }
  .item {
    display: block;
    margin: 0;
    width: 100%;
    text-align: left;
    background: transparent;
    border-radius: 0.4rem;
    border: 1px solid transparent;
    padding: 0.2rem 0.4rem;
  }
  .item:hover {
    background-color: lightgray;
  }
  .item.is-selected {
    border-color: #000;
  }
  .editor.is-empty:after {
    content: 'Type something here...';
    color: #adb5bd;
    position: absolute;
    top: 0;
    left: 0;
    padding: 4px;
    pointer-events: none;
  }
  .autocomplete-suggestion {
    color: rgba(150, 150, 150, 0.5);
    pointer-events: none;
    background-color: rgba(255, 255, 255, 0.1);
  }
  .tiptap p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  </style>
  