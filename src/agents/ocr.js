import Tesseract from 'tesseract.js';

export function extractTextFromImage(imageSrc) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imageSrc,
      'eng',
      {
        logger: (m) => console.log(m), // Log progress
      }
    )
      .then(({ data: { text } }) => {
        resolve(text);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
