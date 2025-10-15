
import React from 'react';

interface ToastProps {
  message: string;
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, show }) => {
  return (
    <div
      className={`fixed bottom-24 right-5 bg-neutral-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${!show && 'pointer-events-none'}`}
    >
      {message}
    </div>
  );
};

export default Toast;
