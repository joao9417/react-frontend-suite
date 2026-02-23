import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  const baseClasses = "w-full p-3 border border-gray-300 rounded-lg text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 ease-in-out";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
  
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;