import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
// import { extractTextFromPDF } from './pdfUtils'; // Adjust the path as needed
import {extractTextFromPDF} from '../../agents/pdfExtractor';
import pdfIcon from '../../../assets/pdf.png';


export const DragAndDropPDF = Extension.create({
  name: 'dragAndDropPDF',

  addOptions() {
    return {
      uploadPDF: (file) => {
        // Implement your PDF upload logic here, this could be an API call.
        // For now, we'll return a resolved promise with a mock URL.
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop: (view, event, slice, moved) => {
            if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
              const file = event.dataTransfer.files[0];

              if (file.type === "application/pdf") {
                this.options.uploadPDF(file).then((pdfUrl) => {
                  extractTextFromPDF(file).then((text) => {
                    const { schema } = view.state;
                    const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

                    // Create a node for the PDF image with a link to the PDF
                    const node = schema.nodes.image.create({
                      src: pdfIcon, // Replace with your PDF icon path
                      title: text,
                      href: pdfUrl,
                    });

                    const transaction = view.state.tr.insert(coordinates.pos, node);
                    view.dispatch(transaction);
                  }).catch((error) => {
                    console.error("Error extracting text from PDF:", error);
                  });
                }).catch((error) => {
                  console.error("Error uploading PDF:", error);
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

export default DragAndDropPDF;
