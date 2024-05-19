


export  function annotationSerializer(annotations, text, query) {
    // return `<annotation-creator title="${query} text="${text}" annotations='${JSON.stringify(annotations)}'></annotation-creator>`
    return `<annotation-creator title="${query} text="${text}" annotations='${annotations}'></annotation-creator>`

}