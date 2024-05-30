import { Markdown } from 'tiptap-markdown';
import markdownIt from 'markdown-it';

// Custom markdown-it rule to preserve custom HTML tags
function preserveHtmlTags(md) {
  const defaultRender = md.renderer.rules.html_block || ((tokens, idx, options, env, self) => {
    return self.renderToken(tokens, idx, options);
  });

  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const content = tokens[idx].content;
    if (content.startsWith('<annotation-creator') || content.startsWith('<form-node')) {
      return content; // Return the tag as is without parsing
    }
    return defaultRender(tokens, idx, options, env, self);
  };
}

// Custom Markdown extension
export const CustomMarkdown = Markdown.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      html: true,
      markdownParser: {
        configure: (parser) => {
          return parser.use(preserveHtmlTags);
        },
      },
    };
  },
});
