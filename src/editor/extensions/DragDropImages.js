import { Extension } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import { Plugin } from 'prosemirror-state';
import {extractTextFromImage} from '../../agents/ocr.js';

const DragAndDrop = Extension.create({
  name: 'dragAndDrop',

  addOptions() {
    return {
      uploadImage: (file) => {
        // Implement your image upload logic here, this could be an API call.
        // For now, we'll return a resolved promise with a mock URL.
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      },
      uploadText: (file) => {
        // Implement your text upload logic here, this could be an API call.
        // For now, we'll return a resolved promise with the text content.
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsText(file);
        });
      },
    };
  },

  addExtensions() {
    return [Image];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop: (view, event, slice, moved) => {
            if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
              const file = event.dataTransfer.files[0];

         

            // if (file.type.startsWith('image/')) {
            //     this.options.uploadImage(file).then((src) => {
            //       const { schema } = view.state;
            //       const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            //       const node = schema.nodes.image.create({ src });
            //       const transaction = view.state.tr.insert(coordinates.pos, node);
            //       view.dispatch(transaction);

            //       // Extract text from the image using OCR
            //       extractTextFromImage(src).then((text) => {
            //         const textNode = schema.text(text);
            //         const textTransaction = view.state.tr.insert(coordinates.pos + 1, textNode);
            //         view.dispatch(textTransaction);
            //       }).catch((error) => {
            //         console.error("Error extracting text from image:", error);
            //       });
            //     }).catch((error) => {
            //       console.error("Error uploading image:", error);
            //     });
            //     return true; // handled
            //   }

            if (file.type.startsWith('image/')) {
                this.options.uploadImage(file).then((src) => {
                  const { schema } = view.state;
                  const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  const node = schema.nodes.image.create({ src });
                  const transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);

                  // Extract text from the image using OCR
                  extractTextFromImage(src).then((text) => {
                    const lines = text.split('\n');
                    let pos = coordinates.pos + 1;
                    lines.forEach((line) => {
                      if (line.trim()) {
                        const textNode = schema.nodes.paragraph.create(
                          {}, 
                          schema.text(line, [schema.marks.textStyle.create({ color: 'blue' })])
                        );
                        const textTransaction = view.state.tr.insert(pos, textNode);
                        view.dispatch(textTransaction);
                        pos += textNode.nodeSize;
                      }
                    });
                  }).catch((error) => {
                    console.error("Error extracting text from image:", error);
                  });
                }).catch((error) => {
                  console.error("Error uploading image:", error);
                });
                return true; // handled
              }


              if (file.type === "text/plain") {
                this.options.uploadText(file).then((text) => {
                  const { schema } = view.state;
                  const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  const node = schema.text(text);
                  const transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
                }).catch((error) => {
                  console.error("Error uploading text:", error);
                });
                return true; // handled
              }
            }
            return false; // not handled use default behaviour
          },
        },
      }),
    ];
  },
});

export default DragAndDrop;
