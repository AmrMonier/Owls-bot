import { TextChannel } from "discord.js";

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

export const sendRemainingTime = async (channel: TextChannel) => {
  const messages = await channel.messages.fetch();
  await channel?.bulkDelete(messages);
  const msg = await channel?.send(getRemainingTime());
  const intervalId = setInterval(() => {
    console.log("===");

    try {
      const now = new Date();
      const closeHours = new Date();
      closeHours.setHours(18);
      closeHours.setMinutes(0);
      closeHours.setSeconds(0);
      closeHours.setMilliseconds(0);
      if (now >= closeHours) {
        clearInterval(intervalId);
        return;
      }
      if (msg) {
        msg.edit(getRemainingTime());
      }
    } catch (error) {
      console.error(error);
      clearInterval(intervalId);
    }
  }, 5000);
};
