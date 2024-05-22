

async function scrapeTextFromUrl(url) {
  try {
    const response = await fetch(url);
    const body = await response.text();

    if (response.ok) {
      const $ = cheerio.load(body);
      // Remove script and style elements
      $('script, style').remove();
      // Get the text content
      const text = $('body').text().trim();
      return text;
    } else {
      throw new Error(`Failed to retrieve content, status code: ${response.status}`);
    }
  } catch (error) {
    return error.message;
  }
}

// // Example usage
// const url = "http://example.com";
// scrapeTextFromUrl(url).then(textContent => {
//   console.log(textContent);
// }).catch(error => {
//   console.error(error);
// });