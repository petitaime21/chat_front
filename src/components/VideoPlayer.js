import React, { useState, useRef, useCallback } from 'react';
import videoSrc from '../styles/images/CEO_KIM.mp4';
import playButtonSrc from '../styles/images/play-button.png';
import InfoGraphic from '../components/InfoGraphic';
import ziniLogo from '../styles/images/new_nice_logo_ko.svg';

const VideoPlayer = () => {
  // 재생 버튼 표시 여부를 관리하는 상태
  const [showPlayButton, setShowPlayButton] = useState(true);
  // 비디오 요소에 대한 참조
  const videoRef = useRef(null);
  // 정보 그래픽 표시 여부를 관리하는 상태
  const [showInfoGraphic, setShowInfoGraphic] = useState(false);

  // 비디오 재생/일시정지 토글 함수
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setShowPlayButton(false);
    } else {
      videoRef.current.pause();
      setShowPlayButton(true);
    }
  };

  // 정보 그래픽 표시/숨김 토글 함수
  const toggleInfoGraphic = useCallback((e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setShowInfoGraphic(prev => !prev);
  }, []);

  return (
    <div className="video-container">
      {/* 비디오 플레이어 */}
      <div className="video-wrapper" onClick={togglePlay}>
        <video ref={videoRef} width="320" height="480">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* 재생 버튼 (비디오가 일시정지 상태일 때만 표시) */}
        {showPlayButton && (
          <img src={playButtonSrc} alt="Play" className="play-button" />
        )}
      </div>
      {/* 정보 버튼 */}
      <button className="info-button" onClick={toggleInfoGraphic}>
        <img src={ziniLogo} alt="대체 텍스트" onclick="" />
      </button>
      {/* 정보 그래픽 (토글 상태에 따라 표시) */}
      {showInfoGraphic && <InfoGraphic onClose={toggleInfoGraphic} />}
    </div>
  );
};

export default VideoPlayer;