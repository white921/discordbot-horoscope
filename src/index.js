import "dotenv/config";
import {
  ActionRowBuilder,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  StringSelectMenuBuilder
} from "discord.js";
import { buildHoroscope, SIGNS } from "./fortune.js";

const token = process.env.DISCORD_TOKEN;
const HOROSCOPE_PANEL_ID = "horoscope-panel";

if (!token) {
  throw new Error("DISCORD_TOKEN is required.");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

function buildHoroscopeEmbed(sign) {
  const horoscope = buildHoroscope(sign);

  return new EmbedBuilder()
    .setColor(0xf5a623)
    .setTitle(`${horoscope.sign}の今日の占い`)
    .setDescription(`順位: **${horoscope.ranking}位 / 12位**`)
    .addFields(
      {
        name: "運勢",
        value: horoscope.scoreLines.join("\n")
      },
      {
        name: "ラッキーカラー",
        value: horoscope.luckyColor,
        inline: true
      },
      {
        name: "ラッキーアイテム",
        value: horoscope.luckyItem,
        inline: true
      },
      {
        name: "ひとこと",
        value: horoscope.advice
      }
    )
    .setFooter({
      text: `${horoscope.dateKey} の結果です`
    });
}

function buildHoroscopePanel() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(HOROSCOPE_PANEL_ID)
    .setPlaceholder("星座を選んで今日の占いを見る")
    .addOptions(
      SIGNS.map((sign) => ({
        label: sign,
        value: sign
      }))
    );

  return new ActionRowBuilder().addComponents(menu);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "uranai") {
      const sign = interaction.options.getString("seiza", true);
      await interaction.reply({ embeds: [buildHoroscopeEmbed(sign)] });
      return;
    }

    if (interaction.commandName === "uranai-panel") {
      await interaction.reply({
        content: "星座を選ぶと、今日の占いを表示します。",
        components: [buildHoroscopePanel()]
      });
    }

    return;
  }

  if (interaction.isStringSelectMenu() && interaction.customId === HOROSCOPE_PANEL_ID) {
    const sign = interaction.values[0];
    await interaction.reply({
      embeds: [buildHoroscopeEmbed(sign)],
      ephemeral: true
    });
  }
});

client.login(token);
