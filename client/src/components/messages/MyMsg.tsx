import { FC, memo, useEffect, useRef } from 'react';
import { MessageInfo } from '../../typings/typings';
import { getDate } from '../../utils/getDate';

type MyMsgProps = {
  msgs: MessageInfo[];
};

const MyMsg: FC<MyMsgProps> = memo(({ msgs }) => {
  const item = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item && item.current) {
      item.current.scrollIntoView(false);
    }
  }, [item]);

  return (
    <div className="messages__msgs_item my-msg" ref={item}>
      <div className="messages__msgs_items">
        {msgs.map(({ text, date, _id }) => {
          return (
            <div className="messages__msgs_item_texts" key={_id}>
              <p className="messages__msgs_item_texts_text">{text}</p>
              <p className="messages__msgs_item_texts_time">{getDate(date)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default MyMsg;
