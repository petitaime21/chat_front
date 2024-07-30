import React, { useRef, useEffect} from 'react';
import Message from './Message';
import FilePreview from './FilePreview';

const ChatInterface = ({
  messages,
  inputValue,
  isDisabled,
  uploadedFiles,
  onSendMessage,
  onInputChange,
  onKeyDown,
  onSubmit,
  onFileUpload,
  onRemoveFile,
  isChatStarted
}) => {
  const messagesEndRef = useRef(null);  

  useEffect(() => {
    if (isChatStarted && !isDisabled) {
      setTimeout(() => {
        const textarea = document.querySelector('.chat-textarea');
        if (textarea) {
          textarea.focus();
        }
      }, 0);
    }
  }, [isChatStarted, isDisabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue, uploadedFiles);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message) => (
          <Message key={message.id} text={message.text} user={message.user} typing={message.typing} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <div className="uploaded-files">
          {uploadedFiles.map((file) => (
            <FilePreview key={file.id} file={file} onRemove={onRemoveFile} />
          ))}
        </div>
        <div className="input-area-content">
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            multiple
            onChange={onFileUpload}
            disabled={isDisabled}
          />
          <button
            className={`attach-button ${isDisabled ? 'disabled' : ''}`}
            onClick={() => document.getElementById('file-upload').click()}
            disabled={isDisabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <textarea
              className="chat-textarea"
              value={inputValue}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="메시지를 입력하세요..."
              rows={1}
              style={{ resize: 'none', overflow: 'hidden' }}
              disabled={isDisabled}              
            />
          </form>
          <button
            className={`send-button ${isDisabled ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" className="icon-2xl">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;