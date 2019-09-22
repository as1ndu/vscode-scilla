export function ScillaCode(rawScillaCode: string) {
    // Identify locations of all comments
    var ScillaTokensWithComments = new Array
    var commentLocations = new Array
    var ScillaTokensWithComments = ScillaTokensWithComments.concat(rawScillaCode.match(/\S+/g));


    // Extract all comments from file
    var commentTokens = new Array();
    var comments = commentTokens.concat(rawScillaCode.match(/([\(\*].*(?:\*\)))/g));

    var scillaCodeTokens = new Array();
    var endLocations = new Array();
    //var withLocations = new Array();
    var matchLocations = new Array();
    var transitionWithLocations = new Array();
    var indentBraces = new Array();
    //var cindentBraces = new Array();

    rawScillaCode = rawScillaCode.replace(/([\(\*].*(?:\*\)))/g, "scilla-comment-placeholder")

    var scillaCode = scillaCodeTokens.concat(rawScillaCode.match(/\S+/g));

    for (let index = 0; index < scillaCode.length; index++) {

        // add new lines 
        switch (scillaCode[index]) {
            case 'scilla_version':  // scilla version
                scillaCode[index] = "scilla_version "
                break;

            case 'let':  // let statement
                scillaCode[index] = "\nlet "
                break;

            case 'fun':  // function statement
                scillaCode[index] = "\n\tfun "
                break;

            case 'field':  // field declaration
                scillaCode[index] = "\nfield "
                break;

            case 'transition':  // transition   
                scillaCode[index] = "\ntransition "
                let tspan = index + 1
                while (scillaCode[tspan].indexOf(')') == -1) {
                    tspan++
                }
                if (scillaCode[tspan].indexOf(')') !== -1) {
                    transitionWithLocations.push(tspan)
                    scillaCode[tspan + 1] = "\n" + scillaCode[tspan + 1]
                }
                break;

            case 'match':  // match
                matchLocations.push(index)
                scillaCode[index] = "\nmatch "
                break;

            case 'with':  // with
                transitionWithLocations.push(index)
                let wspan = index + 1
                scillaCode[wspan] = "\n" + scillaCode[wspan]
                break;

            case 'end':  // end
                endLocations.push(index)
                scillaCode[index] = "\nend\n"
                break;

            case 'event':  // event
                scillaCode[index] = "\nevent "
                break;

            case 'contract':  // match
                scillaCode[index] = "\n\ncontract "
                let cspan = index + 2
                scillaCode[cspan] = "\n" + scillaCode[cspan]
                break;

            case 'library':  // match
                scillaCode[index] = "\n\nlibrary "
                break;

            case 'import':  // match
                scillaCode[index] = "\n\nimport "
                break;

            case '|':  // match
                scillaCode[index] = "\n| "
                break;

            case 'send':  // match
                scillaCode[index] = "\nsend "
                break;

            case 'builtin':  // match
                scillaCode[index] = "\n\tbuiltin "
                break;

            case '=>':  // match
                let span = index;
                scillaCode[span + 1] = "\n" + scillaCode[span + 1]
                break;

            default:
                scillaCode[index] = scillaCode[index].concat(" ")
                let curlyBracket = scillaCode[index].indexOf("};")

                if (curlyBracket !== -1) {
                    let span = index
                    scillaCode[span + 1] = "\n" + scillaCode[span + 1];
                }

                break;
        }

    }

    /*
     * Code indentation
     */
    transitionWithLocations = transitionWithLocations.sort(function (a, b) { return a - b })
    endLocations = endLocations.sort(function (a, b) { return a - b })

    if (transitionWithLocations.length == endLocations.length) {

        for (let indentPairs = 0; indentPairs < transitionWithLocations.length; indentPairs++) {
            indentBraces.push([transitionWithLocations[indentPairs], endLocations[indentPairs]])
        }

    } else {
        console.log("Error indenting code")
    }

    for (let bracesList = 0; bracesList < indentBraces.length; bracesList++) {

        var twTerminal = indentBraces[bracesList][0]
        var endTerminal = indentBraces[bracesList][1]
        var indentationType;

        if (scillaCode[twTerminal] == 'with') {
            indentationType = 'with'
        }

        if (scillaCode[twTerminal].indexOf(")") !== -1) {
            indentationType = 'transition'
        }

        switch (indentationType) {
            case 'with':
                twTerminal = twTerminal + 1
                endTerminal = endTerminal - 1
                while (twTerminal < endTerminal + 1) {
                    if (scillaCode[twTerminal].indexOf('\n') == 0) {
                        scillaCode[twTerminal] = "\n\t" + scillaCode[twTerminal].substring(scillaCode[twTerminal].length, 1)
                    }
                    twTerminal++
                }
                break;

            case 'transition':
                twTerminal = twTerminal + 1
                endTerminal = endTerminal - 1
                while (twTerminal < endTerminal + 1) {
                    if (scillaCode[twTerminal].indexOf('\n') == 0) {
                        scillaCode[twTerminal] = "\n\t" + scillaCode[twTerminal].substring(scillaCode[twTerminal].length, 1)
                    }
                    twTerminal++
                }
                break;

            default:
                break;
        }
    }

    // Insert back comments
    for (let index = 0; index < comments.length; index++) {
        comments[index] = "\n" + comments[index]
    }

    var clIteration = 0;
    while (clIteration < scillaCode.length) {
        if (scillaCode[clIteration].indexOf('scilla-comment-placeholder') !== -1) {
            commentLocations.push(clIteration)
        }
        clIteration++
    }

    // replace place holders with real comments
    for (let index = 0; index < comments.length; index++) {
        scillaCode[commentLocations[index]] = comments[index]

    }

    // Get formatted string
    var FormattedString = "";
    for (let index = 0; index < scillaCode.length; index++) {
        FormattedString = FormattedString.concat(scillaCode[index])
    }

    var returnValue = [FormattedString, "success"]

    if (transitionWithLocations.length !== endLocations.length) {
        FormattedString = rawScillaCode
        returnValue = [FormattedString, "fail"]
    }

    return returnValue
}
