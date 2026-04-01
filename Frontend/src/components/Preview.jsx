import React from 'react';

const Preview = ({ code, loading }) => {
  return (
    <div className="w-full h-full min-h-[500px] bg-white overflow-hidden relative">
      {loading ? null : (
        <iframe
          title="preview"
          srcDoc={code}
          className="w-full h-full border-0 absolute inset-0"
          sandbox="allow-scripts allow-forms allow-popups"
        />
      )}
    </div>
  );
};

export default Preview;