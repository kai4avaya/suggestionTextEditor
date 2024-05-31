


export  function annotationSerializer(annotations, text, query) {
    // try{
    //     annotations = JSON.stringify(annotations)
    // } catch(e) {
    //     console.error("not a valid JSON string", e)
    //     annotations = []
    // }
    const escapedJsonString = annotations.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    // return `<annotation-creator title="${query} text="${text}" annotations='${JSON.stringify(annotations)}'></annotation-creator>`
    return `<annotation-creator title="${query}" text="${text}" annotations='${escapedJsonString}'></annotation-creator>`

}


export function parseFirstValidJSON(input) {
    // Regular expression to detect JSON boundaries
    const regex = /(\[.*?\])/g;
  
    // Extract potential JSON segments
    const potentialJSONs = input.match(regex);
  
    if (potentialJSONs) {
      // Check each segment for valid JSON
      for (const potentialJSON of potentialJSONs) {
        try {
          // Parse and return the first valid JSON
          const parsedJSON = JSON.parse(potentialJSON);
          return parsedJSON;
        } catch (e) {
          // If JSON.parse throws, continue to the next segment
          continue;
        }
      }
    }
  
    // If no valid JSON is found, return null or throw an error
    return null;
  }
  
  // Test the function with the provided input string
//   const input = '[{"label":"Meeting request declined","highlight":"Chief Justice John Roberts"}][{"label":"Meeting request declined","highlight":"Chief Justice John Roberts on"}][{"label":"Meeting request declined","highlight":"Chief Justice John Roberts on Thursday"}][{"label":"Meeting request declined","highlight":"Chief Justice John Roberts on Thursday declined"}]';
  
//   const result = parseFirstValidJSON(input);
//   console.log(result);
//   