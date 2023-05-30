import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DATE_FORMAT } from "./config";
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
  return date.format("HH:mm");
  // const time = date.format("h:mm");
  // if (time.slice(-3) === ":00")
  //   return time.substring(0, time.length - 3);
  // else return time;
}

export const secondsToMinutes = (seconds) => {
  return seconds;
  // let computeMinutes = Math.floor(seconds / 60);
  // let result = seconds % 60;
  // return computeMinutes.toString().padStart(2, '0') + ":" + result.toString().padStart(2, '0').substring(0, 2);
}

export const getTimeRangeString = (begin, end) => {
  return trimZeros(dayjs(begin)) + `—` + trimZeros(dayjs(end));
}

/**
 * Get api request params for url
 * @param {*} params
 * @returns
 */
export const getQueryString = (params) => {
  return Object.keys(params)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
};