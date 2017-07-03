var LanguageDetector = function() {
    this.supportedLanguages = ['xml', 'json'];
}

// Try to autodetect language
// Returns xml, json or null if no language could be identified
LanguageDetector.prototype.autoDetectLanguage = function(content) {
    if(!content || content === 'undefined') {
        return null;
    }
    var autoDetect = hljs.highlightAuto(content);

    // Try to find the best language else use the second best identified by the 3rd party library
    if(!autoDetect.language || autoDetect.language === 'undefined') {
        // Else return null if no language could be identified
        return null;
    } else if ($.inArray(autoDetect.language, this.supportedLanguages) !== -1) {
        return autoDetect.language;
    } else {
        if ($.inArray(autoDetect.second_best.language, this.supportedLanguages) !== -1) {
            return autoDetect.second_best.language;
        }
    }
};

// Format code to specific language. Returns the code in plaintext if there was a problem.
// param code: The code to be formatted.
// param codeLanguage: The language which the code is in
LanguageDetector.prototype.formatCode = function(code, codeLanguage) {
    var formattedCode;

    if(!codeLanguage || codeLanguage === 'undefined') {
        formattedCode = code;
    } else if (codeLanguage === 'json') {
        formattedCode = vkbeautify.json(code);
    } else if (codeLanguage === 'xml') {
        formattedCode = vkbeautify.xml(code);
    } else {
        throw Error('The code language ' + codeLanguage + ' is not supported.');
    }

    return formattedCode;
}

// Highlights code. Returns the code in plaintext if something does not work.
// param code: The code to be highlighted
// param codeLanguage: The language which the code is in
LanguageDetector.prototype.highlightCode = function(code, codeLanguage){
    var highlightedCode;

    // If no proper language was given return the code
    if(!codeLanguage || codeLanguage === 'undefined') {
        return code;
    }

    highlightedCode = hljs.highlight(codeLanguage, code, true)

    return highlightedCode.value;
}

// Tries to detect the code language and formats the code after that.
// param: Code which should be formatted.
LanguageDetector.prototype.autoDetectLanguageAndFormatCode = function(code) {
    var detectedLanguage = this.autoDetectLanguage(code);

    return this.formatCode(code, detectedLanguage);
}