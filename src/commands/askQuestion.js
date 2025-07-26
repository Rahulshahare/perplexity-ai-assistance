const vscode = require('vscode');

async function askQuestion(perplexityClient) {
    try {
        const question = await vscode.window.showInputBox({
            prompt: 'Ask Perplexity AI a question',
            placeHolder: 'What would you like to know?'
        });

        if (!question) return;

        const response = await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Asking Perplexity AI...',
                cancellable: false
            },
            async () => {
                return await perplexityClient.askQuestion(question);
            }
        );

        await vscode.window.showInformationMessage(response, { modal: true });
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
}

module.exports = { askQuestion };