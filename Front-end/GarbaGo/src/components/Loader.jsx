import React from 'react';

const Loader = () => {
  return (
    <div className='fixed inset-0 bg-purple-100 bg-opacity-50 flex justify-center items-center z-50'>
      <div className='h-12 w-12 rounded-full border-4 border-violet-600 border-t-transparent animate-spin'></div>
    </div>
  );
};

export default Loader;
