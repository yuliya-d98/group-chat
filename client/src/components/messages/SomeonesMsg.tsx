import { FC, memo } from 'react';
import { MessageInfo } from '../../typings/typings';
import { getDate } from '../../utils/getDate';
import { imageSrc } from '../../utils/imageSrc';

const SomeonesMsg: FC<MessageInfo> = memo(({ text, date, author }) => {
  return (
    <div className="messages__msgs_item someone-msg">
      <img src={imageSrc(author.photo)} className="messages__msgs_item_avatar" />
      <div>
        <i className="messages__msgs_item_texts_time">{author.name}</i>
        <div className="messages__msgs_item_texts">
          <p className="messages__msgs_item_texts_text">{text}</p>
          <p className="messages__msgs_item_texts_time">{getDate(date)}</p>
        </div>
      </div>
    </div>
  );
});

export default SomeonesMsg;
