import { Node } from "@tiptap/core";
import pdfIcon from "../../../../assets/pdf.png";
import { searchVectorizedText } from "../../../memory/memory.js";
import { createMarkdownRenderer } from "../../../utils/markdown.js";
import { query_agent, query_agent_lang } from "../../../agents/streamAgent.js";
import { streamAgentPrompt } from "../../../../confgs/envConfigs.js";

export const PdfFormNode = Node.create({
  name: "pdfFormNode",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: pdfIcon,
      },
      title: {
        default: "",
      },
      href: {
        default: "",
      },
      filename: {
        default: "",
      },
      filesize: {
        default: "",
      },
      dateAccessed: {
        default: new Date().toLocaleString(),
      },
      dbName: {
        default: "",
      },
      vectorIndices: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="pdf-form-node"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "pdf-form-node" }),
    ];
  },

  addNodeView() {
    // return ({ node }) => {
      return ({ node, editor, getPos }) => {
      // Create the heading element
      const heading = document.createElement("h3");
      heading.textContent = "PDF Analysis";
      heading.classList.add("heading");
      heading.classList.add("node-heading");

      // Create the main dom element
      const dom = document.createElement("div");
      const innerDom = document.createElement("div");
      dom.setAttribute("data-type", "pdf-form-node");
      innerDom.classList.add("pdf-form-node-container");
      innerDom.classList.add("node-container");

      // Append the heading to the dom element
      dom.appendChild(heading);
      dom.appendChild(innerDom);

      const info = document.createElement("div");
      info.classList.add("flex", "flex-col", "mb-2", "font-mono", "text-sm");

      const title = document.createElement("div");
      title.textContent = `Title: ${node.attrs.title || node.attrs.filename}`;
      info.appendChild(title);

      const filesize = document.createElement("div");
      filesize.textContent = `File Size: ${node.attrs.filesize}`;
      info.appendChild(filesize);

      const dateAccessed = document.createElement("div");
      dateAccessed.textContent = `Date Accessed: ${node.attrs.dateAccessed}`;
      info.appendChild(dateAccessed);

      innerDom.appendChild(info);

      const img = document.createElement("img");
      img.src = node.attrs.src || pdfIcon;
      img.style.width = "96px";
      img.style.height = "96px";
      img.classList.add("flex-shrink-0");
      innerDom.appendChild(img);

      const formContainer = document.createElement("div");
      formContainer.classList.add("form-container");

      const form = document.createElement("form");
      form.classList.add("flex", "flex-col", "space-y-2", "flex-grow");

      const inputContainer = document.createElement("div");
      inputContainer.classList.add("flex", "items-center", "space-x-2");

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "What is your query?";
      input.classList.add(
        "node-border",
        "p-2",
        "border",
        "border-gray-300",
        "rounded",
        "flex-grow"
      );
      inputContainer.appendChild(input);

      // Create the spinner element
      const spinner = document.createElement("div");
      spinner.classList.add("spinner", "hidden");
      inputContainer.appendChild(spinner);

      form.appendChild(inputContainer);

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("flex", "items-center", "space-x-8");

      const button = document.createElement("button");
      button.type = "submit";
      button.textContent = "Submit";
      button.classList.add("custom-button");
      button.classList.add("node-button");

      buttonContainer.appendChild(button);

      const toggleContainer = document.createElement("div");
      toggleContainer.classList.add("flex", "items-center", "ml-2");

      const toggleLabel = document.createElement("label");
      toggleLabel.classList.add("flex", "items-center", "cursor-pointer");

      const toggleInput = document.createElement("input");
      toggleInput.type = "checkbox";
      toggleInput.classList.add("sr-only");

      const toggleSpan = document.createElement("span");
      toggleSpan.classList.add("toggle-switch");

      toggleInput.addEventListener("change", () => {
        toggleSpan.classList.toggle("checked");
      });

      toggleLabel.appendChild(toggleInput);
      toggleLabel.appendChild(toggleSpan);
      toggleContainer.appendChild(toggleLabel);
      toggleContainer.appendChild(
        document.createTextNode(" Show Highlighted Text")
      );
      buttonContainer.appendChild(toggleContainer);

      form.appendChild(buttonContainer);

      let isSubmitting = false;

      form.onsubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting || input.value === "") return;

        isSubmitting = true;
        spinner.classList.remove("hidden"); // Show the spinner

        try {
          const foundIndices = await searchVectorizedText(
            node.attrs.dbName,
            input.value,
            5,
            "none"
          );
          let currResp = "";
          const queryOfUser = input.value; // Store the user input
          input.value = ""; // Clear the input field after storing its value

          const texts = foundIndices.map((item) => item.object.text); // Assuming foundIndices is an array of items with 'object.text'
          const newPrompt = `${streamAgentPrompt} BACKGROUND: ${texts.join(
            "\n"
          )} \n QUERY: ${queryOfUser}`;
          const query = {
            prompt: newPrompt,
            model: "llama3-8b-8192",
            messages: [],
          };
          const renderMarkdown = createMarkdownRenderer();
          // let responseElementPosition;

        const responseStartPos = getPos() + node.nodeSize;
        let responseEndPos = responseStartPos;


          for await (const chunk of query_agent_lang(query, "none")) {
            currResp += chunk;

            // console.log("i am chunk!", chunk);

            const html = renderMarkdown(currResp);
            // console.log("foundIndices", html);

            console.log("i will delete", responseStartPos, responseEndPos);
  // Remove previous content if it exists
  if (responseStartPos !== responseEndPos) {
    editor.commands.deleteRange({
      from: responseStartPos,
      to: responseEndPos,
    });
  }

  // Insert new content and update the end position
  editor.chain().focus().insertContentAt(responseStartPos, html).run();
  responseEndPos = editor.state.selection.$anchor.pos //responseStartPos + html.length;

  console.log("responseEndPos", responseEndPos);
  // Update the end position considering the length of the inserted HTML
  const insertedNode = editor.view.state.doc.nodeAt(responseStartPos);
  // if (insertedNode) {
  //   responseEndPos = responseStartPos + insertedNode.nodeSize;
  // }
          }
        } catch (error) {
          console.error("Error during search:", error);
        } finally {
          spinner.classList.add("hidden"); // Hide the spinner
          isSubmitting = false;
        }
      };

      // Allow interactions with form elements by stopping ProseMirror event handling
      function stopProseMirrorHandling(e) {
        const toggleSwitch = formContainer.querySelector(".toggle-switch");
        // Check if the event target is not the toggle switch or its children
        if (!toggleSwitch.contains(e.target)) {
          e.stopPropagation();
        }
      }

      dom.addEventListener("mousedown", stopProseMirrorHandling);
      dom.addEventListener("mouseup", stopProseMirrorHandling);
      dom.addEventListener("click", stopProseMirrorHandling);
      dom.addEventListener("keydown", stopProseMirrorHandling);

      formContainer.appendChild(form);
      innerDom.appendChild(formContainer);

      // Add styles for the toggle switch, spinner, and heading
      const style = document.createElement("style");
      style.textContent = `
        .toggle-switch {
          width: 34px;
          height: 14px;
          background-color: #ccc;
          border: 1px solid #000;
          position: relative;
          transition: background-color 0.3s;
        }
        .toggle-switch:before {
          content: "";
          position: absolute;
          top: -1px;
          left: -1px;
          width: 16px;
          height: 16px;
          background-color: white;
          border: 1px solid #000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: left 0.3s;
        }
        .toggle-switch.checked {
          background-color: #4caf50;
        }
        .toggle-switch.checked:before {
          left: 17px;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #000;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .hidden {
          display: none;
        }
      `;
      document.head.appendChild(style);

      return {
        dom,
        stopEvent: () => true,
        contentDOM: formContainer, // Allow content editing outside of ProseMirror's control
        ignoreMutation: (mutation) => {
          // Ignore all mutations
          return true;
        },
      };
    };
  },
});
