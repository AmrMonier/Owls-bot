export const getRemainingTime = () => {
  const availableTime = new Date();
  if (availableTime.getHours() < 18) {
    availableTime.setHours(18, 0, 0);
  } else {
    availableTime.setDate(availableTime.getDate() + 1);
    availableTime.setHours(6, 0, 0);
  }
  const remainingTime = new Date(availableTime.getTime() - Date.now());
  const remainingTimeString = `${remainingTime
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${remainingTime
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:${remainingTime
    .getUTCSeconds()
    .toString()
    .padStart(2, "0")}`;
  return `Shh Owls are sleeping: ${remainingTimeString}.`;
};

