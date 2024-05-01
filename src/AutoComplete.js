// import { Extension } from "@tiptap/core";
// import { Plugin, TextSelection } from "prosemirror-state";
// import { Decoration, DecorationSet } from "prosemirror-view";

// export default Extension.create({
//     name: "autocomplete",

//     addOptions() {
//         return {
//             suggestions: [],
//             className: "autocomplete-suggestion",
//         };
//     },

//     addProseMirrorPlugins() {
//         const extension = this;

//         function updateDecorations(tr, oldDecorations) {
//             const { suggestions } = extension.options;
//             let decorations = [];

//             if (tr.selection instanceof TextSelection && tr.selection.empty) {
//                 const { $cursor } = tr.selection;
//                 console.log("I am tr.selection", $cursor)
//                 if ($cursor) {
//                     const textBefore = $cursor.parent.textBetween(0, $cursor.parentOffset, null, '\ufffc');
//                     const words = textBefore.split(/\s/);
//                     const lastWord = words[words.length - 1];
//                     const matchedSuggestions = suggestions.filter(s => s.startsWith(lastWord));
//                     console.log("i am matchedSugg", matchedSuggestions)
//                     if (matchedSuggestions.length > 0) {
//                         const startPos = $cursor.pos;
//                         const endPos = startPos + matchedSuggestions[0].length - lastWord.length;
//                         decorations.push(Decoration.inline(startPos, endPos, {
//                             style: 'color: rgba(0, 0, 0, 0.4); pointer-events: none;'
//                         }));
//                     }
//                 }
//             }

//             return DecorationSet.create(tr.doc, decorations);
//         }

//         return [
//             new Plugin({
//                 state: {
//                     init(_, { doc }) {
//                         return DecorationSet.empty;
//                     },
//                     apply(tr, set) {
//                         return updateDecorations(tr, set);
//                     }
//                 },
//                 props: {
//                     decorations(state) {
//                         return this.getState(state);
//                     }
//                 },
//                 view() {
//                     return {
//                         update(view, prevState) {
//                             if (prevState.doc !== view.state.doc) {
//                                 view.updateState(view.state);
//                             }
//                         }
//                     };
//                 }
//             }),
//         ];
//     },

//     addCommands() {
//         return {
//             updateSuggestions: newSuggestions => ({ tr, dispatch }) => {
//                 this.options.suggestions = newSuggestions;
//                 return true;
//             }
//         };
//     }
// });

// import { Extension } from '@tiptap/core'
// import { Plugin, TextSelection } from 'prosemirror-state';
// import { Decoration, DecorationSet } from 'prosemirror-view';

// export const AutocompleteExtension = Extension.create({
//     name: 'AutocompleteExtension',

//     defaultOptions: {
//         className: 'autocomplete-suggestion',
//         delayBeforeShow: 800, // Delay to prevent suggestions from popping up too quickly
//     },

//     addProseMirrorPlugins() {
//         return [
//             new Plugin({
//                 state: {
//                     init() {
//                         return DecorationSet.empty;
//                     },
//                     apply: (transaction, oldSet) => {
//                         let decorationSet = DecorationSet.empty;

//                         const { selection } = transaction;
//                         if (!(selection instanceof TextSelection) || !selection.empty) {
//                             return decorationSet; // Only show suggestions for cursor positions, not selections
//                         }

//                         const cursorPos = selection.$head.pos;
//                         const nextNode = transaction.doc.nodeAt(cursorPos);

//                         if (!nextNode || nextNode.isBlock) {
//                             // Delay and decide text based on current input around the cursor
//                             const textContent = decideAutocompleteText(selection, this.options.delayBeforeShow);

//                             // Only proceed if there's a suggestion to show
//                             if (textContent) {
//                                 console.log("textContent", textContent, "this.options.className", this.options.className)
//                                 const widgetDecoration = Decoration.widget(cursorPos, () => {
//                                     const parentNode = document.createElement('span');
//                                     parentNode.innerHTML = `<span class="${this.options.className}">${textContent}</span>`;
//                                     return parentNode;
//                                 }, { side: 1 }); // Use side: -1 if you want the widget to appear before the cursor

//                                 decorationSet = decorationSet.add(transaction.doc, [widgetDecoration]);
//                             }
//                         }
//                         return decorationSet;
//                     }
//                 },
//                 props: {
//                     decorations(state) {
//                         return this.getState(state);
//                     },
//                 },
//             }),
//         ];
//     },
// });


// function decideAutocompleteText(selection) {
//     const phrases = [
//         "what does this mean...",
//         "Summarize this text...",
//         "Explain this in a simpler way..."
//     ];

//     const { $cursor } = selection;
//     if (!$cursor) return null;

//     const textBefore = $cursor.parent.textBetween(0, $cursor.parentOffset, null, '\ufffc');
//     const lastWord = textBefore.split(/\s/).slice(-1)[0];
//     return phrases.find(phrase => phrase.toLowerCase().startsWith(lastWord.toLowerCase()));
// }
import { Extension } from '@tiptap/core';
import { Plugin, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
let textContent;
let remainingText;

export const AutocompleteExtension = Extension.create({
    name: 'AutocompleteExtension',

    defaultOptions: {
        className: 'autocomplete-suggestion',
        phrases: [
            "what does this mean...",
            "Summarize this text...",
            "Explain this in a simpler way..."
        ],
        timeSinceLastInteraction: {
            cursorMoved: 0, // Initialize timeSinceLastInteraction with a default value
        },
        textBuffer: '', // To store the last few characters typed
        bufferLength: 3, // Number of characters to consider for suggestions
        bufferTimer: null,
    },
    

    addProseMirrorPlugins() {
        const extension = this;

        // function decideAutocompleteText(selection) {
        //     const { $cursor } = selection;

        //     console.log("$cursor", $cursor)
        //     if (!$cursor) return null;

        //     const { timeSinceLastInteraction } = extension.options;
        //     const { cursorMoved } = timeSinceLastInteraction;

        //     console.log("timeSinceLastInteraction",timeSinceLastInteraction);
        //     console.log("cursorMoved", cursorMoved)

        //     const textBefore = $cursor.parent.textBetween(0, $cursor.parentOffset, null, '\ufffc');
        //     const lastWord = textBefore.split(/\s/).slice(-1)[0];
            
        //     // Check if cursor moved within a certain time threshold
        //     if (Date.now() - cursorMoved < 1000) {
        //         return extension.options.phrases.find(phrase => phrase.toLowerCase().startsWith(lastWord.toLowerCase()));
        //     } else {
        //         // Reset the timeSinceLastInteraction if it's been too long
        //         extension.options.timeSinceLastInteraction.cursorMoved = 0;
        //         return null;
        //     }
        // }
        function decideAutocompleteText(selection) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            const { $cursor } = selection;
            if (!$cursor) return null;  // No cursor, no suggestions needed.
        
            const extensionOptions = extension.options;
        
            console.log("cursor", $cursor);
            console.log("extensionOptions", extensionOptions);
        
            const { textBuffer, bufferLength, bufferTimer } = extensionOptions;
            
            const textBefore = $cursor.parent.textBetween(0, $cursor.parentOffset, null, '\ufffc');
            console.log("textBefore", textBefore);
        
            // Determine what the new buffer should be
            let newTextBuffer = textBefore.slice(-bufferLength); // Get the last 'bufferLength' characters
            console.log("newTextBuffer", newTextBuffer);
        
            // Check if the buffer needs updating (if the text has changed)
            if (newTextBuffer !== textBuffer) {
                extensionOptions.textBuffer = newTextBuffer;
                // Reset the timer every time the buffer is updated
                clearTimeout(bufferTimer);
                extensionOptions.bufferTimer = setTimeout(() => {
                    extensionOptions.textBuffer = ""; // Clear buffer after inactivity
                    console.log("Buffer cleared due to inactivity");
                }, 1000); // Resets after 1 second of inactivity
            }
        
            // Find the first suggestion that starts with the buffer's content (case insensitive)
            if (extensionOptions.textBuffer.length > 0) {
                return extensionOptions.phrases.find(phrase => phrase.toLowerCase().startsWith(extensionOptions.textBuffer.toLowerCase()));
            }
        
            return null; // No recent typing, no suggestions.
        }
        
        
        return [
            new Plugin({
                state: {
                    init() {
                        return DecorationSet.empty;
                    },
                    apply: (transaction, oldSet) => {

                        let decorationSet = DecorationSet.empty;
                        const { selection } = transaction;

                        if (transaction.selectionSet || transaction.docChanged) {
                            extension.options.timeSinceLastInteraction.cursorMoved = Date.now();
                        }


                        if (!(selection instanceof TextSelection) || !selection.empty) {
                            return decorationSet; // Only show suggestions for cursor positions, not selections
                        }

                        const cursorPos = selection.$head.pos;
                        textContent = decideAutocompleteText(selection);


                        if (textContent) {
                            // const textBefore = selection.$head.parent.textBetween(0, selection.$head.parentOffset, null, '\ufffc');
                            // const startPos = cursorPos - textBefore.length;
                            // const endPos = startPos + textContent.length;
           

                            // let startPos = cursorPos

                            // console.log("startPos",startPos)
                            // console.log("endPos", endPos)

                            const nextNode = transaction.doc.nodeAt(cursorPos)
                            if (!nextNode || nextNode.isBlock) {
                                        const helloWorldDecoration = Decoration.widget(cursorPos, () => {

                                            const parentNode = document.createElement('span')
                                            remainingText = textContent.slice(extension.options.textBuffer.length);

                                            console.log("i am remainingText", remainingText)
                                            // let textContent = decideAutocompleteText(selection, this.options.delayBeforeShow)
                                            // Create a span for the suggestion
                                            // const c = `<span class="">${remainingText}</span>`
                                            const c = `<span class="">${remainingText} <div style="display: inline-block; margin-left: 10px; padding: 2px 8px; font-size: 10px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer;">Tab</div></span>`
// textContent = remainingText.replace(/\[(.*?)\]/g, c);
                                            parentNode.innerHTML = c
                                            parentNode.classList.add(this.options.className)
            
                                            return parentNode
            
                                        }, { side: 1 })
            
                                        decorationSet = decorationSet.add(transaction.doc, [helloWorldDecoration])
                            }
                            // const widgetDecoration = Decoration.widget(startPos, () => {
                            //     const parentNode = document.createElement('span');
                            //     parentNode.innerHTML = `<span class="${extension.options.className}">${textContent.slice(textBefore.length)}</span>`;
                            //     return parentNode;
                            // }, { side: 1 });

                            // decorationSet = decorationSet.add(transaction.doc, [widgetDecoration]);


                        }

                        return decorationSet;
                    }
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                    handleKeyDown: (view, event) => {
                        if (event.key === "Tab" && view.state.selection.empty) {
                            const { $cursor } = view.state.selection;

                            if ($cursor) {
                                // textContent = decideAutocompleteText(view.state.selection);

                                if (textContent) {
                                    event.preventDefault();
                                    // const insertText = textContent.slice(textBefore.length);
                                    // const remainingText = textContent.slice(extension.options.textBuffer.length);

                                    // console.log("insertText", insertText)
                
                                    // Ensure to insert only the remaining part of the suggestion not yet typed
                                    if (remainingText.length > 0) {
                                        const transaction = view.state.tr.insertText(remainingText, $cursor.pos);
                                        view.dispatch(transaction);
                                    }
                                    remainingText = ''
                                    textContent = ''
                                    return true; // Return true to indicate that the event was handled
                                   
                                }
                            }
                        }
                        return false; // Return false to let other key handlers execute
                    },
                },
                
            }),
        ];
    },
});


// function decideAutocompleteText(selection, phrases) {
//     const { $cursor } = selection;
//     if (!$cursor) return null;

//     const textBefore = $cursor.parent.textBetween(0, $cursor.parentOffset, null, '\ufffc');
//     const lastWord = textBefore.split(/\s/).slice(-1)[0];
//     return phrases.find(phrase => phrase.toLowerCase().startsWith(lastWord.toLowerCase()));
// }
