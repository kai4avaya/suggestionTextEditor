


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