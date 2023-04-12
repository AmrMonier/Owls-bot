import { Client, IntentsBitField, Role, TextChannel } from "discord.js";
import { config } from "dotenv";
import { Cron } from "croner";
import { getRemainingTime, sendRemainingTime } from "./utils";
config();

import { KeepAlive } from "./server";
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
  ],
});

// Open Owls
Cron(
  "0 18 * * *",
  async () => {
    console.log("Owls Opened");
    const channel = (await client.channels.fetch(
      process.env.CHANNEL_ID!
    )) as TextChannel;
    const nightOWlRole = channel.guild?.roles.cache.find(
      (role) => role.name === "night-owl"
    );
    channel.permissionOverwrites.create(nightOWlRole!, {
      SendMessages: true,
      ViewChannel: true,
    });
    let messages = await channel.messages.fetch({ limit: 100 });
    while (messages.size > 0) {
      await channel.bulkDelete(messages);
      messages = await channel.messages.fetch({ limit: 100 });
    }
  },
  {
    timezone: "Africa/Cairo",
  }
);

// Close Owls
Cron(
  "0 6 * * *",
  async () => {
    console.log("Owls Closed");
    const channel = (await client.channels.fetch(
      process.env.CHANNEL_ID!
    )) as TextChannel;
    const nightOWlRole = channel.guild?.roles.cache.find(
      (role) => role.name === "night-owl"
    );
    channel.permissionOverwrites.create(nightOWlRole!, {
      SendMessages: false,
      ViewChannel: true,
    });
    sendRemainingTime(channel);
  },
  {
    timezone: "Africa/Cairo",
  }
);

client.on("ready", async function () {
  console.log(`Logged in as ${client.user?.tag}`);

  const guild = client.guilds.cache.get(process.env.GUILD_ID!);

  let nightOWlRole = guild?.roles.cache.find(
    (role) => role.name === "night-owl"
  );

  if (!nightOWlRole) {
    nightOWlRole = await guild?.roles.create({
      name: "night-owl",
      color: "DarkPurple",
      permissions: ["SendMessages"],
    });
  }

  await guild?.members.fetch({ withPresences: false });
  guild?.members.cache.map((member) => {
    member.roles.add(nightOWlRole?.id!);
  });
  guild?.members.cache.clear();
  const channel = (await client.channels.fetch(
    process.env.CHANNEL_ID!
  )) as TextChannel;
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18);
  channel.permissionOverwrites.create(nightOWlRole!, {
    SendMessages: now.getTime() > target.getTime(),
    ViewChannel: true,
  });

  if (now.getTime() < target.getTime()) {
    sendRemainingTime(channel);
  }
});

// client.on("messageCreate", async (message) => {
//   console.log(
//     `ChannelId: ${message.channelId}, ChannelName: ${
//       (message.channel as TextChannel)?.name
//     } content: ${message.content}
//     server: ${message.guildId}`
//   );
// });

// Grant night-owl Role to new Users
client.on("guildMemberAdd", (member) => {
  const nightOWlRole = member.guild?.roles.cache.find(
    (role) => role.name === "night-owl"
  );
  member.roles.add(nightOWlRole?.id!);
});
client.login(process.env.BOT_TOKEN);
console.log(getRemainingTime().msg);
KeepAlive();
