import React, { useState, useEffect } from 'react';
import './notification.css'; // You will add styles here

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer); // Clean up timer on component unmount
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
