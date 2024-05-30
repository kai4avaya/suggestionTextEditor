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
    console.log("this.node", this.node)
    console.log("this.dom", this.dom)
    const content = md.render(this.node.HTMLAttributes['data-content']);
    this.contentDOM.innerHTML =content
    console.log("content", content)
    console.log("this.contentDOM", this.contentDOM)
    this.dom.innerHTML = content
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
    if (node.HTMLAttributes['data-content'] !== this.node.HTMLAttributes['data-content']) {
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
    console.log("i am set domContent", content)
    this.node.HTMLAttributes['data-content'] = content;
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
