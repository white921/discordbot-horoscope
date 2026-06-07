import "dotenv/config";
import {
  PermissionFlagsBits,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";
import { SIGNS } from "./fortune.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error("DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID are required.");
}

const commands = [
  new SlashCommandBuilder()
    .setName("uranai")
    .setDescription("今日の星座占いを表示します")
    .addStringOption((option) =>
      option
        .setName("seiza")
        .setDescription("あなたの星座を選んでください")
        .setRequired(true)
        .addChoices(...SIGNS.map((sign) => ({ name: sign, value: sign })))
    ),
  new SlashCommandBuilder()
    .setName("uranai-panel")
    .setDescription("星座占いパネルをこのチャンネルに投稿します")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
  body: commands
});

console.log(`Registered ${commands.length} command(s) for guild ${guildId}.`);
