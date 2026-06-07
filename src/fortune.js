import crypto from "node:crypto";

export const SIGNS = [
  "おひつじ座",
  "おうし座",
  "ふたご座",
  "かに座",
  "しし座",
  "おとめ座",
  "てんびん座",
  "さそり座",
  "いて座",
  "やぎ座",
  "みずがめ座",
  "うお座"
];

const COLORS = [
  "ルビー",
  "サンフラワー",
  "エメラルド",
  "スカイブルー",
  "コーラル",
  "ラベンダー",
  "シルバー",
  "ネイビー",
  "ミント",
  "アイボリー",
  "オレンジ",
  "ボルドー"
];

const ITEMS = [
  "ノート",
  "イヤホン",
  "マグカップ",
  "ハンカチ",
  "腕時計",
  "小さなお菓子",
  "文庫本",
  "スマホスタンド",
  "ペン",
  "リュック",
  "ミネラルウォーター",
  "観葉植物"
];

const ADVICE = [
  "迷ったら先に小さく動くと流れが変わります。",
  "今日は無理に答えを急がず、会話を丁寧に。",
  "周りの期待より、自分のペースを優先すると吉です。",
  "ひとつ片付けるだけで気持ちがかなり軽くなります。",
  "思いつきをメモしておくと後で役立ちます。",
  "頼られる場面では、背伸びせず自然体がいちばんです。",
  "新しいことより、続けていることに追い風があります。",
  "少し休む判断が、結果的に良い流れを呼びます。",
  "人にやさしくすると、そのまま自分にも返ってきます。",
  "今日は準備の質がそのまま成果につながりそうです。",
  "タイミングは遅く見えても、着実に前進しています。",
  "いつもより明るい返事が良い縁を運んできます。"
];

const CATEGORY_LABELS = {
  overall: "総合運",
  love: "恋愛運",
  work: "仕事運",
  health: "健康運"
};

function hashToNumber(input) {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return Number.parseInt(hash.slice(0, 12), 16);
}

function pickFrom(list, seed, offset = 0) {
  return list[(seed + offset) % list.length];
}

function score(seed, offset = 0) {
  return 1 + ((seed + offset) % 5);
}

function scoreBar(value) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}

export function buildHoroscope(sign, date = new Date()) {
  if (!SIGNS.includes(sign)) {
    throw new Error(`Unknown sign: ${sign}`);
  }

  const dateKey = date.toISOString().slice(0, 10);
  const seed = hashToNumber(`${dateKey}:${sign}`);
  const ranking = 1 + (seed % 12);

  const scores = {
    overall: score(seed, 3),
    love: score(seed, 7),
    work: score(seed, 11),
    health: score(seed, 17)
  };

  const lines = Object.entries(scores).map(([key, value]) => {
    return `${CATEGORY_LABELS[key]}: ${scoreBar(value)}`;
  });

  return {
    sign,
    dateKey,
    ranking,
    luckyColor: pickFrom(COLORS, seed, 5),
    luckyItem: pickFrom(ITEMS, seed, 9),
    advice: pickFrom(ADVICE, seed, 13),
    scoreLines: lines
  };
}
