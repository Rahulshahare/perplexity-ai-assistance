const vscode = require('vscode');
const axios = require('axios');

class PerplexityClient {
    constructor() {
        this.apiKey = '';
        this.model = 'sonar-pro';
        this.baseUrl = 'https://api.perplexity.ai/chat/completions';
        this.loadConfiguration();
        
        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('perplexity-ai')) {
                this.loadConfiguration();
            }
        });
    }

    loadConfiguration() {
        const config = vscode.workspace.getConfiguration('perplexity-ai');
        this.apiKey = config.get('apiKey', '');
        this.model = config.get('model', 'sonar-pro');
    }

    async askQuestion(question, context) {
        if (!this.apiKey) {
            throw new Error('Perplexity API key not configured. Please set it in VSCode settings.');
        }

        try {
            const messages = context 
                ? [
                    { role: "system", content: "You are a helpful AI assistant." },
                    { role: "user", content: `Context: ${context}\n\nQuestion: ${question}` }
                ]
                : [
                    { role: "system", content: "You are a helpful AI assistant." },
                    { role: "user", content: question }
                ];

            const response = await axios.post(
                this.baseUrl,
                {
                    model: this.model,
                    messages: messages
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error('Invalid API key. Please check your Perplexity API key in settings.');
            }
            throw new Error(`API request failed: ${error.message}`);
        }
    }

    async explainCode(code, language) {
        const question = `Explain the following ${language} code:\n\n${code}`;
        return this.askQuestion(question);
    }

    async generateDocumentation(code, language) {
        const question = `Generate documentation for the following ${language} code:\n\n${code}`;
        return this.askQuestion(question);
    }
}

module.exports = { PerplexityClient };