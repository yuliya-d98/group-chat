const getTwoNumbers = (value: number) => {
  const result = value < 10 ? `0${value}` : value;
  return result;
};

export const getDate = (date: string) => {
  const dateD = new Date(date);
  const hours = getTwoNumbers(dateD.getHours());
  const mins = getTwoNumbers(dateD.getMinutes());
  return `${hours}:${mins}`;
};
