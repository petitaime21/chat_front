import { useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const useFileUpload = (setMessages, setUploadedFiles, setIsDisabled, setIsLoading) => {    

  // 파일 업로드 핸들러
  const handleFileUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    const newUploadedFiles = [];

    setIsDisabled(true);
    
    // 2개 이상의 파일 업로드 시 로딩 표시
    if (files.length >= 2) {
        if (typeof setIsLoading === 'function') {
          setIsLoading(true);
        } else {
          console.error('setIsLoading is not a function:', setIsLoading);
        }
      }
    

    for (const file of files) {
      // 파일 확장자 검사 (.txt 파일만 허용)
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'txt') {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), text: `첨부실패: ${file.name} \n주의! txt 확장자 파일만 받습니다.`, user: false },
        ]);
        continue;
      }

      const formData = new FormData();      
      formData.append('file', file);

      try {
        // 파일 업로드 API 호출
        const response = await axios.post(`${process.env.REACT_APP_CHAT_API_BASE_URL}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        const res_fileId = response.data.fileId;
        console.log(`File ID: ${res_fileId}`);

        // 업로드된 파일 정보 저장
        newUploadedFiles.push({
          id: res_fileId,
          name: file.name,
          url: URL.createObjectURL(file),
        });
      } catch (error) {
        console.error('Error uploading the file:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), text: '업로드 중 오류가 발생하였습니다. 관리자에게 문의 하세요.', user: false },
        ]);
      }
    }

    // 업로드된 파일 상태 업데이트
    setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);
    setIsDisabled(false);    
    setIsLoading(false);  // 모든 파일 업로드 완료 후 로딩 종료
    e.target.value = '';  // 파일 입력 필드 초기화
  }, [setMessages, setUploadedFiles, setIsDisabled, setIsLoading]);

  // 파일 제거 핸들러
  const handleRemoveFile = useCallback((fileId) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  }, [setUploadedFiles]);

  return { handleFileUpload, handleRemoveFile };
};

export default useFileUpload;