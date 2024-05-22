import markdownit from 'markdown-it';
import hljs from 'highlight.js';

export const createMarkdownRenderer = () => {
  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre><code class="hljs">' +
                 hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                 '</code></pre><button class="copy-button" onclick="copyToClipboard(this)">Copy</button>';
        } catch (__) {}
      }

      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre><button class="copy-button" onclick="copyToClipboard(this)">Copy</button>';
    }
  });

  // Add code to copy to clipboard
  const copyToClipboardScript = `
    <script>
      function copyToClipboard(button) {
        const codeBlock = button.previousElementSibling;
        const text = codeBlock.textContent || codeBlock.innerText;
        navigator.clipboard.writeText(text).then(function() {
          alert('Code copied to clipboard!');
        }, function(err) {
          alert('Failed to copy code to clipboard.');
        });
      }
    </script>
  `;

  // Render function that includes the copy to clipboard script
  const renderMarkdown = (markdownText) => {
    return md.render(markdownText) + copyToClipboardScript;
  };

  return renderMarkdown;
};

export default createMarkdownRenderer;
