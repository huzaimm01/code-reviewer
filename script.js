document.getElementById("reviewButton").addEventListener("click", function () {
    const code = document.getElementById("codeInput").value;
    const language = document.getElementById("language").value;
    let output = '';

    if (language === "js") {
        reviewJavaScript(code).then(result => {
            output = result;
            document.getElementById("output").textContent = output;
        });
    } else if (language === "css") {
        reviewCSS(code).then(result => {
            output = result;
            document.getElementById("output").textContent = output;
        });
    } else if (language === "html") {
        output = reviewHTML(code);
        document.getElementById("output").textContent = output;
    } else {
        output = "Language not supported.";
        document.getElementById("output").textContent = output;
    }
});

// Function to review JavaScript
async function reviewJavaScript(code) {
    const linter = new eslint.ESLint();
    const results = await linter.lintText(code);
    const messages = results[0].messages;

    if (messages.length === 0) {
        return "JavaScript Review: No issues found.";
    } else {
        return messages.map(msg => `${msg.ruleId}: ${msg.message} (line ${msg.line}, column ${msg.column})`).join('\n');
    }
}

// Function to review CSS
async function reviewCSS(code) {
    const result = await stylelint.lint({ code });
    const warnings = result.warnings;

    if (warnings.length === 0) {
        return "CSS Review: No issues found.";
    } else {
        return warnings.map(w => `${w.text} (line ${w.line}, column ${w.column})`).join('\n');
    }
}

// Function to review HTML
function reviewHTML(code) {
    const results = HTMLHint.verify(code);
    if (results.length === 0) {
        return "HTML Review: No issues found.";
    } else {
        return results.map(result => `${result.code}: ${result.message} (line ${result.line}, column ${result.col})`).join('\n');
    }
}

// Function to execute JavaScript code
document.getElementById("executeButton").addEventListener("click", function () {
    const jsCode = document.getElementById("codeInput").value;
    const iframe = document.getElementById("codeOutput");
    const iframeWindow = iframe.contentWindow || iframe.contentDocument.defaultView;

    iframeWindow.document.open();
    iframeWindow.document.write('<html><body><script>' + jsCode + '</script></body></html>');
    iframeWindow.document.close();
});
