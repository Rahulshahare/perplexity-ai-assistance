const vscode = require('vscode');

async function generateDocumentation(perplexityClient) {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText.trim()) {
            const document = editor.document;
            const fullText = document.getText();
            if (!fullText.trim()) {
                vscode.window.showErrorMessage('No code found');
                return;
            }
            
            const language = document.languageId;
            const documentation = await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: 'Generating documentation with Perplexity AI...',
                    cancellable: false
                },
                async () => {
                    return await perplexityClient.generateDocumentation(fullText, language);
                }
            );

            await vscode.window.showInformationMessage(documentation, { modal: true });
        } else {
            const language = editor.document.languageId;
            const documentation = await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: 'Generating documentation with Perplexity AI...',
                    cancellable: false
                },
                async () => {
                    return await perplexityClient.generateDocumentation(selectedText, language);
                }
            );

            await vscode.window.showInformationMessage(documentation, { modal: true });
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
}

module.exports = { generateDocumentation };