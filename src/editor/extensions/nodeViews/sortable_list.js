// import { mergeAttributes, Node } from '@tiptap/core'
// import Sortable from 'sortablejs';

// export default Node.create({
//   name: 'nodeList',

//   group: 'block',

//   atom: true,  // Treat this node as a leaf, meaning it does not contain other nodes


//   addAttributes() {
//     return {
//       data: {
//         default: null,
//         parseHTML: element => element.getAttribute('data-data'),
//         renderHTML: attributes => {
//           if (!attributes.data) {
//             return {};
//           }
//           return {
//             'data-data': attributes.data
//           };
//         },
//       },
//     };
//   },

//   parseHTML() {
//     return [
//       {
//         tag: 'node-list',
//       },
//     ];
//   },

// //   renderHTML() {
// //     return ['node-list', 0];  // Using 0 to indicate that this node does not have content managed by ProseMirror
// //   },
// renderHTML({ HTMLAttributes }) {
//     return ['node-list', mergeAttributes(HTMLAttributes)];
// }
// ,

//   addNodeView() {
//     return ({ node, editor, getPos }) => {
//       const container = document.createElement('node-list');
//       container.style.position = 'relative';
//       container.style.padding = '10px';
//       container.style.border = '1px solid blue';
//       container.style.margin = '5px';
//       container.style.borderRadius = '5px';
//       container.style.background = 'white';

//       // Create a sortable list inside the node view
//       const ul = document.createElement('ul');
//       container.appendChild(ul);
//      // Access data from node attributes
//      const data = node.attrs.data ? JSON.parse(node.attrs.data) : {};
      
//       // Adding some dummy items to the list
//       data.key.forEach((item, i) => {
//         const li = document.createElement('li');
//         li.textContent = item
//         ul.appendChild(li);
//       });


//       let nestedSortables = []
//       // Initialize SortableJS on the list
//       nestedSortables.push(new Sortable(ul, {
//         group: 'nested',
//         animation: 150,
//         fallbackOnBody: true,
//         swapThreshold: 0.65
//       }))

      

// // Loop through each nested sortable element
// for (var i = 0; i < nestedSortables.length; i++) {
// 	new Sortable(nestedSortables[i], {
// 		group: 'nested',
// 		animation: 150,
// 		fallbackOnBody: true,
// 		swapThreshold: 0.65
// 	});
// }


//       return {
//         dom: container,
//         update(updatedNode) {
//           return updatedNode.type === this.type;
//         },
//         destroy() {
//           sortable.destroy();
//         }
//       };
//     };
//   }
// });


import { Node, mergeAttributes } from '@tiptap/core';
import Sortable from 'sortablejs';

export default Node.create({
  name: 'nodeList',
  group: 'block',
  atom: true, // This node does not contain child nodes in the ProseMirror sense.

  addAttributes() {
    return {
      data: {
        default: null,
        parseHTML: element => element.getAttribute('data-data'),
        renderHTML: attributes => {
          return { 'data-data': attributes.data || '{}' };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'node-list' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['node-list', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node }) => {
      const container = document.createElement('div');
      container.class = 'w-7/8 p-3 m-8 border relative border-purple-300 dark:border-purple-600 rounded-lg'
    //   container.style.position = 'relative';
    //   container.style.padding = '10px';
    //   container.style.border = '1px solid blue';
    //   container.style.margin = '10px';
    //   container.style.borderRadius = '5px';
    //   container.style.background = 'white';
    //   p-3 m-4 border border-purple-300 dark:border-purple-600 rounded-lg' },
      // Deserialize data from JSON string
      const data = JSON.parse(node.attrs.data || '{"lists":[]}');

      // Create and append nested lists
      data.lists.forEach(list => {
        const listContainer = document.createElement('div');
        listContainer.textContent = list.title;
        listContainer.style.marginBottom = '10px';
        listContainer.style.padding = '10px';

        const ul = document.createElement('ul');
        list.items.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          li.className = 'cursor-grab bg-gray-100 hover:bg-gray-200 p-2 rounded-lg shadow mb-2';
          ul.appendChild(li);
        });

        // Initialize SortableJS on this list
        new Sortable(ul, {
          group: 'nested',
          animation: 150,
          fallbackOnBody: true,
          swapThreshold: 0.65
        });

        listContainer.appendChild(ul);
        container.appendChild(listContainer);
      });

      return {
        dom: container,
        update(updatedNode) {
          return updatedNode.type === this.type;
        },
        destroy() {
          // Cleanup if necessary, but SortableJS instances clean up with the DOM
        }
      };
    };
  }
});
