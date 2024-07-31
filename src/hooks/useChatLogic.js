import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const useChatLogic = (start, threadId, isChatStarted, setIsLoading) => {  
  // 상태 관리
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const textareaRef = useRef(null);

  // 채팅 시작 시 텍스트 영역에 포커스
  useEffect(() => {
    if (isChatStarted && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isChatStarted]);

  // 채팅 시작 시 초기 메시지 표시
  useEffect(() => {
    if (start) {
      const timer = setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { id: uuidv4(), text: '안녕하세요. 김민수 대표입니다.', user: false}]);    
        const textarea = document.querySelector('.chat-textarea');
          if (textarea) {
            textarea.focus();
          }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [start]);

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(async (message, files = []) => {
    // 사용자 메시지 추가
    setMessages((prevMessages) => [...prevMessages, { id: uuidv4(), text: message, user: true, typing: false, attachedFiles: files}]);
    setInputValue('');
    setUploadedFiles([]);
    setIsDisabled(true);
    
    // 봇 응답 대기 메시지 추가
    setMessages((prevMessages) => [...prevMessages, { id: uuidv4(), text: '', user: false, typing: true}]);

    // textarea 높이 초기화
    const textarea = document.querySelector('.chat-textarea');
    if (textarea) {
      textarea.style.height = 'auto';
    }

    try {
      // API 호출
      const currentThreadId = sessionStorage.getItem('threadId');
      const response = await axios.post(
        `${process.env.REACT_APP_CHAT_API_BASE_URL}/api/chat`,
        {
          message: message,
          files: files.map((file) => ({ file_id: file.id, file_name: file.name })),
          threadId: currentThreadId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // 봇 응답 메시지 추가
      const botMessage = response.data.message;
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { id: uuidv4(), 
          text: botMessage, 
          user: false, 
          typing: false,
          attachedFiles: []
        },
      ]);
    } catch (error) {
      console.error('Error fetching the chat response:', error);
      // 에러 메시지 추가
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { id: uuidv4(), text: '메시지 전송중 오류가 발생 하였습니다. 관리자에게 문의 하세요', user: false, typing: false, attachedFiles: []},
      ]);
    } finally {
      setIsDisabled(false);
      // 텍스트 영역에 포커스
      setTimeout(() => {
        const textarea = document.querySelector('.chat-textarea');
        if (textarea) {
          textarea.focus();
        }
      }, 0);
    }
  }, []);

  // 입력 변경 핸들러 (textarea 높이 자동 조절 포함)
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }, []);

  // 키 입력 핸들러 (Enter 키 처리)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSendMessage(inputValue, uploadedFiles);
        //setUploadedFiles([]);
      }
    }
  }, [inputValue, uploadedFiles, handleSendMessage]);

  // 제출 핸들러
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue, uploadedFiles);
      //setUploadedFiles([]);
    }
  }, [inputValue, uploadedFiles, handleSendMessage]);

  // 메모이제이션된 상태 설정 함수들
  const memoizedSetMessages = useCallback((newMessages) => {
    setMessages(newMessages);
  }, []);

  const memoizedSetUploadedFiles = useCallback((newFiles) => {
    setUploadedFiles(newFiles);
  }, []);

  const memoizedSetIsDisabled = useCallback((value) => {
    setIsDisabled(value);
  }, []);

  // 채팅 시작 시 텍스트 영역에 포커스
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

  return {
    messages,
    inputValue,
    isDisabled,
    uploadedFiles,
    handleSendMessage,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
    setMessages: memoizedSetMessages,
    setUploadedFiles: memoizedSetUploadedFiles,
    setIsDisabled: memoizedSetIsDisabled,    
    isChatStarted
  };
};

export default useChatLogic;