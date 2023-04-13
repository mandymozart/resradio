import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const shuffle = (array) => {
  var currentIndex = array.length,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

let day = "";
let count = 0;
export const getWeekdayHeadline = (begin) => {
  const d = dayjs(begin).format('ddd, DD.MM.YYYY');
  count++;
  if (day !== d && count === 1) {
    day = d;
    return (<h4>{d}</h4>)
  } else {
    count = 0;
    return (<></>);
  }

}