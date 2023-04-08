import { channel } from "diagnostics_channel";
import { Client, IntentsBitField, Role, TextChannel } from "discord.js";
import { config } from "dotenv";
import { schedule } from "node-cron";
import { getRemainingTime } from "./utils";
config();
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

let nightOWlRole: Role;
// Open Owls
schedule(
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
    const messages = await channel.messages.fetch();
    await channel?.bulkDelete(messages);
    
  },
  {
    timezone: "Africa/Cairo",
  }
);

// Close Owls
schedule(
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
    const messages = await channel.messages.fetch();
    await channel?.bulkDelete(messages);
    const msg = await channel?.send(getRemainingTime());
    const intervalId = setInterval(() => {
      const now = new Date();
      const closeHours = new Date();
      closeHours.setHours(18);
      closeHours.setMinutes(0);
      closeHours.setSeconds(0);
      closeHours.setMilliseconds(0);
      if (now >= closeHours) {
        clearInterval(intervalId);
      }
      msg.edit(getRemainingTime());
    }, 5000);
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
  
  const channel = (await client.channels.fetch(
    process.env.CHANNEL_ID!
  )) as TextChannel;
  channel.permissionOverwrites.create(nightOWlRole!, {
    SendMessages: false,
    ViewChannel: true,
  });
  
});

client.on("messageCreate", async (message) => {
  console.log(
    `ChannelId: ${message.channelId}, ChannelName: ${
      (message.channel as TextChannel)?.name
    }`
  );
});

// Grant night-owl Role to new Users
client.on("guildMemberAdd", (member) => {
  const nightOWlRole = member.guild?.roles.cache.find(
    (role) => role.name === "night-owl"
  );
  member.roles.add(nightOWlRole?.id!);
});
client.login(process.env.BOT_TOKEN);

console.log(getRemainingTime());