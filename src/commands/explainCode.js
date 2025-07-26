const vscode = require('vscode');

async function explainCode(perplexityClient) {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText.trim()) {
            vscode.window.showErrorMessage('No code selected');
            return;
        }

        const language = editor.document.languageId;

        const explanation = await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Explaining code with Perplexity AI...',
                cancellable: false
            },
            async () => {
                return await perplexityClient.explainCode(selectedText, language);
            }
        );

        await vscode.window.showInformationMessage(explanation, { modal: true });
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
}

module.exports = { explainCode };