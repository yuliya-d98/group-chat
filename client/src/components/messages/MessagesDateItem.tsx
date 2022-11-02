import { FC, memo } from 'react';

type DateItemProps = {
  text: string;
};
const MessagesDateItem: FC<DateItemProps> = memo(({ text }) => {
  const date = new Date(text);
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const year = date.getFullYear();
  const string = `${day}/${month}/${year}`;
  return <p className="messages__msgs_date">{string}</p>;
});

export default MessagesDateItem;
