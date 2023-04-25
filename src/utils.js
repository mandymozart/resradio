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

export const DATE_FORMAT = "D.M.YYYY";

let day = "";
let count = 0;
export const getWeekdayHeadline = (begin) => {
  const d = dayjs(begin).format(`ddd, ${DATE_FORMAT}`);
  count++;
  if (day !== d && count === 1) {
    day = d;
    return (<h4>{d}</h4>)
  } else {
    count = 0;
    return (<></>);
  }

}

/** trim format h:mm if it has zeros in the minutes 
     * @params date: dayjs object
    */
export const trimZeros = (date) => {
  const time = date.format("h:mm");
  if (time.slice(-3) === ":00")
    return time.substring(0, time.length - 3);
  else return time;
}