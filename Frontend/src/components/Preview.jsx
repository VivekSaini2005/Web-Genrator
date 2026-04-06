import React from 'react';

const Preview = ({ code, loading }) => {
  return (
    <div className="artifact-pane">
      <div className="pane-header">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        Live Preview
      </div>
      <div className="flex-1 rounded-2xl overflow-hidden shadow-soft bg-white relative">
        {!loading && (
          <iframe
            title="preview"
            srcDoc={code || "<div style=\"display:flex;height:100%;align-items:center;justify-content:center;color:#666;font-family:sans-serif;text-align:center;padding:20px;\"><div><h2 style=\"margin:0;font-size:24px;\">Nothing to preview yet</h2><p style=\"opacity:0.6;margin-top:8px;\">Enter a prompt to generate code</p></div></div>"}
            className="w-full h-full bg-white border-0 absolute inset-0"
            sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
          />
        )}
      </div>
    </div>
  );
};

export default Preview;