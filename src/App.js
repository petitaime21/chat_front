import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ChatInterface from './components/ChatInterface';
import VideoPlayer from './components/VideoPlayer';
import useChatLogic from './hooks/useChatLogic';
import useFileUpload from './hooks/useFileUpload';

const ChatApp = React.memo(({ start, threadId, isChatStarted, setIsLoading  }) => {  
  const {
    messages,
    inputValue,
    isDisabled,
    uploadedFiles,
    handleSendMessage,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
    setMessages,
    setUploadedFiles,
    setIsDisabled,    
  } = useChatLogic(start, threadId, isChatStarted, setIsLoading);

  const { handleFileUpload, handleRemoveFile } = useFileUpload(
    setMessages,
    setUploadedFiles,
    setIsDisabled,
    setIsLoading
  );

  return (
    <ChatInterface
      messages={messages}
      inputValue={inputValue}
      isDisabled={isDisabled}
      uploadedFiles={uploadedFiles}
      onSendMessage={handleSendMessage}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      onFileUpload={handleFileUpload}
      onRemoveFile={handleRemoveFile}      
    />
  );
});

const App = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [start, setStart] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [showInfoGraphic, setShowInfoGraphic] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);  
  const [isLoading, setIsLoading] = useState(false);  // 새로운 state 추가

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleStart = useCallback(async () => {
    const startButton = document.querySelector('.start-button');
    startButton.classList.add('loading');
    startButton.textContent = "";
    startButton.disabled = true;

    try {
      const response = await axios.post(`${process.env.REACT_APP_CHAT_API_BASE_URL}/api/chat_start`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });

      const newThreadId = response.data.threadId;
      if (newThreadId) {
        setThreadId(newThreadId);
        sessionStorage.setItem('threadId', newThreadId.toString());
        setIsChatStarted(true);
      } else {
        console.error('No threadId received from server');
      }

      setTimeout(() => {
        startButton.classList.remove('loading');
        setIsOverlayVisible(false);
        setStart(true);
      }, 2000);
    } catch (error) {
      console.error('Error starting the chat:', error);
      startButton.classList.remove('loading');
      startButton.textContent = "시작";
      startButton.disabled = false;
    }
  }, []);

  const toggleInfoGraphic = useCallback(() => {
    setShowInfoGraphic(prev => !prev);
  }, []);

  return (
    <div className="App">
      {isLoading && (  // 로딩 화면 조건부 렌더링
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )} 
      <div className="content-container">
        <div className="ipad-frame-container">
          {isOverlayVisible && (
            <div className="overlay">
              <button className="start-button" onClick={handleStart}>시작</button>
            </div>
          )}
          <div className="ipad-frame">
            <ChatApp 
              start={start} 
              threadId={threadId} 
              isChatStarted={isChatStarted} 
              setIsLoading={setIsLoading}  // setIsLoading 함수 전달
            />
          </div>
        </div>
        <VideoPlayer showInfoGraphic={showInfoGraphic} toggleInfoGraphic={toggleInfoGraphic} />
      </div>
    </div>
  );
};

export default App;