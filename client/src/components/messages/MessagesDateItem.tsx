import { FC } from 'react';

type DateItemProps = {
  date: string;
};
const MessagesDateItem: FC<DateItemProps> = ({ date }) => {
  return <p className="messages__msgs_date">{date}</p>;
};

export default MessagesDateItem;
