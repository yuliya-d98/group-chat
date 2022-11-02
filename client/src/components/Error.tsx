import React, { memo } from 'react';

const Error = memo(() => {
  return (
    <div className="messages">
      <p className="messages__text">Error</p>
    </div>
  );
});

export default Error;
