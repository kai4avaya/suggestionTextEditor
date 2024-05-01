// import { Extension } from "@tiptap/core";
// import { Plugin } from "prosemirror-state";
// import { Decoration, DecorationSet } from "prosemirror-view";
// import { TextSelection } from "prosemirror-state";

// export default Extension.create({
// 	name: "AutocompleteExtension",

// 	addOptions() {
// 		return {
// 			className: "autocomplete-suggestion",
// 		};
// 	},

// 	addProseMirrorPlugins() {
// 		return [
// 			new Plugin({
// 				state: {
// 					init() {
// 						return DecorationSet.empty;
// 					},
// 					apply: (transaction) => {
// 						let decorationSet = DecorationSet.empty;

// 						const selection = transaction.selection;
// 						if (!(selection instanceof TextSelection)) {
// 							return decorationSet;
// 						}

// 						let textContent = this.storage.autosuggestion || "";

// 						if (textContent === "") {
// 							return decorationSet;
// 						}

// 						// This will add the widget decoration at the cursor position
// 						const cursorPos = selection.$head.pos;
// 						const nextNode = transaction.doc.nodeAt(cursorPos);

// 						if (!nextNode || nextNode.isBlock) {
// 							const suggestionDecoration = Decoration.widget(
// 								cursorPos,
// 								() => {
// 									const parentNode = document.createElement("span");

// 									// Create a span for the suggestion
// 									var c = '<span style="opacity: 40%;">' + textContent + "</span>";
// 									parentNode.innerHTML = c;
// 									parentNode.classList.add(this.options.className);

// 									return parentNode;
// 								},
// 								{ side: 1 },
// 							);

// 							decorationSet = decorationSet.add(transaction.doc, [suggestionDecoration]);
// 						}
// 						return decorationSet;
// 					},
// 				},
// 				props: {
// 					decorations(state) {
// 						return this.getState(state);
// 					},
// 				},
// 			}),
// 		];
// 	},
// });


// import { Extension } from "@tiptap/core";
// import { Plugin } from "prosemirror-state";
// import { Decoration, DecorationSet } from "prosemirror-view";

// export default Extension.create({
//     name: "autocomplete",

//     addOptions() {
//         return {
//             suggestions: [],
//             filter: "",
//             selectedIndex: 0,
//             className: "autocomplete-suggestion",
//         };
//     },

//     addProseMirrorPlugins() {
//         const extension = this; // Capture `this` to use in closures below.

//         function applyDecorations(tr, oldDecorations) {
//             // Using the extension options directly
//             const { filter, suggestions, className, selectedIndex } = extension.options;
//             let decorations = oldDecorations; // start with previous decorations
//             if (tr.docChanged || tr.selectionSet) {
//                 decorations = DecorationSet.empty; // reset decorations on change
//                 const cursorPos = tr.selection.$cursor ? tr.selection.$cursor.pos : null;
//                 if (cursorPos != null && filter) {
//                     suggestions.forEach((suggestion, index) => {
//                         const decoration = Decoration.widget(cursorPos, () => {
//                             const node = document.createElement("div");
//                             node.textContent = suggestion;
//                             node.style.opacity = index === selectedIndex ? "1" : "0.5";
//                             node.className = className;
//                             return node;
//                         }, { side: 1 });
//                         decorations = decorations.add(tr.doc, [decoration]);
//                     });
//                 }
//             }
//             return decorations;
//         }

//         function insertSuggestion(view) {
//             const { suggestions, selectedIndex } = extension.options;
//             if (suggestions.length > 0 && suggestions[selectedIndex]) {
//                 const suggestion = suggestions[selectedIndex];
//                 const transaction = view.state.tr.insertText(suggestion);
//                 view.dispatch(transaction);
//             }
//         }

//         return [
//             new Plugin({
//                 props: {
//                     decorations: (state) => {
//                         return state.decorations; // Retrieve decorations from the plugin state
//                     },
//                     handleKeyDown: (view, event) => {
//                         if (event.key === "Tab") {
//                             event.preventDefault();
//                             insertSuggestion(view);
//                             return true;
//                         }
//                         return false;
//                     },
//                 },

//                 state: {
//                     init: (_, { doc }) => {
//                         // Initialize with empty decorations
//                         return DecorationSet.empty;
//                     },
//                     apply: (tr, value) => {
//                         // Apply decorations based on the transaction
//                         return applyDecorations(tr, value);
//                     },
//                 },
//             }),
//         ];
//     }
// });


import { Extension } from "@tiptap/core";
import { Plugin, TextSelection } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export default Extension.create({
    name: "autocomplete",

    addOptions() {
        return {
            suggestions: [],
            filter: "",
            selectedIndex: 0,
            className: "autocomplete-suggestion",
        };
    },

    addProseMirrorPlugins() {
        const extension = this;

        function applyDecorations(tr, oldDecorations) {
            const { filter, suggestions, className, selectedIndex } = extension.options;
            let decorations = DecorationSet.empty;
            if (tr.docChanged || tr.selectionSet) {
                const cursorPos = tr.selection.$cursor ? tr.selection.$cursor.pos : null;
                if (cursorPos != null && filter) {
                    suggestions.forEach((suggestion, index) => {
                        const decoration = Decoration.widget(cursorPos, () => {
                            const node = document.createElement("div");
                            node.textContent = suggestion;
                            node.style.opacity = index === selectedIndex ? "1" : "0.5";
                            node.className = className;
                            return node;
                        }, { side: 1 });
                        decorations = decorations.add(tr.doc, [decoration]);
                    });
                }
            }
            return decorations;
        }

        return [
            new Plugin({
                props: {
                    decorations: state => applyDecorations(state.tr, state.decorations),
                    handleKeyDown: (view, event) => {
                        if (event.key === "Tab") {
                            event.preventDefault();
                            const { suggestions, selectedIndex } = extension.options;
                            if (suggestions.length > 0 && suggestions[selectedIndex]) {
                                const suggestion = suggestions[selectedIndex];
                                const transaction = view.state.tr.insertText(suggestion);
                                view.dispatch(transaction);
                            }
                            return true;
                        }
                        return false;
                    },
                },

                state: {
                    init: (_, { doc }) => {
                        return DecorationSet.empty;
                    },
                    apply: (tr, value) => {
                        return applyDecorations(tr, value);
                    },
                },
            }),
        ];
    },

    addCommands() {
        return {
            updateSuggestions: newSuggestions => ({ tr, dispatch }) => {
                this.options.suggestions = newSuggestions;
                return true;
            }
        };
    }
});
