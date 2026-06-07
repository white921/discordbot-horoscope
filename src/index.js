import "dotenv/config";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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

function buildFortuneTypeIntroEmbed() {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("今日の占いを選ぼう")
    .setDescription("気になる占いをひとつ選ぶと、次のメニューや結果を表示します。")
    .addFields(
      {
        name: "星座占い",
        value: "12星座から選んで、総合運や恋愛運、仕事運をバランスよく見られます。"
      },
      {
        name: "おみくじ",
        value: "すぐに結果を引きたいとき向けです。今日の流れを手軽にチェックできます。"
      },
      {
        name: "花占い",
        value: "好きな花を選んで、気分や恋の流れをやわらかい雰囲気で楽しめます。"
      }
    );
}

function buildFortuneTypePanel() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${FORTUNE_TYPE_PANEL_ID}:horoscope`)
      .setLabel("星座占い")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`${FORTUNE_TYPE_PANEL_ID}:omikuji`)
      .setLabel("おみくじ")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`${FORTUNE_TYPE_PANEL_ID}:flower`)
      .setLabel("花占い")
      .setStyle(ButtonStyle.Secondary)
  );
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
        embeds: [buildFortuneTypeIntroEmbed()],
        components: [buildFortuneTypePanel()]
      });
    }

    return;
  }

  if (interaction.isButton() && interaction.customId.startsWith(`${FORTUNE_TYPE_PANEL_ID}:`)) {
    const selectedType = interaction.customId.split(":")[1];

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

  if (interaction.isStringSelectMenu()) {
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
