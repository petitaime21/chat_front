import React, { useState, useRef, useCallback } from 'react';
import videoSrc from '../styles/images/CEO_KIM.mp4';
import playButtonSrc from '../styles/images/play-button.png';
import InfoGraphic from '../components/InfoGraphic';
import ziniLogo from '../styles/images/new_nice_logo_ko.svg';


const VideoPlayer = () => {
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef(null);
  const [showInfoGraphic, setShowInfoGraphic] = useState(false);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setShowPlayButton(false);
    } else {
      videoRef.current.pause();
      setShowPlayButton(true);
    }
  };

  const toggleInfoGraphic = useCallback((e) => {
    e.stopPropagation();
    setShowInfoGraphic(prev => !prev);
  }, []);

  return (
    <div className="video-container">
      <div className="video-wrapper" onClick={togglePlay}>
        <video ref={videoRef} width="320" height="480">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {showPlayButton && (
          <img src={playButtonSrc} alt="Play" className="play-button" />
        )}
      </div>
      <button className="info-button" onClick={toggleInfoGraphic}>
        <img src={ziniLogo} alt="대체 텍스트" onclick="" />
      </button>
      {showInfoGraphic && <InfoGraphic onClose={toggleInfoGraphic} />}
    </div>
    
  );
};

export default VideoPlayer;