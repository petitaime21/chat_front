import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ChatInterface from './components/ChatInterface';
import VideoPlayer from './components/VideoPlayer';
import useChatLogic from './hooks/useChatLogic';
import useFileUpload from './hooks/useFileUpload';

// ChatApp 컴포넌트: 채팅 인터페이스를 관리
const ChatApp = React.memo(({ start, threadId, isChatStarted, setIsLoading  }) => {  
  // useChatLogic 커스텀 훅을 사용하여 채팅 관련 로직 관리
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

  // useFileUpload 커스텀 훅을 사용하여 파일 업로드 관련 로직 관리
  const { handleFileUpload, handleRemoveFile } = useFileUpload(
    setMessages,
    setUploadedFiles,
    setIsDisabled,
    setIsLoading
  );

  // ChatInterface 컴포넌트 렌더링
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

// App 컴포넌트: 전체 애플리케이션 구조를 관리
const App = () => {
  // 상태 관리
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [start, setStart] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [showInfoGraphic, setShowInfoGraphic] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);  
  const [isLoading, setIsLoading] = useState(false);

  // 세션 스토리지 초기화
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  // 채팅 시작 핸들러
  const handleStart = useCallback(async () => {
    // 시작 버튼 스타일 변경 및 비활성화
    const startButton = document.querySelector('.start-button');
    startButton.classList.add('loading');
    startButton.textContent = "";
    startButton.disabled = true;

    try {
      // 채팅 시작 API 호출
      const response = await axios.post(`${process.env.REACT_APP_CHAT_API_BASE_URL}/api/chat_start`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });

      // threadId 설정 및 세션 스토리지에 저장
      const newThreadId = response.data.threadId;
      if (newThreadId) {
        setThreadId(newThreadId);
        sessionStorage.setItem('threadId', newThreadId.toString());
        setIsChatStarted(true);
      } else {
        console.error('No threadId received from server');
      }

      // 오버레이 숨기기 및 채팅 시작
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

  // 정보 그래픽 토글 핸들러
  const toggleInfoGraphic = useCallback(() => {
    setShowInfoGraphic(prev => !prev);
  }, []);

  // 애플리케이션 UI 렌더링
  return (
    <div className="App">
      {isLoading && (
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
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
        <VideoPlayer showInfoGraphic={showInfoGraphic} toggleInfoGraphic={toggleInfoGraphic} />
      </div>
    </div>
  );
};

export default App;