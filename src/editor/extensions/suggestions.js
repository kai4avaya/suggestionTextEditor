import tippy from "tippy.js";
import { MentionList } from "./MentionList";
// let editor;
let begIndex;
let indexEndQuery = 0;
let dontClose = false; 

// function performEnterAction() {
//   console.log("Enter key pressed and popup is closed. Function called!");
//   // Add the actual function logic here
// }

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
  "Summarize",
  "Quiz me",
  "Explain this simply",
  "Examples that are simple",
  "Research Papers",
  "Quest Creation",
  "Outline a study plan",
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

    const setupKeydownListener = () => {
      document.addEventListener("keydown", handleKeyDown);
    };

    const removeKeydownListener = (e) => {
      document.removeEventListener("keydown", handleKeyDown);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        popup[0].hide();

        return true;
      }

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
        console.log("nerd Enter")
        removeLastCharacter();
        const selectedItem = getCurrentSelectedItem();
        if (selectedItem) {
          selectItem(selectedItem);
          // deleteNextChar()
          deleteNextChar();
          popup[0].hide();
          event.preventDefault(); // Prevent default Enter key behavior, i.e., prevent adding a new line
          event.stopPropagation(); // Stop the event from bubbling up which prevents any other global handlers
          return true;
        }
      }

      // if (event.key === ' ' && popup && popup[0].state.isVisible) {
      //   console.log("Space key pressed, popup text:", popup[0].popper.firstElementChild.innerText);
        
      //   // Check if popup should be hidden based on its content
      //   if(popup[0].popper.firstElementChild.innerText.includes("No Result")) {
      //     console.log("No result found - hiding popup.");
      //     popup[0].hide();
      //   } else {
      //     // event.preventDefault(); // Prevent any default spacebar actions (like button click)
      //     // event.stopPropagation(); // Stop the event from propagating further
      //   }
      
      //   return true; // Handle spacebar exclusively here when popup is visible
      // }
      

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

        const lastAtPos = getAtPos(); // textFromStartToCaret.lastIndexOf("@");


        if (lastAtPos !== -1) {
          const query =
            textFromStartToCaret.substring(lastAtPos + 1) + event.key; // include current key stroke in query
          indexEndQuery = query.length;

          updateSuggestions(query);
 
          return true; // Stop further processing of this key event
        }
      }
    };

    function getAtPos() {
      const position = editor.state.selection.$from.pos;

      const textFromStartToCaret = editor.state.doc.textBetween(
        0,
        position,
        "\n"
      );

      return textFromStartToCaret.lastIndexOf("@");
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

    function deleteNextChar() {
      const { state, dispatch } = editor.view;
      const { $from } = state.selection;

      const nextCharPos = $from.pos;

      // Create a transaction to delete the '@' right after the cursor
      let tr = state.tr.delete(nextCharPos, nextCharPos + 1);
      dispatch(tr);
      // }
    }

    // Function to update the suggestions based on the input
    function updateSuggestions(inputChar) {

      // const currentQuery = document.querySelector('.query-input').textContent + inputChar;  // Adjust selector as necessary
      const itemsFiltered = items({ query: inputChar });

      const mentionListElement = MentionList(itemsFiltered, selectItem, editor);

      if (popup) {
        try {
        popup[0].setContent(mentionListElement);
        }
        catch(e)
        {
          console.log(popup[0])
          popup[0].hide()
        }
        console.log("WE GOT THAT old popup")
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
          onHide: (instance) => {
          
          },

          onHidden: () => {
            removeKeydownListener(); // Ensure keydown listener is removed when truly hidden
          },
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
        const range = { from: begIndex - 1, to: begIndex - 1 + indexEndQuery };
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
        indexEndQuery = 0;

        editor = props.editor;

        begIndex = editor.state.selection.$from.pos;

        console.log("ME STARTING", props)
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
          },
          editor
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
          onHide: (instance) => {
          },
          onHidden: () => {
            removeKeydownListener(); // Ensure keydown listener is removed when truly hidden
          },
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

      onExit: () => {
        console.log("i have been destroyed  :(");
        setTimeout(() => {
          if (popup) {
            popup[0].destroy();
            document.removeEventListener("keydown", handleKeyDown);
          }
        }, 500); // Delay in milliseconds, adjust as needed
      },
    };
  },
};
