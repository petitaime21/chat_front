import React from 'react';
import infoGraphicSrc from '../styles/images/infographic.png';

const InfoGraphic = ({ onClose }) => {
  return (
    <div className="info-graphic-overlay" onClick={onClose}>
      <img 
        src={infoGraphicSrc} 
        alt="Infographic" 
        className="info-graphic" 
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
};

export default InfoGraphic;