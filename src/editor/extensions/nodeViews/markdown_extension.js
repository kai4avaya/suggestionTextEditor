import markdownIt from 'markdown-it';

class MarkdownView {
  constructor(node, view, getPos, decorations) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.decorations = decorations;

    this.dom = document.createElement('div');
    this.contentDOM = document.createElement('div');
    this.dom.appendChild(this.contentDOM);
    this.dom.setAttribute('data-type', 'markdown');

    this.renderMarkdown();
  }

  renderMarkdown() {
    const md = markdownIt();
    console.log("node.attrs", this.node, this.node.attrs)
    this.contentDOM.innerHTML = md.render(this.node.HTMLAttributes['data-content']);
  }

  update(node, decorations) {
    console.log("node", node)
    console.log("this.node", this.node)
    if (node.attrs.content !== this.node.HTMLAttributes['data-content']) {
      this.node = node;
      this.renderMarkdown();
    }
    return true;
  }

  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode');
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
  }

  setDomContent(content) {
    this.node.attrs.content = content;
    this.renderMarkdown();
  }

  stopEvent() {
    return false;
  }

  ignoreMutation() {
    return true;
  }
}

export default MarkdownView;
