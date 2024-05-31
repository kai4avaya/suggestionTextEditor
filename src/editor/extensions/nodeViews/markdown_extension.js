import markdownIt from 'markdown-it';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';

class MarkdownView {
  constructor(node, view, getPos, decorations) {
    this.node = node;
    this.view = view; // This should now be correctly passed
    this.getPos = getPos;
    this.decorations = decorations;

    this.parser = new DOMParser(); // Create a new DOMParser instance
    // const doc = parser.parseFromString(htmlString, 'text/html'); // Parse the string into an HTML document


    this.dom = document.createElement('div');
    this.contentDOM = document.createElement('div');
    this.dom.appendChild(this.contentDOM);
    this.dom.setAttribute('data-type', 'markdown');

    this.renderMarkdown();
  }

  renderMarkdown() {
    const md = markdownIt();
    console.log("this.node", this.node)
    console.log("this.dom", this.dom)
    console.log(" this.contentDOM ", this.contentDOM)
    if (this.node.HTMLAttributes['data-content']) {
      const content = md.render(this.node.HTMLAttributes['data-content']);

      console.log("content", content)
      this.contentDOM.innerHTML = content;
      this.dom.innerHTML = content;

      // Parse the content using the Tiptap editor schema
      const schema = this.node.editor.view.state.schema;

      // NEW
      const parser2 = ProseMirrorDOMParser.fromSchema(schema);
      const fragment = parser2.parseSlice(this.contentDOM).content;
      const markdownNode = schema.nodes.markdown.create({}, fragment);
      // const tr = this.view.state.tr.replaceWith(this.getPos(), this.getPos() + this.node.nodeSize, markdownNode);
      console.log("i am  this.node.node.content.size", this.node.node.content.size)
      
      const parser = ProseMirrorDOMParser.fromSchema(schema);
      const doc = parser.parse(this.contentDOM);
      const nodeSize =  this.node.node.content.size  //nodeSize ? this.node.nodeSize : this.node.content.size + 2; 
      // Calculate the end position of the node
      const nodeEnd = this.node.getPos() + nodeSize;
      // console.log("this.node.editor", nodeEnd, this.node.nodeSize)

      // const tr = this.node.editor.view.state.tr.replaceWith(0, this.node.editor.view.state.doc.content.size, doc);
      const tr = this.node.editor.view.state.tr.replaceWith(this.node.getPos(), nodeEnd, markdownNode);
      this.node.editor.view.dispatch(tr);
    }

    // Apply custom styles to headings
    this.applyCustomStyles();
  }

  applyCustomStyles() {
    const headings = this.contentDOM.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      heading.style.fontSize = 'initial';  // Or any specific size you want
      heading.style.fontWeight = 'initial';  // Or any specific weight you want
    });
  }

  update(node, decorations) {
    console.log("node", node)
    console.log("this.node", this.node)
    console.log("decorations", decorations)
    if(node.attrs['content'] && this.node.HTMLAttributes){
    if (node.attrs['content'] !== this.node.HTMLAttributes['data-content']) {
      this.node = node;
      this.renderMarkdown();
    }}
    return true;
  }
  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode');
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
  }

  setDomContent(content) {
    this.node.attrs['content'] = content;
    this.renderMarkdown();
  }

  stopEvent(event) {
    if (this.dom.contains(document.activeElement)) {
      if (event.key === 'Enter') {
        this.handleEnterKey(event);
        return true;
      }
      if (event.key === 'Backspace') {
        return false; // Allow Backspace key to propagate to the editor
      }
    }
    return false;
  }

  handleEnterKey(event) {
    event.preventDefault();
    const { state, dispatch } = this.view;
    const { $from, from } = state.selection;

    // Insert a new paragraph at the current position
    const newParagraph = state.schema.nodes.paragraph.create();
    let tr = state.tr.insert(from, newParagraph);

    // Set the selection to the new paragraph
    const newPos = tr.mapping.map(from) + 1;
    tr = tr.setSelection(TextSelection.create(tr.doc, newPos));

    dispatch(tr.scrollIntoView());
  }

  ignoreMutation() {
    return true;
  }
}

export default MarkdownView;
