import React from 'react';
import './index.css';

interface ShinyTextProps {
  text: string;
  className?: string;
}

const ShinyText = ({ text, className = '' }: ShinyTextProps) => {
  return <span className={`shiny-text inline-block ${className}`}>{text}</span>;
};

export default ShinyText;
