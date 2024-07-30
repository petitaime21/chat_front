import React from 'react';
import loadingGif from '../styles/images/loading.gif';

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

export default Message;