import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "w-full p-3 font-bold rounded-lg text-lg cursor-pointer transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 text-gray-900 hover:bg-primary-700 active:bg-primary-800 hover:shadow-lg border-2 border-indigo-500 rounded-lg ",
    secondary: "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;