import React, { memo } from 'react';

const Welcome = memo(() => {
  return (
    <div className="messages">
      <p className="messages__text">Please open any dialog</p>
    </div>
  );
});

export default Welcome;
