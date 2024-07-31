import React from 'react';
import loadingGif from '../styles/images/loading.gif';

const Message = ({ text, user, typing, attachedFiles }) => {
    //console.log(1, user, typing, attachedFiles);
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
          <>
            <p>{text}</p>            
            {attachedFiles && attachedFiles.length > 0 && (
              <div className="attached-files">
                <p>※ 첨부 파일:</p>
                <ul>
                  {attachedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;