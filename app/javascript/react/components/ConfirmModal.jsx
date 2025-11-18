import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", variant = "danger" }) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    info: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed z-[9999] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        padding: '1rem'
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl transform transition-all"
        style={{
          position: 'relative',
          maxWidth: '28rem',
          width: '100%',
          margin: 'auto',
          zIndex: 10
        }}
      >
        <div className="p-6">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 mb-4">
            <svg 
              className="h-6 w-6 text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 text-center">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-400 text-center mb-6">
            {message}
          </p>

          {/* Actions */}
          <div 
            className="flex items-center gap-2"
            style={{ justifyContent: 'flex-end', display: 'flex' }}
          >
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg bg-gray-700 px-6 py-3 text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              type="button"
              className={`rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${variantClasses[variant]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

