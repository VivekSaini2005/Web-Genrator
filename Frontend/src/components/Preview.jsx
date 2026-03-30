import React from "react";

const Preview = ({ code }) => {
  return (
    <div className="h-full bg-white">
      <div className="p-2 border-b text-sm">Preview</div>

      <iframe
        title="preview"
        srcDoc={code}
        className="w-full h-[calc(100%-40px)]"
      />
    </div>
  );
};

export default Preview;