import { FC } from 'react';

const SomeonesMsg: FC = () => {
  return (
    <div className="messages__msgs_item someone-msg">
      <img src="../assets/img/groupImage.png" className="messages__msgs_item_avatar" />
      <div className="messages__msgs_item_texts">
        <p className="messages__msgs_item_texts_text">message 1</p>
        <p className="messages__msgs_item_texts_time">16:45</p>
      </div>
    </div>
  );
};

export default SomeonesMsg;
