const vscode = require('vscode');

class SidebarProvider {
    constructor(extensionUri, perplexityClient) {
        this._extensionUri = extensionUri;
        this._perplexityClient = perplexityClient;
        this._view = undefined;
    }

    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'askQuestion':
                    try {
                        const response = await this._perplexityClient.askQuestion(data.question);
                        webviewView.webview.postMessage({
                            type: 'response',
                            response: response,
                            question: data.question
                        });
                    } catch (error) {
                        webviewView.webview.postMessage({
                            type: 'error',
                            error: error.message
                        });
                    }
                    break;
            }
        });
    }

    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css'));

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>Perplexity AI Chat</title>
</head>
<body>
    <div class="container">
        <div id="chat-container">
            <div id="chat-messages"></div>
        </div>
        <div class="input-container">
            <input type="text" id="question-input" placeholder="Ask Perplexity AI anything...">
            <button id="send-button">Send</button>
        </div>
    </div>
    <script src="${scriptUri}"></script>
</body>
</html>`;
    }
}

SidebarProvider.viewType = 'perplexity-ai.chat';

module.exports = { SidebarProvider };