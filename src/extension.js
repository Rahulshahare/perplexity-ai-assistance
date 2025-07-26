const vscode = require('vscode');
const { PerplexityClient } = require('./PerplexityClient')
const { SidebarProvider } = require('./SidebarProvider');
const { askQuestion } = require('./commands/askQuestion');
const { explainCode } = require('./commands/explainCode');
const { generateDocumentation } = require('./commands/generateDocumentation');

function activate(context) {
    console.log('Perplexity AI Assistant is now active!');

    // Initialize Perplexity client
    const perplexityClient = new PerplexityClient();

    // Register sidebar view
    const sidebarProvider = new SidebarProvider(context.extensionUri, perplexityClient);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'perplexity-ai.chat',
            sidebarProvider
        )
    );

    // Register commands
    const askQuestionCommand = vscode.commands.registerCommand(
        'perplexity-ai.askQuestion',
        () => askQuestion(perplexityClient)
    );

    const explainCodeCommand = vscode.commands.registerCommand(
        'perplexity-ai.explainCode',
        () => explainCode(perplexityClient)
    );

    const generateDocCommand = vscode.commands.registerCommand(
        'perplexity-ai.generateDocumentation',
        () => generateDocumentation(perplexityClient)
    );

    context.subscriptions.push(
        askQuestionCommand,
        explainCodeCommand,
        generateDocCommand
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};