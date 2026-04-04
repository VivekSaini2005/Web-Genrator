import React from 'react';

const Preview = ({ code, loading }) => {
  return (
    <div className="w-full h-full min-h-[500px] bg-white overflow-hidden relative">
      {loading ? null : (
        <iframe
          title="preview"
          srcDoc={code || "<div style=\"display:flex;height:100%;align-items:center;justify-content:center;color:#666;font-family:sans-serif;\"><h2>Nothing to preview yet</h2></div>"}
          className="w-full h-full border-0 absolute inset-0"
          sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
        />
      )}
    </div>
  );
};

export default Preview;