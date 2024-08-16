export const removeQuotes = (str: string) => {
  return str.replace(/(^"|"$|^'|'$)/g, '');
}

export const secToMinSec = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = (sec - m * 60);
  const secs = s < 9 ? '0' + s.toFixed(0) : s.toFixed(0);
  return `${m.toFixed(0)}:${secs}`;
}

export const getFormattedTime = () => {
  const date = new Date();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes <= 9) {
    return `${hours.toString()}:0${minutes.toString()}`;
  } else {
    return `${hours.toString()}:${minutes.toString()}`;
  }
}
