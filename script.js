document.getElementById("reviewButton").addEventListener("click", function () {
    const code = document.getElementById("codeInput").value;
    const language = document.getElementById("language").value;
    const output = document.getElementById("output");
    const downloadPdfButton = document.getElementById("downloadPdfButton");
    output.textContent = ""; // Clear previous output
    downloadPdfButton.style.display = 'none'; // Hide PDF download button by default

    let lintErrors = [];

    try {
        if (language === "htmlcss") {
            // Simple HTML linting logic
            lintErrors = code.includes("<script>") ? [] : [{ message: "No <script> tag found in HTML.", line: 1, column: 1 }];
        } else if (language === "js") {
            const results = eslint.verify(code);
            lintErrors = results.map(err => ({
                message: err.message,
                line: err.line,
                column: err.column,
            }));
        } else if (language === "c" || language === "cpp" || language === "csharp" || language === "rust") {
            lintErrors = code.includes("main") ? [] : [{ message: "No main function found.", line: 1, column: 1 }];
        } else if (language === "latex") {
            lintErrors = code.includes("\\begin") ? [] : [{ message: "No LaTeX document structure found.", line: 1, column: 1 }];
        }
    } catch (error) {
        lintErrors.push({ message: error.message });
    }

    if (lintErrors.length > 0) {
        lintErrors.forEach(err => {
            output.textContent += `Error: ${err.message} at line ${err.line}, column ${err.column}\n`;
        });
    } else {
        output.textContent = "No errors found!";
    }
});

document.getElementById("executeButton").addEventListener("click", function () {
    const code = document.getElementById("codeInput").value;
    const language = document.getElementById("language").value;
    const iframeWindow = document.getElementById("codeOutput").contentWindow;

    let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code Execution</title>
            <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
        </head>
        <body>
    `;

    try {
        if (language === 'htmlcss') {
            htmlContent += code;
        } else if (language === 'js') {
            htmlContent += `<script>${code}<\/script>`;
        } else if (language === 'latex') {
            htmlContent += `<div style="font-family: 'Verdana', sans-serif;">\\[${code}\\]</div>`;
            document.getElementById("downloadPdfButton").style.display = 'inline'; // Show PDF download button for LaTeX
        } else {
            // For other languages, just show the code since we cannot execute them directly in the browser
            htmlContent += `<pre>${code}</pre>`;
        }
    } catch (error) {
        document.body.insertAdjacentHTML('beforeend', '<p style="color: red;">Error: ' + error.message + '</p>');
    }

    htmlContent += `
        </body>
        </html>
    `;

    try {
        iframeWindow.document.open();
        iframeWindow.document.write(htmlContent);
        iframeWindow.document.close();
        // Render the MathJax to process LaTeX
        iframeWindow.MathJax.typeset();
    } catch (error) {
        console.error("Error executing code:", error);
        document.getElementById("output").textContent = "Error executing code: " + error.message;
    }
});

// Function to download LaTeX content as PDF
document.getElementById("downloadPdfButton").addEventListener("click", function () {
    const latexCode = document.getElementById("codeInput").value;
    const pdf = new jsPDF();

    pdf.text(latexCode, 10, 10); // Add LaTeX code to PDF at position (10, 10)
    pdf.save("document.pdf"); // Save the PDF with the filename "document.pdf"
});
