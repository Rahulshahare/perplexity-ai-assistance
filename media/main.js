(function () {
    const vscode = acquireVsCodeApi();
    const chatMessages = document.getElementById('chat-messages');
    const questionInput = document.getElementById('question-input');
    const sendButton = document.getElementById('send-button');

    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        messageDiv.innerHTML = `<strong>${role === 'user' ? 'You' : 'Perplexity'}:</strong><br>${content}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const question = questionInput.value.trim();
        if (!question) return;

        addMessage('user', question);
        questionInput.value = '';

        vscode.postMessage({
            type: 'askQuestion',
            question: question
        });
    }

    sendButton.addEventListener('click', sendMessage);
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'response':
                addMessage('assistant', message.response);
                break;
            case 'error':
                addMessage('error', `Error: ${message.error}`);
                break;
        }
    });
}());