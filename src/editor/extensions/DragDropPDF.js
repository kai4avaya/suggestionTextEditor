import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { extractTextFromPDF } from '../../agents/pdfExtractor';
import pdfIcon from '../../../assets/pdf.png';
import {initiateMemory, vectorizeText} from '../../memory/memory.js'

export const DragAndDropPDF = Extension.create({
  name: 'dragAndDropPDF',

  addOptions() {
    return {
      uploadPDF: (file) => {
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
          handleDrop:  (view, event, slice, moved) => {
            if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
              const file = event.dataTransfer.files[0];

              if (file.type === 'application/pdf') {
                const newData =  new Date().toLocaleString()
                this.options.uploadPDF(file).then((pdfUrl) => {
                  extractTextFromPDF(file).then(async (text) => {
                    const { schema } = view.state;
                    const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

                    const pdfName = `vectorDB_${file.name}_${newData}`

                    initiateMemory(pdfName);
                    const vectorIndices = await vectorizeText(pdfName, newData, "PDF", text, 'None');

                    const node = schema.nodes.pdfFormNode.create({
                        src: pdfIcon, // Use the uploaded PDF URL
                        title: file.name,
                        filesize: `${(file.size / 1024).toFixed(2)} KB`,
                        dateAccessed: newData, //new Date().toLocaleString(),
                        textPDF: text, 
                        dbName: pdfName,
                        vectorIndices: vectorIndices,
                      });

                      


                      

                    

                    const transaction = view.state.tr.insert(coordinates.pos, node);
                    view.dispatch(transaction);
                  }).catch((error) => {
                    console.error('Error extracting text from PDF:', error);
                  });
                }).catch((error) => {
                  console.error('Error uploading PDF:', error);
                });
                return true; // handled
              }
            }
            return false; // not handled, use default behaviour
          },
        },
      }),
    ];
  },
});

export default DragAndDropPDF;
