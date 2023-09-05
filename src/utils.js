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

export const getBaseURL = () => {
  return window.location.protocol + "//" + window.location.host;
}

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

export const roundTo = (n, place) => {
  return +(Math.round(n + "e+" + place) + "e-" + place);
}

export const formatTime = (time) => {
  if (time && !isNaN(time)) {
    const days = Math.floor(time / 86400);
    const formatDays = days < 10 ? `0${days}` : `${days}`;
    const hours = Math.floor((time % 86400) / 3600);
    const formatHours = hours < 10 ? `0${hours}` : `${hours}`;
    const minutes = Math.floor((time % 3600) / 60);
    const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(time % 60);
    const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    if (days > 0) {
      return `${formatDays}:${formatHours}:${formatMinutes}:${formatSeconds}`;
    } else if (hours > 0) {
      return `${formatHours}:${formatMinutes}:${formatSeconds}`;
    } else {
      return `${formatMinutes}:${formatSeconds}`;
    }
  }

  return '00:00';
};

export const convertToZuluTimeString = (dayjsObject) => {
  // Ensure the input is a dayjs object
  if (!dayjsObject || !dayjsObject.isValid()) {
    throw new Error('Input must be a valid dayjs object.');
  }

  // Convert the dayjs object to a JavaScript Date object
  const date = dayjsObject.toDate();

  // Convert the Date to an ISO 8601 formatted string in UTC (Zulu) time
  const zuluTimeString = date.toISOString();

  // Remove milliseconds and add 'Z' to indicate Zulu time
  const sanitizedZuluTimeString = zuluTimeString.slice(0, -5) + 'Z';

  return sanitizedZuluTimeString;
}

/**
 * 
 * @param {number} seconds 
 * @returns {string}
 */
export const secondsToMinutes = (seconds) => {
  // return seconds;
  // let computeMinutes = Math.floor(seconds / 60);
  // let result = seconds % 60;
  // return computeMinutes.toString().padStart(2, '0') + ":" + result.toString().padStart(2, '0').substring(0, 2);
  let minutes = Math.floor(seconds / 60);
  let extraSeconds = seconds % 60;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
  return minutes + ":" + roundTo(extraSeconds, 0).toString().padStart(2, '0');
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