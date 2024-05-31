// Assuming 'editor' is globally accessible or passed to this script/module
let editor; // This should be set to your actual editor instance somewhere in your application initialization

const items = [
  { title: 'H1', command: () => editor.chain().focus().setNode('heading', { level: 1 }).run() },
  { title: 'H2', command: () => editor.chain().focus().setNode('heading', { level: 2 }).run() },
  { title: 'Bold', command: () => editor.chain().focus().toggleMark('bold').run() },
  { title: 'Italic', command: () => editor.chain().focus().toggleMark('italic').run() }
];
let selectedIndex = 0;


export function setEditor(ttEditor){
  editor = ttEditor;
}

export function initCommandsList(){
const itemsContainer = document.createElement('div');
itemsContainer.className = 'items';
document.body.appendChild(itemsContainer); // Append the container to the body or other element as needed

function renderItems() {
  itemsContainer.innerHTML = '';

  if (items.length === 0) {
    itemsContainer.innerHTML = '<div class="item">No result</div>';
  } else {
    items.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = 'item' + (index === selectedIndex ? ' is-selected' : '');
      button.textContent = item.title;
      button.onclick = () => {
        selectItem(index);
        if (tippyInstance) {
          tippyInstance.hide(); // Assuming you have a tippy instance from your tooltip code
        }
      };
      itemsContainer.appendChild(button);
    });
  }
}

function selectItem(index) {
  const item = items[index];
  item.command();
  console.log("Executed Command:", item.title);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    selectedIndex = (selectedIndex + items.length - 1) % items.length;
    renderItems();
    event.preventDefault();
  } else if (event.key === 'ArrowDown') {
    selectedIndex = (selectedIndex + 1) % items.length;
    renderItems();
    event.preventDefault();
  } else if (event.key === 'Enter') {
    selectItem(selectedIndex);
    event.preventDefault();
  }
});

renderItems();

}
