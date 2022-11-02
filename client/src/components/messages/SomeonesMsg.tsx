import { FC, memo, useRef, useEffect } from 'react';
import { MessageInfo } from '../../typings/typings';
import { getDate } from '../../utils/getDate';
import { imageSrc } from '../../utils/imageSrc';

type SomeonesMsgProps = {
  msgs: MessageInfo[];
};

const SomeonesMsg: FC<SomeonesMsgProps> = memo(({ msgs }) => {
  const item = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item && item.current) {
      item.current.scrollIntoView(false);
    }
  }, [item]);

  return (
    <div className="messages__msgs_item someone-msg" ref={item}>
      <img src={imageSrc(msgs[0].author.photo)} className="messages__msgs_item_avatar" />
      <div>
        <div className="messages__msgs_items">
          {msgs.map(({ text, date, _id, author }, i) => {
            return (
              <div className="messages__msgs_item_texts" key={_id}>
                {i === 0 && <p className="messages__msgs_item_texts_name">{author.name}</p>}
                <p className="messages__msgs_item_texts_text">{text}</p>
                <p className="messages__msgs_item_texts_time">{getDate(date)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default SomeonesMsg;
