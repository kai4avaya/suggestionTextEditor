import tippy from 'tippy.js';
import { initCommandsList, setEditor } from './commandsList.js';

export default function initiateSuggestions(editor, referenceElement) {
    // Set the editor instance in commandsList
    setEditor(editor);
    
    // Initialize commands list (make sure this function also renders the initial view)
    initCommandsList();

    // Assuming referenceElement is the element relative to which the tooltip should be positioned
    let popup = tippy(referenceElement, {
        content: document.querySelector('.items'), // Ensure this selector matches your commands list container
        placement: 'bottom-start',
        interactive: true,
        trigger: 'manual',
        hideOnClick: false,
        appendTo: () => document.body,
        onShow(instance) {
            console.log('Tooltip is shown');
        },
        onHide(instance) {
            console.log('Tooltip is hidden');
        }
    });

    // Handle keydown events for the whole document or specific element as needed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            popup.hide();
        }
    });

    return {
        show: () => popup.show(),
        hide: () => popup.hide(),
        update: () => {
            popup.setContent(document.querySelector('.items'));
            popup.update();
        }
    };
}
