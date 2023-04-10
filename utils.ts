import { TextChannel } from "discord.js";

export const getRemainingTime = () => {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18);
  const diff = target.getTime() - now.getTime();
  let hours = Math.floor(diff / 3600000)
    .toString()
    .padStart(2, "0");
  let minutes = Math.floor((diff % 3600000) / 60000)
    .toString()
    .padStart(2, "0");
  let seconds = Math.floor((diff % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  const remainingTimeString = `${hours}:${minutes}:${seconds}`;
  return {
    msg: `[🦉] Shh Owls are sleeping: ${remainingTimeString}.`,
    time: diff,
  };
  // return `Shh Owls are sleeping: ${remainingTimeString}.`;
};

export const sendRemainingTime = async (channel: TextChannel) => {
  const messages = await channel.messages.fetch();
  await channel?.bulkDelete(messages);
  const { threads } = await channel.threads.fetch();

  threads.forEach(async (thread) => {
    await thread.delete();
  });
  const { msg } = getRemainingTime();
  const message = await channel?.send(msg);

  const intervalId = setInterval(async () => {
    try {
      if (message) {
        await message.edit({ content: getRemainingTime().msg });
      }
    } catch (error) {
      console.error(error);
      clearInterval(intervalId);
    }
  }, 5000);
  setTimeout(() => {
    clearInterval(intervalId);
  }, getRemainingTime().time);
};
