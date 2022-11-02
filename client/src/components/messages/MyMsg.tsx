import { FC, memo } from 'react';
import { MessageInfo } from '../../typings/typings';
import { getDate } from '../../utils/getDate';

const MyMsg: FC<MessageInfo> = memo(({ text, date }) => {
  return (
    <div className="messages__msgs_item my-msg">
      <div className="messages__msgs_item_texts">
        <p className="messages__msgs_item_texts_text">{text}</p>
        <p className="messages__msgs_item_texts_time">{getDate(date)}</p>
      </div>
    </div>
  );
});

export default MyMsg;
