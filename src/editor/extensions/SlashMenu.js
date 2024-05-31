import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import tippy from 'tippy.js';

const menuItems = [
  { id: 'home', label: 'Home', action: () => alert('Home clicked') },
  { id: 'blog', label: 'Blog', action: () => alert('Blog clicked') },
  { id: 'team', label: 'Team', action: () => alert('Team clicked') },
  { id: 'references', label: 'References', action: () => alert('References clicked') },
  { id: 'contact', label: 'Contact Us', action: () => alert('Contact Us clicked') },
  { id: 'github', label: 'GitHub', action: () => alert('GitHub clicked') },
];

const SlashMenu = Extension.create({
  name: 'customMenu',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleTextInput(view, from, to, text) {
            if (text === '/') {
              const cursorPos = view.coordsAtPos(from + 1);
              openCustomMenu(view, cursorPos);
            } else {
              closeCustomMenu();
            }
            return false;
          }
        }
      }),
    ];
  },
});

let menuInstance = null;
let selectedIndex = -1;

function openCustomMenu(view, cursorPos) {
  closeCustomMenu();

  const menu = document.createElement('div');
  menu.className = 'custom-menu items';
  menu.innerHTML = menuItems.map(item => `<div class="menu-item" data-id="${item.id}">${item.label}</div>`).join('');

  document.body.appendChild(menu);

  document.querySelectorAll('.menu-item').forEach((item, index) => {
    item.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const menuItem = menuItems.find(item => item.id === id);
      if (menuItem && menuItem.action) {
        menuItem.action();
      }
      // Handle menu item action here
      closeCustomMenu();
    });
  });

  menuInstance = tippy('body', {
    content: menu,
    placement: 'bottom-start',
    interactive: true,
    trigger: 'manual',
    hideOnClick: false,
    appendTo: () => document.body,
    getReferenceClientRect: () => ({
      width: 0,
      height: 0,
      top: cursorPos.top,
      bottom: cursorPos.bottom,
      left: cursorPos.left,
      right: cursorPos.right,
    }),
  });

  menuInstance[0].show();

  // Add keydown event listener when the menu is opened
  document.addEventListener('keydown', handleKeyDown, true); // Use capture mode to handle the event before the editor
}

function closeCustomMenu() {
  if (menuInstance) {
    menuInstance[0].hide();
    menuInstance[0].destroy();
    menuInstance = null;
  }
  selectedIndex = -1;
  // Remove keydown event listener when the menu is closed
  document.removeEventListener('keydown', handleKeyDown, true); // Use capture mode to match the addition
}

function handleKeyDown(event) {
  const items = document.querySelectorAll('.menu-item');
  if (!items.length) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    event.stopPropagation(); // Prevent event from propagating to the editor
    selectedIndex = (selectedIndex + 1) % items.length;
    updateSelection(items);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    event.stopPropagation(); // Prevent event from propagating to the editor
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    updateSelection(items);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation(); // Prevent event from propagating to the editor
    if (selectedIndex >= 0 && selectedIndex < items.length) {
      items[selectedIndex].click();
    }
  } else if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation(); // Prevent event from propagating to the editor
    closeCustomMenu();
  }
}

function updateSelection(items) {
  items.forEach(item => item.classList.remove('selected'));
  if (selectedIndex >= 0 && selectedIndex < items.length) {
    items[selectedIndex].classList.add('selected');
  }
}

export default SlashMenu;
