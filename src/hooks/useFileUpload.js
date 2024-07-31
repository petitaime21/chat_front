import { useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const useFileUpload = (setMessages, setUploadedFiles, setIsDisabled) => {
  const handleFileUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    const newUploadedFiles = [];

    setIsDisabled(true);    

    for (const file of files) {
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
        const response = await axios.post(`${process.env.REACT_APP_CHAT_API_BASE_URL}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        const res_fileId = response.data.fileId;
        console.log(`File ID: ${res_fileId}`);

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

    setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);
    setIsDisabled(false);    
    e.target.value = '';
  }, [setMessages, setUploadedFiles, setIsDisabled]);

  const handleRemoveFile = useCallback((fileId) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  }, [setUploadedFiles]);

  return { handleFileUpload, handleRemoveFile };
};

export default useFileUpload;