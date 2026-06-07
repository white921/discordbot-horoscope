import "dotenv/config";
import {
  ActionRowBuilder,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  StringSelectMenuBuilder
} from "discord.js";
import {
  buildFlowerFortune,
  buildHoroscope,
  buildOmikuji,
  FLOWERS,
  SIGNS
} from "./fortune.js";

const token = process.env.DISCORD_TOKEN;
const FORTUNE_TYPE_PANEL_ID = "fortune-type-panel";
const HOROSCOPE_PANEL_ID = "horoscope-panel";
const FLOWER_PANEL_ID = "flower-panel";

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

function buildOmikujiEmbed() {
  const omikuji = buildOmikuji();

  return new EmbedBuilder()
    .setColor(0xd35400)
    .setTitle(`今日のおみくじ: ${omikuji.result}`)
    .setDescription(omikuji.description)
    .addFields(
      {
        name: "願いごと",
        value: omikuji.wish
      },
      {
        name: "恋愛",
        value: omikuji.love
      },
      {
        name: "仕事",
        value: omikuji.work
      },
      {
        name: "ラッキーカラー",
        value: omikuji.luckyColor,
        inline: true
      },
      {
        name: "ラッキーアイテム",
        value: omikuji.luckyItem,
        inline: true
      }
    )
    .setFooter({
      text: `${omikuji.dateKey} の結果です`
    });
}

function buildFlowerFortuneEmbed(flower) {
  const fortune = buildFlowerFortune(flower);

  return new EmbedBuilder()
    .setColor(0xe67ab1)
    .setTitle(`${fortune.flower}の花占い`)
    .setDescription(`花ことば: **${fortune.meaning}**`)
    .addFields(
      {
        name: "今日の流れ",
        value: fortune.mood
      },
      {
        name: "恋の気配",
        value: fortune.love
      },
      {
        name: "ラッキーアクション",
        value: fortune.luckyAction
      },
      {
        name: "ラッキーカラー",
        value: fortune.luckyColor,
        inline: true
      }
    )
    .setFooter({
      text: `${fortune.dateKey} の結果です`
    });
}

function buildFortuneTypePanel() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(FORTUNE_TYPE_PANEL_ID)
    .setPlaceholder("遊びたい占いを選ぶ")
    .addOptions([
      {
        label: "星座占い",
        value: "horoscope",
        description: "12星座から選んで今日の運勢を見る"
      },
      {
        label: "おみくじ",
        value: "omikuji",
        description: "今日の運勢をさっと引く"
      },
      {
        label: "花占い",
        value: "flower",
        description: "好きな花を選んで恋や気分の流れを見る"
      }
    ]);

  return new ActionRowBuilder().addComponents(menu);
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

function buildFlowerPanel() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(FLOWER_PANEL_ID)
    .setPlaceholder("花を選んで今日の花占いを見る")
    .addOptions(
      FLOWERS.map((flower) => ({
        label: flower,
        value: flower
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
        content: "遊びたい占いを選ぶと、次のメニューや結果を表示します。",
        components: [buildFortuneTypePanel()]
      });
    }

    return;
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === FORTUNE_TYPE_PANEL_ID) {
      const selectedType = interaction.values[0];

      if (selectedType === "horoscope") {
        await interaction.reply({
          content: "星座を選ぶと、あなただけに結果を表示します。",
          components: [buildHoroscopePanel()],
          ephemeral: true
        });
        return;
      }

      if (selectedType === "omikuji") {
        await interaction.reply({
          embeds: [buildOmikujiEmbed()],
          ephemeral: true
        });
        return;
      }

      if (selectedType === "flower") {
        await interaction.reply({
          content: "花を選ぶと、あなただけに結果を表示します。",
          components: [buildFlowerPanel()],
          ephemeral: true
        });
      }

      return;
    }

    if (interaction.customId === HOROSCOPE_PANEL_ID) {
      const sign = interaction.values[0];
      await interaction.reply({
        embeds: [buildHoroscopeEmbed(sign)],
        ephemeral: true
      });
      return;
    }

    if (interaction.customId === FLOWER_PANEL_ID) {
      const flower = interaction.values[0];
      await interaction.reply({
        embeds: [buildFlowerFortuneEmbed(flower)],
        ephemeral: true
      });
    }
  }
});

client.login(token);
