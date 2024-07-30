import React from 'react';

const FilePreview = ({ file, onRemove }) => {
  return (
    <div className="group relative inline-block text-sm text-token-text-primary">
      <div className="relative overflow-hidden rounded-xl border border-token-border-light bg-token-main-surface-primary">
        <div className="p-2 w-80">
          <div className="flex flex-row items-center gap-2">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" className="h-10 w-10 flex-shrink-0" width="36" height="36">
                <rect width="36" height="36" rx="6" fill="#0000FF"></rect>
                <path d="M18.833 9.66663H12.9997C12.5576 9.66663 12.1337 9.84222 11.8212 10.1548C11.5086 10.4673 11.333 10.8913 11.333 11.3333V24.6666C11.333 25.1087 11.5086 25.5326 11.8212 25.8451C12.1337 26.1577 12.5576 26.3333 12.9997 26.3333H22.9997C23.4417 26.3333 23.8656 26.1577 24.1782 25.8451C24.4907 25.5326 24.6663 25.1087 24.6663 24.6666V15.5L18.833 9.66663Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M18.833 9.66663V15.5H24.6663" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div className="overflow-hidden">
              <div className="truncate font-semibold">{file.name}</div>
              <div className="truncate text-token-text-tertiary">파일</div>
            </div>
          </div>
        </div>
      </div>
      <button className="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full border border-token-border-heavy bg-token-main-surface-secondary p-0.5 text-token-text-primary transition-colors hover:opacity-100 group-hover:opacity-100 md:opacity-0" onClick={() => onRemove(file.id)}>
        <span data-state="closed">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-sm">
            <path fill="currentColor" fillRule="evenodd" d="M5.636 5.636a1 1 0 0 1 1.414 0l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414L13.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 0 1-1.414-1.414l4.95-4.95-4.95-4.95a1 1 0 0 1 0-1.414" clipRule="evenodd"></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default FilePreview;