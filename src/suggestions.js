import tippy from "tippy.js";
import { MentionList } from "./MentionList";
let editor;

window.addEventListener("keydown", (event) => {
  console.log("Global key press detected:", event.key);
}, true); // Using capture phase

function navigateItems(key) {
  const items = document.querySelectorAll(".items .item");
  const currentIndex = Array.from(items).findIndex((item) =>
    item.classList.contains("is-selected")
  );

  let nextIndex;
  if (key === "ArrowUp") {
    nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
  } else if (key === "ArrowDown") {
    nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
  }

  if (currentIndex !== -1) {
    items[currentIndex].classList.remove("is-selected");
  }
  items[nextIndex].classList.add("is-selected");

  // Optionally scroll into view if the popup is scrollable
  items[nextIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
}

const famousNames = [
  "Lea Thompson",
  "Cyndi Lauper",
  "Tom Cruise",
  "Madonna",
  "Jerry Hall",
  "Joan Collins",
  "Winona Ryder",
  "Christina Applegate",
  "Alyssa Milano",
  "Molly Ringwald",
  "Ally Sheedy",
  "Debbie Harry",
  "Olivia Newton-John",
  "Elton John",
  "Michael J. Fox",
  "Axl Rose",
  "Emilio Estevez",
  "Ralph Macchio",
  "Rob Lowe",
  "Jennifer Grey",
  "Mickey Rourke",
  "John Cusack",
  "Matthew Broderick",
  "Justine Bateman",
  "Lisa Bonet",
];

const items = ({ query }) => {
  return famousNames
    .filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, 5);

  // return famousNames.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
};

export default {
  items: items, // Referencing the function defined above

  render: (editor) => {
    let popup;
    let isSelecting = false; // Flag to indicate if a selection is being made

    const setupKeydownListener = () => {
      console.log("SETUP KEYDOWN LISTENER");
      document.addEventListener("keydown", handleKeyDown);
    };

    const removeKeydownListener = (e) => {
      console.log("REMOVE KEYDOWN LISTENER",);
      document.removeEventListener("keydown", handleKeyDown);
    };

    const handleKeyDown = (event) => {

      // if (event.key === "Escape" && popup) {
      //   popup[0].hide();
      //   return true;
      // }

      console.log("popup[0].state.isVisible", popup[0].state.isVisible);

      if (
        (event.key === "ArrowUp" || event.key === "ArrowDown") &&
        popup &&
        popup[0].state.isVisible
      ) {
        navigateItems(event.key); // Navigate through items on arrow press
        event.preventDefault(); // Prevent default to stop moving the cursor in the editor
        return true;
      }

      if (event.key === "Enter" && popup && popup[0].state.isVisible) {
        removeLastCharacter();
        const selectedItem = getCurrentSelectedItem();
        console.log("selectedItem", selectedItem);
        if (selectedItem) {
          console.log("ME press enter Wooo", selectItem);
          selectItem(selectedItem);
          popup[0].hide();
          event.preventDefault(); // Prevent default Enter key behavior, i.e., prevent adding a new line
          event.stopPropagation(); // Stop the event from bubbling up which prevents any other global handlers
          deleteAtIfNext() 
          return true;
        }
      }

      // Process alphanumeric characters only if the popup is visible and the query matches suggestion criteria
      if (
        /^[a-z0-9\s]$/i.test(event.key) &&
        popup &&
        popup[0].state.isVisible
      ) {
        const position = editor.state.selection.$from.pos;
        const textFromStartToCaret = editor.state.doc.textBetween(
          0,
          position,
          "\n"
        );
        const lastAtPos = textFromStartToCaret.lastIndexOf("@");

        if (lastAtPos !== -1) {
          const query =
            textFromStartToCaret.substring(lastAtPos + 1) + event.key; // include current key stroke in query
          updateSuggestions(query);
          event.preventDefault(); // This prevents the character from being entered into the editor.
          event.stopPropagation(); // This stops the event from propagating further.
          return true; // Stop further processing of this key event
        }
      }
    };



    function getCurrentSelectedItem() {
      return document.querySelector(".items .is-selected")?.textContent;
    }


    function removeLastCharacter() {
      const { state, dispatch } = editor.view;
      const { $from } = state.selection;
    
      // Ensure there is a character to remove
      if ($from.pos > 1) {
        // Create a transaction to delete the character right before the cursor
        let tr = state.tr.delete($from.pos - 1, $from.pos);
        dispatch(tr);
      }
    }

    function deleteAtIfNext() {
      const { state, dispatch } = editor.view;
      const { $from } = state.selection;
    
      console.log("i am AT")
      // Check if there is a character in front of the cursor and if it's '@'
      const nextCharPos = $from.pos;
      // if ($from.nodeAfter && $from.nodeAfter.textContent[nextCharPos - $from.start()] === '@') {
        console.log("bye bye AT")
        // Create a transaction to delete the '@' right after the cursor
        let tr = state.tr.delete(nextCharPos, nextCharPos + 1);
        dispatch(tr);
      // }
    }
    
    
    // Function to update the suggestions based on the input
    function updateSuggestions(inputChar) {
      // Update the current query with the new character

      console.log("inputChar", inputChar);
      // const currentQuery = document.querySelector('.query-input').textContent + inputChar;  // Adjust selector as necessary
      const itemsFiltered = items({ query: inputChar });

      console.log("itemsFiltered", itemsFiltered);

      const mentionListElement = MentionList(itemsFiltered, selectItem);
      if (popup) {
        popup[0].setContent(mentionListElement);
      } else {
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: mentionListElement,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "top-start",
          onShow: setupKeydownListener,
          // onHide: removeKeydownListener,
        });
      }
    }

    function getCurrentSelectedItem() {
      return document.querySelector(".items .is-selected")?.textContent;
    }

    function selectItem(item) {
      const index = famousNames.findIndex((name) => name === item);
      if (index !== -1) {
        const mentionItem = famousNames[index]; // Assume you need the full object or formatted text
        const range = editor.state.selection.$from.pos - 1;
        editor.commands.insertContentAt(
          range,
          `<span data-type="mention" data-id="${mentionItem}">${mentionItem}</span>`,
          {
            replace: 1,
          }
        );
      }
    }

    return {
      onStart: (props) => {
        editor = props.editor;

        if (!props.clientRect) {
          return;
        }

        const itemsFiltered = items({ query: props.query });
        if (itemsFiltered.length === 0) {
          return;
        }

        const mentionListElement = MentionList(
          itemsFiltered,
          (selectedItem) => {
            // Ensure the insertion replaces the trigger character
            // Use a transaction to replace the range of the mention trigger
            const range = props.range || editor.state.selection.$from.pos - 1;
            editor.commands.insertContentAt(
              range,
              {
                type: "mention",
                attrs: {
                  id: selectedItem.id,
                  label: selectedItem.id,
                },
              },
              {
                replace: 1,
              }
            );
          }
        );

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: mentionListElement,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "top-start",
          onShow: setupKeydownListener,
          onHide: () => {
            if (isSelecting) {
              isSelecting = false; // Reset the flag after handling
              return false; // Prevent hiding if selection is ongoing
            }
          },
          onHidden: () => {
            removeKeydownListener(); // Ensure keydown listener is removed when truly hidden
          }
        });
      },

      onUpdate: (props) => {
        if (!props.clientRect || !popup) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      // onExit: () => {
      //   console.log("i have been destroyed  :(");
      //   setTimeout(() => {
      //     if (popup) {
      //       popup[0].destroy();
      //       document.removeEventListener("keydown", handleKeyDown);
      //     }
      //   }, 500); // Delay in milliseconds, adjust as needed
      // },
      
    };
  },
};
