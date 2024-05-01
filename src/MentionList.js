export function MentionList(items, command, editorView) {
    let selectedIndex = 0;

    const mentionListElement = document.createElement('div');
    mentionListElement.className = 'items';

    function updateList() {
        mentionListElement.innerHTML = '';
        if (items.length) {
            items.forEach((item, index) => {
                const button = document.createElement('button');
                button.className = `item ${index === selectedIndex ? 'is-selected' : ''}`;
                button.textContent = item;
                // button.addEventListener('click', () => selectItem(index));
                button.addEventListener('click', () => {
                    selectItem(index)
                    // command({ id: items[index] });
                    // Focus the editor
                    console.log("i am editorView", editorView)
                    
                    editorView.view.focus();
                });
                
                mentionListElement.appendChild(button);
            });
        } else {
            const noResult = document.createElement('div');
            noResult.className = 'item';
            noResult.textContent = 'No result';
            mentionListElement.appendChild(noResult);
        }
    }

    function selectItem(index) {
        if (items[index]) {
            command({ id: items[index] });
        }
    }

    function upHandler() {
        selectedIndex = (selectedIndex + items.length - 1) % items.length;
        updateList();
    }

    function downHandler() {
        selectedIndex = (selectedIndex + 1) % items.length;
        updateList();
    }

    function enterHandler() {
        selectItem(selectedIndex);
    }

    mentionListElement.addEventListener('keydown', event => {
        if (event.key === 'ArrowUp') {
            upHandler();
        } else if (event.key === 'ArrowDown') {
            downHandler();
        } else if (event.key === 'Enter') {
            enterHandler();
        }
    });

    updateList();
    return mentionListElement;
}
