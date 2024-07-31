import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const useChatLogic = (start, threadId, isChatStarted, setIsLoading) => {  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isChatStarted && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isChatStarted]);

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

  const handleSendMessage = useCallback(async (message, files = []) => {
    console.log(files)
    setMessages((prevMessages) => [...prevMessages, { id: uuidv4(), text: message, user: true, typing: false, attachedFiles: files}]);
    setInputValue('');
    setIsDisabled(true);
    
    setMessages((prevMessages) => [...prevMessages, { id: uuidv4(), text: '', user: false, typing: true}]);

    // textarea 높이 초기화
    const textarea = document.querySelector('.chat-textarea');
    if (textarea) {
      textarea.style.height = 'auto'; // 또는 초기 높이 값 (예: '40px')
    }

    try {
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

      const botMessage = response.data.message;
      
      console.log(response.data)
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
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { id: uuidv4(), text: '메시지 전송중 오류가 발생 하였습니다. 관리자에게 문의 하세요', user: false, typing: false, attachedFiles: []},
      ]);
    } finally {
      setIsDisabled(false);
      setTimeout(() => {
        const textarea = document.querySelector('.chat-textarea');
        if (textarea) {
          textarea.focus();
        }
      }, 0);
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
    
    // textarea 높이 자동 조절
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSendMessage(inputValue, uploadedFiles);
        setUploadedFiles([]);
      }
    }
  }, [inputValue, uploadedFiles, handleSendMessage]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue, uploadedFiles);
      setUploadedFiles([]);
    }
  }, [inputValue, uploadedFiles, handleSendMessage]);

  const memoizedSetMessages = useCallback((newMessages) => {
    setMessages(newMessages);
  }, []);

  const memoizedSetUploadedFiles = useCallback((newFiles) => {
    setUploadedFiles(newFiles);
  }, []);

  const memoizedSetIsDisabled = useCallback((value) => {
    setIsDisabled(value);
  }, []);

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

  // const { handleFileUpload, handleRemoveFile } = useFileUpload(
  //   setMessages,
  //   setUploadedFiles,
  //   setIsDisabled,
  //   setIsLoading
  // );

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
    // handleFileUpload,
    // handleRemoveFile,
    isChatStarted
  };
};

export default useChatLogic;