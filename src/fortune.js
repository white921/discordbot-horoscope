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

export const FLOWERS = [
  "さくら",
  "ひまわり",
  "バラ",
  "チューリップ",
  "あじさい",
  "コスモス",
  "カスミソウ",
  "ガーベラ",
  "スイートピー",
  "ラベンダー",
  "スズラン",
  "ダリア"
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

const OMIKUJI_RESULTS = [
  {
    name: "大吉",
    description: "追い風の強い日です。迷ったら前向きな方を選ぶと流れに乗れます。"
  },
  {
    name: "中吉",
    description: "安定した運気です。丁寧に進めるほど良さが積み上がります。"
  },
  {
    name: "小吉",
    description: "小さな幸運が見つかる日です。見落としていたチャンスに注目です。"
  },
  {
    name: "吉",
    description: "堅実さが光ります。無理をしない選択が良い結果につながります。"
  },
  {
    name: "末吉",
    description: "後半から流れが上向きます。朝はゆっくり整えると吉です。"
  }
];

const OMIKUJI_WISH = [
  "焦らず整えると願いが形になっていきます。",
  "ひとりで抱えず相談すると前進できます。",
  "準備していたことに良い返事が来そうです。",
  "少し遠回りでも確実な道が正解です。",
  "今日の一歩が来週の安心につながります。"
];

const OMIKUJI_LOVE = [
  "素直な言葉が関係をやわらかくします。",
  "連絡は短くても温度が伝わる内容が吉です。",
  "相手のペースを尊重すると距離が縮まります。",
  "気負わない会話がいちばん魅力的に映ります。",
  "いつもより少しだけ勇気を出す価値があります。"
];

const OMIKUJI_WORK = [
  "優先順位を言葉にすると作業が進みます。",
  "確認を一回多めにすると信頼につながります。",
  "単独作業より相談ベースで進めると吉です。",
  "午後に集中の波が来そうです。",
  "細かい改善が大きな手応えになります。"
];

const FLOWER_MEANINGS = {
  "さくら": "やわらかな始まり",
  "ひまわり": "まっすぐな情熱",
  "バラ": "心の華やぎ",
  "チューリップ": "素直な優しさ",
  "あじさい": "気持ちの深まり",
  "コスモス": "自然体の魅力",
  "カスミソウ": "そっと支える愛情",
  "ガーベラ": "前向きな希望",
  "スイートピー": "門出とときめき",
  "ラベンダー": "静かな癒し",
  "スズラン": "幸せの訪れ",
  "ダリア": "自信と気品"
};

const FLOWER_MOODS = [
  "つぼみがほどけるように、少しずつ良い空気に変わります。",
  "無理に急がず、自然に花開くタイミングを待つのが吉です。",
  "今日は周りからのやさしさを受け取りやすい日です。",
  "一輪の存在感のように、自分らしさがちゃんと伝わります。",
  "気持ちを整えるほど運気の色合いが明るくなります。"
];

const FLOWER_LOVE = [
  "気になる相手には、やわらかい言葉選びが効きます。",
  "自分から少し歩み寄ると会話が続きやすくなります。",
  "安心感を与えるふるまいが魅力になります。",
  "飾らない表情がいちばん印象に残ります。",
  "恋愛は急展開より、じんわり深まる流れです。"
];

const FLOWER_ACTIONS = [
  "机まわりに明るい色をひとつ置く",
  "外の空気を吸いながら短く散歩する",
  "気になっていた人へ一言だけ連絡する",
  "お気に入りの飲み物で一度気持ちを整える",
  "今日やることを三つだけメモする"
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

function dateKeyOf(date) {
  return date.toISOString().slice(0, 10);
}

export function buildHoroscope(sign, date = new Date()) {
  if (!SIGNS.includes(sign)) {
    throw new Error(`Unknown sign: ${sign}`);
  }

  const dateKey = dateKeyOf(date);
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

export function buildOmikuji(date = new Date()) {
  const dateKey = dateKeyOf(date);
  const seed = hashToNumber(`${dateKey}:omikuji`);
  const result = pickFrom(OMIKUJI_RESULTS, seed);

  return {
    dateKey,
    result: result.name,
    description: result.description,
    wish: pickFrom(OMIKUJI_WISH, seed, 3),
    love: pickFrom(OMIKUJI_LOVE, seed, 7),
    work: pickFrom(OMIKUJI_WORK, seed, 11),
    luckyColor: pickFrom(COLORS, seed, 13),
    luckyItem: pickFrom(ITEMS, seed, 17)
  };
}

export function buildFlowerFortune(flower, date = new Date()) {
  if (!FLOWERS.includes(flower)) {
    throw new Error(`Unknown flower: ${flower}`);
  }

  const dateKey = dateKeyOf(date);
  const seed = hashToNumber(`${dateKey}:${flower}:flower`);

  return {
    dateKey,
    flower,
    meaning: FLOWER_MEANINGS[flower],
    mood: pickFrom(FLOWER_MOODS, seed, 5),
    love: pickFrom(FLOWER_LOVE, seed, 9),
    luckyAction: pickFrom(FLOWER_ACTIONS, seed, 13),
    luckyColor: pickFrom(COLORS, seed, 17)
  };
}
