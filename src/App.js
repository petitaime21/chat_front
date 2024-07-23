import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import loadingGif from './styles/loading.gif';
import filePng from './styles/file.png';

// Message 컴포넌트
const Message = ({ text, user, typing }) => {
  return (
    <div className={`message-container ${user ? 'user' : 'bot'} ${typing ? 'typing' : ''}`}>
      <div className={`${user ? 'user-image' : 'bot-image'}`}></div>
      <div className={`message ${user ? 'user' : 'bot'} ${typing ? 'typing' : ''}`}>
        {typing ? (
          <div className="typing-indicator">
            <img src={loadingGif} alt="로딩 중" className="loading-image" />            
            <p>{typing ? '' : text}</p>
          </div>
        ) : (
          <p>{text}</p>
        )}
      </div>
    </div>
  );
};

// FilePreview 컴포넌트
const FilePreview = ({ file, onRemove }) => {
  return (
    <div className="group relative inline-block text-sm text-token-text-primary">
      <div className="relative overflow-hidden rounded-xl border border-token-border-light bg-token-main-surface-primary">
        <div className="p-2 w-80">
          <div className="flex flex-row items-center gap-2">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" className="h-10 w-10 flex-shrink-0" width="36" height="36">
                <rect width="36" height="36" rx="6" fill="#0000FF"></rect>
                <path d="M18.833 9.66663H12.9997C12.5576 9.66663 12.1337 9.84222 11.8212 10.1548C11.5086 10.4673 11.333 10.8913 11.333 11.3333V24.6666C11.333 25.1087 11.5086 25.5326 11.8212 25.8451C12.1337 26.1577 12.5576 26.3333 12.9997 26.3333H22.9997C23.4417 26.3333 23.8656 26.1577 24.1782 25.8451C24.4907 25.5326 24.6663 25.1087 24.6663 24.6666V15.5L18.833 9.66663Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M18.833 9.66663V15.5H24.6663" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <div className="overflow-hidden">
              <div className="truncate font-semibold">{file.name}</div>
              <div className="truncate text-token-text-tertiary">파일</div>
            </div>
          </div>
        </div>
      </div>
      <button className="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full border border-token-border-heavy bg-token-main-surface-secondary p-0.5 text-token-text-primary transition-colors hover:opacity-100 group-hover:opacity-100 md:opacity-0" onClick={() => onRemove(file.id)}>
        <span data-state="closed">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-sm">
            <path fill="currentColor" fill-rule="evenodd" d="M5.636 5.636a1 1 0 0 1 1.414 0l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414L13.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 0 1-1.414-1.414l4.95-4.95-4.95-4.95a1 1 0 0 1 0-1.414" clip-rule="evenodd"></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

// ChatApp 컴포넌트
const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message, files = []) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, user: true }]);
    setInputValue('');
    setIsDisabled(true); // 메시지 전송 중 상태로 설정
    setIsTyping(true);
    setMessages((prevMessages) => [...prevMessages, { text: '', user: false, typing: true }]);
    scrollToBottom();

    try {
      const response = await axios.post(
        'http://localhost:3001/api/chat',
        {
          message: message,
          files: files.map((file) => file.id), // 파일 ID와 함께 메시지 전송
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const botMessage = response.data.message;
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { text: botMessage, user: false, typing: false },
      ]);
    } catch (error) {
      console.error('Error fetching the chat response:', error);
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { text: 'Error fetching the chat response', user: false, typing: false },
      ]);
    } finally {
      setIsDisabled(false); // 메시지 전송 완료 후 상태 해제
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue, uploadedFiles); // 업로드된 파일들을 함께 전달
      setUploadedFiles([]); // 메시지 전송 후 업로드된 파일 초기화
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
      e.preventDefault();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newUploadedFiles = [];

    setIsDisabled(true); // 파일 업로드 중 상태로 설정

    for (const file of files) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'txt') {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'txt 확장자 파일만 받습니다.', user: false },
        ]);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:3001/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        const res_message = response.data.message;
        const res_fileId = response.data.fileId;
        console.log(`File ID: ${res_fileId}`);

        newUploadedFiles.push({
          id: res_fileId,
          name: file.name,
          url: URL.createObjectURL(file), // 파일 미리보기 URL
        });
      } catch (error) {
        console.error('Error uploading the file:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Error uploading the file.', user: false },
        ]);
      }
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);
    setIsDisabled(false); // 파일 업로드 완료 후 상태 해제
    e.target.value = ''; // 추가된 부분: 파일 입력 필드 초기화
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <Message key={index} text={message.text} user={message.user} typing={message.typing} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <div className="uploaded-files">
          {uploadedFiles.map((file) => (
            <FilePreview key={file.id} file={file} onRemove={handleRemoveFile} />
          ))}
        </div>
        <div className="input-area-content">
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            multiple
            onChange={handleFileUpload}
            disabled={isDisabled} // 업로드 버튼 비활성화
          />
          <button
            className={`attach-button ${isDisabled ? 'disabled' : ''}`}
            onClick={() => document.getElementById('file-upload').click()}
            disabled={isDisabled} // 업로드 버튼 비활성화
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
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              rows={1}
              style={{ resize: 'none', overflow: 'hidden' }}
              disabled={isDisabled}
            />
          </form>
          <button
            className={`send-button ${isDisabled ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={isDisabled} // 전송 버튼 비활성화
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
 
// App 컴포넌트
const App = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const handleStart = async () => {
    const startButton = document.querySelector('.start-button');
    startButton.classList.add('loading');
    startButton.textContent = "";

    try {
      await axios.post('http://localhost:3001/api/chat_start', {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // 2초 대기
      setTimeout(() => {
        startButton.classList.remove('loading');
        setIsOverlayVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Error starting the chat:', error);
      startButton.classList.remove('loading');
      startButton.textContent = "시작";
    }
  };

  return (
    <div className="App">
      {isOverlayVisible && (
        <div className="overlay">
          <button className="start-button" onClick={handleStart}>시작</button>
        </div>
      )}
      <div className="ipad-frame">
        <ChatApp />
      </div>
    </div>
  );
};

export default App;
