var er = Object.defineProperty;
var tr = (r, e, t) => e in r ? er(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var pe = (r, e, t) => (tr(r, typeof e != "symbol" ? e + "" : e, t), t);
function rr(r, e) {
  for (var t = 0; t < e.length; t++) {
    const n = e[t];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const s in n)
        if (s !== "default" && !(s in r)) {
          const i = Object.getOwnPropertyDescriptor(n, s);
          i && Object.defineProperty(r, s, i.get ? i : {
            enumerable: !0,
            get: () => n[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }));
}
const d = {
  // OpenAI API Key
  API_KEY: null,
  // OpenAI的模型名称
  CHAT_MODEL: "gpt-3.5-turbo",
  // Notion info
  NOTION_API_KEY: null,
  NOTION_DATABASE_ID: null,
  SUPABASE_URL: null,
  SUPABASE_ANON_KEY: null,
  SUPABASE_STORAGE_BUCKET: null,
  STAR_NEXUS_HUB_API: null,
  // 允许访问的Telegram Token， 设置时以逗号分隔
  TELEGRAM_AVAILABLE_TOKENS: [],
  // 允许访问的Telegram Token 对应的Bot Name， 设置时以逗号分隔
  TELEGRAM_BOT_NAME: [],
  // 允许所有人使用
  I_AM_A_GENEROUS_PERSON: !1,
  // 白名单
  CHAT_WHITE_LIST: [],
  // 群组白名单
  CHAT_GROUP_WHITE_LIST: [],
  // 群组机器人开关
  GROUP_CHAT_BOT_ENABLE: !0,
  // 群组机器人共享模式,关闭后，一个群组只有一个会话和配置。开启的话群组的每个人都有自己的会话上下文
  GROUP_CHAT_BOT_SHARE_MODE: !1,
  // 为了避免4096字符限制，将消息删减
  AUTO_TRIM_HISTORY: !0,
  // 最大历史记录长度
  MAX_HISTORY_LENGTH: 20,
  // 最大消息长度
  MAX_TOKEN_LENGTH: 2048,
  // 使用GPT3的TOKEN计数
  GPT3_TOKENS_COUNT: !1,
  // 全局默认初始化消息
  SYSTEM_INIT_MESSAGE: "You are a helpful assistant",
  // 全局默认初始化消息角色
  SYSTEM_INIT_MESSAGE_ROLE: "system",
  // 是否开启使用统计
  ENABLE_USAGE_STATISTICS: !1,
  // 隐藏部分命令按钮
  HIDE_COMMAND_BUTTONS: ["/role"],
  // 检查更新的分支
  UPDATE_BRANCH: "main",
  // 当前版本
  BUILD_TIMESTAMP: "1684823847",
  // 当前版本 commit id
  BUILD_VERSION: "49a1d99",
  /**
  * @type {I18n}
  */
  I18N: null,
  // 语言
  LANGUAGE: "zh-cn",
  // DEBUG 专用
  // 调试模式
  DEBUG_MODE: !1,
  // 开发模式
  DEV_MODE: !1,
  // 本地调试专用
  TELEGRAM_API_DOMAIN: "https://api.telegram.org",
  OPENAI_API_DOMAIN: "https://api.openai.com"
}, Q = {
  PASSWORD_KEY: "chat_history_password",
  GROUP_TYPES: ["group", "supergroup"],
  USER_AGENT: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15"
};
let $ = null, nt = null;
const nr = {
  API_KEY: "string",
  NOTION_API_KEY: "string",
  NOTION_DATABASE_ID: "string",
  STAR_NEXUS_HUB_API: "string"
};
function sr(r, e) {
  $ = r.DATABASE, nt = r.API_GUARD;
  for (const t in d)
    if (r[t])
      switch (nr[t] || typeof d[t]) {
        case "number":
          d[t] = parseInt(r[t]) || d[t];
          break;
        case "boolean":
          d[t] = (r[t] || "false") === "true";
          break;
        case "string":
          d[t] = r[t];
          break;
        case "object":
          if (Array.isArray(d[t]))
            d[t] = r[t].split(",");
          else
            try {
              d[t] = JSON.parse(r[t]);
            } catch (n) {
              console.error(n);
            }
          break;
        default:
          d[t] = r[t];
          break;
      }
  r.TELEGRAM_TOKEN && !d.TELEGRAM_AVAILABLE_TOKENS.includes(r.TELEGRAM_TOKEN) && (r.BOT_NAME && d.TELEGRAM_AVAILABLE_TOKENS.length === d.TELEGRAM_BOT_NAME.length && d.TELEGRAM_BOT_NAME.push(r.BOT_NAME), d.TELEGRAM_AVAILABLE_TOKENS.push(r.TELEGRAM_TOKEN)), d.I18N = e((d.LANGUAGE || "cn").toLowerCase()), d.SYSTEM_INIT_MESSAGE = d.I18N.env.system_init_message;
}
const ir = /[a-zA-Z0-9_\u0392-\u03C9\u00C0-\u00FF\u0600-\u06FF\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g;
function We(r) {
  const e = r.match(ir);
  let t = 0;
  if (!e)
    return 0;
  for (let n = 0; n < e.length; n++)
    e[n].charCodeAt(0) >= 19968 ? t += e[n].length * 2 : t += 1;
  return t;
}
function or(r) {
  r = r.replace(/,+,/g, ", ");
  const e = /<img src="(.+)" \/>/g;
  r = r.replace(e, "![$1]($1)");
  const t = /<a href="(.+)">(.+)<\/a>/g;
  return r = r.replace(t, "[$2]($1)"), r = r.replace(/!\[.+?\]\(.+?\)/g, ""), r = r.replace(/<(?:.|\n)*?>/gm, ""), r = r.replace(/<\/(?:.|\n)*?>/gm, ""), r = r.replace(/#+\s/g, ""), r = r.replace(/\s+/g, " "), r = r.replace(/\n{2,}/g, `
`), r = r.trim(), r = hr(r), r;
}
function ar(r, e) {
  let t = r;
  if (r && Object.keys(e).length)
    for (const n in e)
      t = t.replaceAll(`{${n}}`, e[n]);
  return t;
}
const cr = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&#60;": "<",
  "&#62;": ">",
  "&le;": "≤",
  "&#8804;": "≤",
  "&ge;": "≥",
  "&#8805;": "≥",
  "&quot;": '"',
  "&#34;": '"',
  "&trade;": "™",
  "&#8482;": "™",
  "&asymp;": "≈",
  "&#8776;": "≈",
  "&ndash;": "-",
  "&#8211;": "-",
  "&mdash;": "—",
  "&#8212;": "—",
  "&copy;": "©",
  "&#169;": "©",
  "&reg;": "®",
  "&#174;": "®",
  "&ne;": "≠",
  "&#8800;": "≠",
  "&pound;": "£",
  "&#163;": "£",
  "&euro;": "€",
  "&#8364;": "€",
  "&deg;": "°",
  "&#176;": "°",
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&#160;": " "
};
function lr(r) {
  return r.replace(/(&amp;|&lt;|&#60;|&gt;|&#62;|&le;|&#8804;|&ge;|&#8805;|&quot;|&#34;|&trade;|&#8482;|&asymp;|&#8776;|&ndash;|&#8211;|&mdash;|&#8212;|&copy;|&#169;|&reg;|&#174;|&ne;|&#8800;|&pound;|&#163;|&euro;|&#8364;|&deg;|&#176;|&#39;|&apos;|&nbsp;|&#160;|&quot;|&#34;|&trade;|&#8482;|&asymp;|&#8776;|&ndash;|&#8211;|&mdash;|&#8212;|&copy;|&#169;|&reg;|&#174;|&ne;|&#8800;|&pound;|&#163;|&euro;|&#8364;|&deg;|&#176;|&#39;|&apos;|&nbsp;|&#160;)/g, (e) => cr[e] || e);
}
function hr(r) {
  return lr(r);
}
function kt(r) {
  let e = r.message || "";
  return r.data && (e += JSON.stringify(r.data)), e;
}
class ur {
  constructor() {
    // 用户配置
    pe(this, "USER_CONFIG", {
      // 系统初始化消息
      SYSTEM_INIT_MESSAGE: d.SYSTEM_INIT_MESSAGE,
      // OpenAI API 额外参数
      OPENAI_API_EXTRA_PARAMS: {},
      // OenAI API Key
      OPENAI_API_KEY: null
    });
    pe(this, "USER_DEFINE", {
      // 自定义角色
      ROLE: {}
    });
    // 当前聊天上下文
    pe(this, "CURRENT_CHAT_CONTEXT", {
      chat_id: null,
      reply_to_message_id: null,
      // 如果是群组，这个值为消息ID，否则为null
      parse_mode: "Markdown"
    });
    // 共享上下文
    pe(this, "SHARE_CONTEXT", {
      currentBotId: null,
      // 当前机器人 ID
      currentBotToken: null,
      // 当前机器人 Token
      currentBotName: null,
      // 当前机器人名称: xxx_bot
      chatHistoryKey: null,
      // history:chat_id:bot_id:(from_id)
      configStoreKey: null,
      // user_config:chat_id:bot_id:(from_id)
      groupAdminKey: null,
      // group_admin:group_id
      usageKey: null,
      // usage:bot_id
      chatType: null,
      // 会话场景, private/group/supergroup 等, 来源 message.chat.type
      chatId: null,
      // 会话 id, private 场景为发言人 id, group/supergroup 场景为群组 id
      speakerId: null,
      // 发言人 id
      role: null
      // 角色
    });
  }
  /**
   * @inner
   * @param {string | number} chatId
   * @param {string | number} replyToMessageId
   */
  _initChatContext(e, t) {
    this.CURRENT_CHAT_CONTEXT.chat_id = e, this.CURRENT_CHAT_CONTEXT.reply_to_message_id = t, t && (this.CURRENT_CHAT_CONTEXT.allow_sending_without_reply = !0);
  }
  //
  /**
   * 初始化用户配置
   *
   * @inner
   * @param {string} storeKey
   */
  async _initUserConfig(e) {
    try {
      const t = JSON.parse(await $.get(e));
      for (const n in t)
        n === "USER_DEFINE" && typeof this.USER_DEFINE == typeof t[n] ? this._initUserDefine(t[n]) : this.USER_CONFIG.hasOwnProperty(n) && typeof this.USER_CONFIG[n] == typeof t[n] && (this.USER_CONFIG[n] = t[n]);
    } catch (t) {
      console.error(t);
    }
  }
  /**
   * @inner
   * @param {object} userDefine
   */
  _initUserDefine(e) {
    for (const t in e)
      this.USER_DEFINE.hasOwnProperty(t) && typeof this.USER_DEFINE[t] == typeof e[t] && (this.USER_DEFINE[t] = e[t]);
  }
  /**
   * @param {Request} request
   */
  initTelegramContext(e) {
    const { pathname: t } = new URL(e.url), n = t.match(
      /^\/telegram\/(\d+:[A-Za-z0-9_-]{35})\/webhook/
    )[1], s = d.TELEGRAM_AVAILABLE_TOKENS.indexOf(n);
    if (s === -1)
      throw new Error("Token not allowed");
    this.SHARE_CONTEXT.currentBotToken = n, this.SHARE_CONTEXT.currentBotId = n.split(":")[0], d.TELEGRAM_BOT_NAME.length > s && (this.SHARE_CONTEXT.currentBotName = d.TELEGRAM_BOT_NAME[s]);
  }
  /**
   *
   * @inner
   * @param {TelegramMessage} message
   */
  async _initShareContext(e) {
    var c, l, a;
    this.SHARE_CONTEXT.usageKey = `usage:${this.SHARE_CONTEXT.currentBotId}`;
    const t = (c = e == null ? void 0 : e.chat) == null ? void 0 : c.id;
    if (t == null)
      throw new Error("Chat id not found");
    const n = this.SHARE_CONTEXT.currentBotId;
    let s = `history:${t}`, i = `user_config:${t}`, o = null;
    n && (s += `:${n}`, i += `:${n}`), Q.GROUP_TYPES.includes((l = e.chat) == null ? void 0 : l.type) && (!d.GROUP_CHAT_BOT_SHARE_MODE && e.from.id && (s += `:${e.from.id}`, i += `:${e.from.id}`), o = `group_admin:${t}`), this.SHARE_CONTEXT.chatHistoryKey = s, this.SHARE_CONTEXT.configStoreKey = i, this.SHARE_CONTEXT.groupAdminKey = o, this.SHARE_CONTEXT.chatType = (a = e.chat) == null ? void 0 : a.type, this.SHARE_CONTEXT.chatId = e.chat.id, this.SHARE_CONTEXT.speakerId = e.from.id || e.chat.id;
  }
  /**
   * @param {TelegramMessage} message
   * @return {Promise<void>}
   */
  async initContext(e) {
    var s, i;
    const t = (s = e == null ? void 0 : e.chat) == null ? void 0 : s.id, n = Q.GROUP_TYPES.includes((i = e.chat) == null ? void 0 : i.type) ? e.message_id : null;
    this._initChatContext(t, n), await this._initShareContext(e), await this._initUserConfig(this.SHARE_CONTEXT.configStoreKey);
  }
}
async function ft(r, e, t) {
  return await fetch(
    `${d.TELEGRAM_API_DOMAIN}/bot${e}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...t,
        text: r
      })
    }
  );
}
async function dr(r, e, t) {
  const n = t;
  if (r.length <= 4096) {
    const i = await ft(r, e, n);
    if (i.status === 200)
      return i;
  }
  const s = 4e3;
  n.parse_mode = "HTML";
  for (let i = 0; i < r.length; i += s) {
    const o = r.slice(i, i + s);
    await ft(`<pre>
${o}
</pre>`, e, n);
  }
  return new Response("Message batch send", { status: 200 });
}
function w(r) {
  return async (e) => dr(e, r.SHARE_CONTEXT.currentBotToken, r.CURRENT_CHAT_CONTEXT);
}
async function fr(r, e, t) {
  return await fetch(
    `${d.TELEGRAM_API_DOMAIN}/bot${e}/sendPhoto`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...t,
        photo: r,
        parse_mode: null
      })
    }
  );
}
function pr(r) {
  return (e) => fr(e, r.SHARE_CONTEXT.currentBotToken, r.CURRENT_CHAT_CONTEXT);
}
async function _r(r, e, t) {
  return await fetch(
    `${d.TELEGRAM_API_DOMAIN}/bot${e}/sendChatAction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: t,
        action: r
      })
    }
  ).then((n) => n.json());
}
function st(r) {
  return (e) => _r(e, r.SHARE_CONTEXT.currentBotToken, r.CURRENT_CHAT_CONTEXT.chat_id);
}
async function mr(r, e) {
  return await fetch(
    `${d.TELEGRAM_API_DOMAIN}/bot${r}/setWebhook`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: e
      })
    }
  ).then((t) => t.json());
}
async function gr(r, e, t, n) {
  let s;
  try {
    s = JSON.parse(await $.get(e));
  } catch (i) {
    return console.error(i), i.message;
  }
  if (!s || !Array.isArray(s) || s.length === 0) {
    const i = await vr(t, n);
    if (i == null)
      return null;
    s = i, await $.put(
      e,
      JSON.stringify(s),
      { expiration: Date.now() / 1e3 + 120 }
    );
  }
  for (let i = 0; i < s.length; i++) {
    const o = s[i];
    if (o.user.id === r)
      return o.status;
  }
  return "member";
}
function yr(r) {
  return (e) => gr(e, r.SHARE_CONTEXT.groupAdminKey, r.CURRENT_CHAT_CONTEXT.chat_id, r.SHARE_CONTEXT.currentBotToken);
}
async function vr(r, e) {
  try {
    const t = await fetch(
      `${d.TELEGRAM_API_DOMAIN}/bot${e}/getChatAdministrators`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chat_id: r })
      }
    ).then((n) => n.json());
    if (t.ok)
      return t.result;
  } catch (t) {
    return console.error(t), null;
  }
}
async function br(r) {
  const e = await fetch(
    `${d.TELEGRAM_API_DOMAIN}/bot${r}/getMe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }
  ).then((t) => t.json());
  return e.ok ? {
    ok: !0,
    info: {
      name: e.result.first_name,
      bot_name: e.result.username,
      can_join_groups: e.result.can_join_groups,
      can_read_all_group_messages: e.result.can_read_all_group_messages
    }
  } : e;
}
async function pt(r, e) {
  try {
    const t = await $.get(r);
    if (t && t !== "")
      return t;
  } catch (t) {
    console.error(t);
  }
  try {
    const t = await fetch(e, {
      headers: {
        "User-Agent": Q.USER_AGENT
      }
    }).then((n) => n.text());
    return await $.put(r, t), t;
  } catch (t) {
    console.error(t);
  }
  return null;
}
async function jt() {
  const r = "https://raw.githubusercontent.com/tbxark-archive/GPT-3-Encoder/master", e = await pt("encoder_raw_file", `${r}/encoder.json`).then((y) => JSON.parse(y)), t = await pt("bpe_raw_file", `${r}/vocab.bpe`), n = (y, T) => Array.from(Array(T).keys()).slice(y), s = (y) => y.charCodeAt(0), i = (y) => String.fromCharCode(y), o = new TextEncoder("utf-8"), c = (y) => Array.from(o.encode(y)).map((T) => T.toString()), l = (y, T) => {
    const P = {};
    return y.forEach((M, O) => {
      P[y[O]] = T[O];
    }), P;
  };
  function a() {
    const y = n(s("!"), s("~") + 1).concat(n(s("¡"), s("¬") + 1), n(s("®"), s("ÿ") + 1));
    let T = y.slice(), P = 0;
    for (let O = 0; O < 2 ** 8; O++)
      y.includes(O) || (y.push(O), T.push(2 ** 8 + P), P = P + 1);
    T = T.map((O) => i(O));
    const M = {};
    return y.forEach((O, z) => {
      M[y[z]] = T[z];
    }), M;
  }
  function h(y) {
    const T = /* @__PURE__ */ new Set();
    let P = y[0];
    for (let M = 1; M < y.length; M++) {
      const O = y[M];
      T.add([P, O]), P = O;
    }
    return T;
  }
  const f = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu, p = {};
  Object.keys(e).forEach((y) => {
    p[e[y]] = y;
  });
  const g = t.split(`
`), m = g.slice(1, g.length - 1).map((y) => y.split(/(\s+)/).filter((T) => T.trim().length > 0)), b = a(), v = {};
  Object.keys(b).forEach((y) => {
    v[b[y]] = y;
  });
  const C = l(m, n(0, m.length)), k = /* @__PURE__ */ new Map();
  function H(y) {
    if (k.has(y))
      return k.get(y);
    let T = y.split(""), P = h(T);
    if (!P)
      return y;
    for (; ; ) {
      const M = {};
      Array.from(P).forEach((G) => {
        const u = C[G];
        M[isNaN(u) ? 1e11 : u] = G;
      });
      const O = M[Math.min(...Object.keys(M).map(
        (G) => parseInt(G)
      ))];
      if (!(O in C))
        break;
      const z = O[0], Z = O[1];
      let j = [], x = 0;
      for (; x < T.length; ) {
        const G = T.indexOf(z, x);
        if (G === -1) {
          j = j.concat(T.slice(x));
          break;
        }
        j = j.concat(T.slice(x, G)), x = G, T[x] === z && x < T.length - 1 && T[x + 1] === Z ? (j.push(z + Z), x = x + 2) : (j.push(T[x]), x = x + 1);
      }
      if (T = j, T.length === 1)
        break;
      P = h(T);
    }
    return T = T.join(" "), k.set(y, T), T;
  }
  return function(T) {
    let P = 0;
    const M = Array.from(T.matchAll(f)).map((O) => O[0]);
    for (let O of M) {
      O = c(O).map((Z) => b[Z]).join("");
      const z = H(O).split(" ").map((Z) => e[Z]);
      P += z.length;
    }
    return P;
  };
}
function Er(r) {
  const e = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let t = "";
  for (let n = r; n > 0; --n)
    t += e[Math.floor(Math.random() * e.length)];
  return t;
}
async function Tr() {
  let r = await $.get(Q.PASSWORD_KEY);
  return r === null && (r = Er(32), await $.put(Q.PASSWORD_KEY, r)), r;
}
function Ee(r) {
  return `
<html>  
  <head>
    <title>ChatGPT-Telegram-Workers</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="ChatGPT-Telegram-Workers">
    <meta name="author" content="TBXark">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: left;
        background-color: #fff;
      }
      h1 {
        margin-top: 0;
        margin-bottom: 0.5rem;
      }
      p {
        margin-top: 0;
        margin-bottom: 1rem;
      }
      a {
        color: #007bff;
        text-decoration: none;
        background-color: transparent;
      }
      a:hover {
        color: #0056b3;
        text-decoration: underline;
      }
      strong {
        font-weight: bolder;
      }
    </style>
  </head>
  <body>
    ${r}
  </body>
</html>
  `;
}
function ae(r) {
  return JSON.stringify({
    message: r.message,
    stack: r.stack
  });
}
function Ut(r, e, t) {
  switch (typeof r[e]) {
    case "number":
      r[e] = Number(t);
      break;
    case "boolean":
      r[e] = t === "true";
      break;
    case "string":
      r[e] = t;
      break;
    case "object":
      const n = JSON.parse(t);
      if (typeof n == "object") {
        r[e] = n;
        break;
      }
      throw new Error(d.I18N.utils.not_supported_configuration);
    default:
      throw new Error(d.I18N.utils.not_supported_configuration);
  }
}
async function wr() {
  let r = (e) => Array.from(e).length;
  try {
    d.GPT3_TOKENS_COUNT && (r = await jt());
  } catch (e) {
    console.error(e);
  }
  return (e) => {
    try {
      return r(e);
    } catch (t) {
      return console.error(t), Array.from(e).length;
    }
  };
}
function Dt(r) {
  return r === null ? new Response("NOT HANDLED", { status: 200 }) : r.status === 200 ? r : new Response(r.body, {
    status: 200,
    headers: {
      "Original-Status": r.status,
      ...r.headers
    }
  });
}
async function Sr(r, e, t) {
  var o;
  const n = t.USER_CONFIG.OPENAI_API_KEY || d.API_KEY, s = {
    model: d.CHAT_MODEL,
    ...t.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages: [...e || [], { role: "user", content: r }]
  }, i = await fetch(`${d.OPENAI_API_DOMAIN}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${n}`
    },
    body: JSON.stringify(s)
  }).then((c) => c.json());
  if ((o = i.error) != null && o.message)
    throw d.DEV_MODE || d.DEV_MODE ? new Error(`OpenAI API Error
> ${i.error.message}
Body: ${JSON.stringify(s)}`) : new Error(`OpenAI API Error
> ${i.error.message}`);
  return setTimeout(() => Rr(i.usage, t).catch(console.error), 0), i.choices[0].message.content;
}
async function Or(r, e) {
  var i;
  const t = e.USER_CONFIG.OPENAI_API_KEY || d.API_KEY, n = {
    prompt: r,
    n: 1,
    size: "512x512"
  }, s = await fetch(`${d.OPENAI_API_DOMAIN}/v1/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`
    },
    body: JSON.stringify(n)
  }).then((o) => o.json());
  if ((i = s.error) != null && i.message)
    throw new Error(`OpenAI API Error
> ${s.error.message}`);
  return s.data[0].url;
}
async function Ar(r, e, t) {
  const n = d.AUTO_TRIM_HISTORY && d.MAX_HISTORY_LENGTH <= 0, s = e.SHARE_CONTEXT.chatHistoryKey;
  let i = await Cr(s, e);
  if (t) {
    const a = t(i, r);
    i = a.history, r = a.text;
  }
  const { real: o, original: c } = i, l = await Sr(r, o, e);
  return n || (c.push({ role: "user", content: r || "", cosplay: e.SHARE_CONTEXT.role || "" }), c.push({ role: "assistant", content: l, cosplay: e.SHARE_CONTEXT.role || "" }), await $.put(s, JSON.stringify(c)).catch(console.error)), l;
}
async function Rr(r, e) {
  if (!d.ENABLE_USAGE_STATISTICS)
    return;
  let t = JSON.parse(await $.get(e.SHARE_CONTEXT.usageKey));
  t || (t = {
    tokens: {
      total: 0,
      chats: {}
    }
  }), t.tokens.total += r.total_tokens, t.tokens.chats[e.SHARE_CONTEXT.chatId] ? t.tokens.chats[e.SHARE_CONTEXT.chatId] += r.total_tokens : t.tokens.chats[e.SHARE_CONTEXT.chatId] = r.total_tokens, await $.put(e.SHARE_CONTEXT.usageKey, JSON.stringify(t));
}
async function Cr(r, e) {
  const t = { role: "system", content: e.USER_CONFIG.SYSTEM_INIT_MESSAGE };
  if (d.AUTO_TRIM_HISTORY && d.MAX_HISTORY_LENGTH <= 0)
    return t.role = d.SYSTEM_INIT_MESSAGE_ROLE, { real: [t], original: [t] };
  let s = [];
  try {
    s = JSON.parse(await $.get(r));
  } catch (l) {
    console.error(l);
  }
  (!s || !Array.isArray(s)) && (s = []);
  let i = JSON.parse(JSON.stringify(s));
  e.SHARE_CONTEXT.role && (s = s.filter((l) => e.SHARE_CONTEXT.role === l.cosplay)), s.forEach((l) => {
    delete l.cosplay;
  });
  const o = await wr(), c = (l, a, h, f) => {
    l.length > h && (l = l.splice(l.length - h));
    let p = a;
    for (let g = l.length - 1; g >= 0; g--) {
      const m = l[g];
      let b = 0;
      if (m.content ? b = o(m.content) : m.content = "", p += b, p > f) {
        l = l.splice(g + 1);
        break;
      }
    }
    return l;
  };
  if (d.AUTO_TRIM_HISTORY && d.MAX_HISTORY_LENGTH > 0) {
    const l = o(t.content), a = Math.max(Object.keys(e.USER_DEFINE.ROLE).length, 1);
    s = c(s, l, d.MAX_HISTORY_LENGTH, d.MAX_TOKEN_LENGTH), i = c(i, l, d.MAX_HISTORY_LENGTH * a, d.MAX_TOKEN_LENGTH * a);
  }
  switch (s.length > 0 ? s[0].role : "") {
    case "assistant":
    case "system":
      s[0] = t;
      break;
    default:
      s.unshift(t);
  }
  return d.SYSTEM_INIT_MESSAGE_ROLE !== "system" && s.length > 0 && s[0].role === "system" && (s[0].role = d.SYSTEM_INIT_MESSAGE_ROLE), { real: s, original: i };
}
const J = {
  default(r) {
    return Q.GROUP_TYPES.includes(r) ? ["administrator", "creator"] : !1;
  },
  shareModeGroup(r) {
    return Q.GROUP_TYPES.includes(r) && d.GROUP_CHAT_BOT_SHARE_MODE ? ["administrator", "creator"] : !1;
  }
}, q = {
  "/help": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: $r
  },
  "/new": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: _t,
    needAuth: J.shareModeGroup
  },
  "/start": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: _t,
    needAuth: J.default
  },
  "/img": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Ir,
    needAuth: J.shareModeGroup
  },
  "/version": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: jr,
    needAuth: J.default
  },
  "/setenv": {
    scopes: [],
    fn: Pr,
    needAuth: J.shareModeGroup
  },
  "/delenv": {
    scopes: [],
    fn: kr,
    needAuth: J.shareModeGroup
  },
  "/usage": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Ur,
    needAuth: J.default
  },
  "/system": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Dr,
    needAuth: J.default
  },
  "/role": {
    scopes: ["all_private_chats"],
    fn: Nr,
    needAuth: J.shareModeGroup
  },
  "/redo": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: Lr,
    needAuth: J.shareModeGroup
  }
};
async function Nr(r, e, t, n) {
  if (t === "show") {
    const h = Object.getOwnPropertyNames(n.USER_DEFINE.ROLE).length;
    if (h === 0)
      return w(n)(d.I18N.command.role.not_defined_any_role);
    let f = d.I18N.command.role.current_defined_role(h);
    for (const p in n.USER_DEFINE.ROLE)
      n.USER_DEFINE.ROLE.hasOwnProperty(p) && (f += `~${p}:
<pre>`, f += `${JSON.stringify(n.USER_DEFINE.ROLE[p])}
`, f += "</pre>");
    return n.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", w(n)(f);
  }
  const s = t.indexOf(" ");
  if (s === -1)
    return w(n)(d.I18N.command.role.help);
  const i = t.slice(0, s), o = t.slice(s + 1).trim(), c = o.indexOf("=");
  if (c === -1) {
    if (o === "del")
      try {
        if (n.USER_DEFINE.ROLE[i])
          return delete n.USER_DEFINE.ROLE[i], await $.put(
            n.SHARE_CONTEXT.configStoreKey,
            JSON.stringify(Object.assign(n.USER_CONFIG, { USER_DEFINE: n.USER_DEFINE }))
          ), w(n)(d.I18N.command.role.delete_role_success);
      } catch (h) {
        return w(n)(d.I18N.command.role.delete_role_error(h));
      }
    return w(n)(d.I18N.command.role.help);
  }
  const l = o.slice(0, c), a = o.slice(c + 1);
  n.USER_DEFINE.ROLE[i] || (n.USER_DEFINE.ROLE[i] = {
    // 系统初始化消息
    SYSTEM_INIT_MESSAGE: d.SYSTEM_INIT_MESSAGE,
    // OpenAI API 额外参数
    OPENAI_API_EXTRA_PARAMS: {}
  });
  try {
    return Ut(n.USER_DEFINE.ROLE[i], l, a), await $.put(
      n.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(Object.assign(n.USER_CONFIG, { USER_DEFINE: n.USER_DEFINE }))
    ), w(n)(d.I18N.command.role.update_role_success);
  } catch (h) {
    return w(n)(d.I18N.command.role.update_role_error(h));
  }
}
async function Ir(r, e, t, n) {
  if (t === "")
    return w(n)(d.I18N.command.img.help);
  try {
    setTimeout(() => st(n)("upload_photo").catch(console.error), 0);
    const s = await Or(t, n);
    try {
      return pr(n)(s);
    } catch {
      return w(n)(`${s}`);
    }
  } catch (s) {
    return w(n)(`ERROR: ${s.message}`);
  }
}
async function $r(r, e, t, n) {
  const s = d.I18N.command.help.summary + Object.keys(q).map((i) => `${i}：${d.I18N.command.help[i.substring(1)]}`).join(`
`);
  return w(n)(s);
}
async function _t(r, e, t, n) {
  try {
    return await $.delete(n.SHARE_CONTEXT.chatHistoryKey), e === "/new" ? w(n)(d.I18N.command.new.new_chat_start) : n.SHARE_CONTEXT.chatType === "private" ? w(n)(d.I18N.command.new.new_chat_start_private(n.CURRENT_CHAT_CONTEXT.chat_id)) : w(n)(d.I18N.command.new.new_chat_start_group(n.CURRENT_CHAT_CONTEXT.chat_id));
  } catch (s) {
    return w(n)(`ERROR: ${s.message}`);
  }
}
async function Pr(r, e, t, n) {
  const s = t.indexOf("=");
  if (s === -1)
    return w(n)(d.I18N.command.setenv.help);
  const i = t.slice(0, s), o = t.slice(s + 1);
  try {
    return Ut(n.USER_CONFIG, i, o), await $.put(
      n.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(n.USER_CONFIG)
    ), w(n)(d.I18N.command.setenv.update_config_success);
  } catch (c) {
    return w(n)(d.I18N.command.setenv.update_config_error(c));
  }
}
async function kr(r, e, t, n) {
  try {
    return n.USER_CONFIG[t] = null, await $.put(
      n.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(n.USER_CONFIG)
    ), w(n)(d.I18N.command.setenv.update_config_success);
  } catch (s) {
    return w(n)(d.I18N.command.setenv.update_config_error(s));
  }
}
async function jr(r, e, t, n) {
  const s = {
    headers: {
      "User-Agent": Q.USER_AGENT
    }
  }, i = {
    ts: d.BUILD_TIMESTAMP,
    sha: d.BUILD_VERSION
  }, o = `https://raw.githubusercontent.com/LarchLiu/star-nexus/${d.UPDATE_BRANCH}`, c = `${o}/dist/timestamp`, l = `${o}/dist/buildinfo.json`;
  let a = await fetch(l, s).then((h) => h.json()).catch(() => null);
  if (a || (a = await fetch(c, s).then((h) => h.text()).then((h) => ({ ts: Number(h.trim()), sha: "unknown" })).catch(() => ({ ts: 0, sha: "unknown" }))), i.ts < a.ts) {
    const h = d.I18N.command.version.new_version_found(i, a);
    return w(n)(h);
  } else {
    const h = d.I18N.command.version.current_is_latest_version(i);
    return w(n)(h);
  }
}
async function Ur(r, e, t, n) {
  if (!d.ENABLE_USAGE_STATISTICS)
    return w(n)(d.I18N.command.usage.usage_not_open);
  const s = JSON.parse(await $.get(n.SHARE_CONTEXT.usageKey));
  let i = d.I18N.command.usage.current_usage;
  if (s != null && s.tokens) {
    const { tokens: o } = s, c = Object.keys(o.chats || {}).sort((l, a) => o.chats[a] - o.chats[l]);
    i += d.I18N.command.usage.total_usage(o.total);
    for (let l = 0; l < Math.min(c.length, 30); l++)
      i += `
  - ${c[l]}: ${o.chats[c[l]]} tokens`;
    c.length === 0 ? i += "0 tokens" : c.length > 30 && (i += `
  ...`);
  } else
    i += d.I18N.command.usage.no_usage;
  return w(n)(i);
}
async function Dr(r, e, t, n) {
  let s = `Current System Info:
`;
  if (s += `OpenAI Model:${d.CHAT_MODEL}
`, d.DEV_MODE) {
    const i = { ...n.SHARE_CONTEXT };
    i.currentBotToken = "******", n.USER_CONFIG.OPENAI_API_KEY = "******", s += "<pre>", s += `USER_CONFIG: 
${JSON.stringify(n.USER_CONFIG, null, 2)}
`, s += `CHAT_CONTEXT: 
${JSON.stringify(n.CURRENT_CHAT_CONTEXT, null, 2)}
`, s += `SHARE_CONTEXT: 
${JSON.stringify(i, null, 2)}
`, s += "</pre>";
  }
  return n.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", w(n)(s);
}
async function Lr(r, e, t, n) {
  setTimeout(() => st(n)("typing").catch(console.error), 0);
  const s = await Ar(t, n, (i, o) => {
    const { real: c, original: l } = i;
    let a = o;
    for (; ; ) {
      const h = c.pop();
      if (l.pop(), h == null)
        break;
      if (h.role === "user") {
        (o === "" || o === void 0 || o === null) && (a = h.content);
        break;
      }
    }
    return { history: { real: c, original: l }, text: a };
  });
  return w(n)(s);
}
async function Mr(r, e, t, n) {
  let s = "<pre>";
  return s += JSON.stringify({ message: r }, null, 2), s += "</pre>", n.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", w(n)(s);
}
async function xr(r, e) {
  d.DEV_MODE && (q["/echo"] = {
    help: "[DEBUG ONLY] echo message",
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Mr,
    needAuth: J.default
  });
  for (const t in q)
    if (r.text === t || r.text.startsWith(`${t} `)) {
      const n = q[t];
      try {
        if (n.needAuth) {
          const i = n.needAuth(e.SHARE_CONTEXT.chatType);
          if (i) {
            const o = await yr(e)(e.SHARE_CONTEXT.speakerId);
            if (o === null)
              return w(e)(d.I18N.command.permission.not_authorized);
            if (!i.includes(o)) {
              const c = d.I18N.command.permission.not_enough_permission(i, o);
              return w(e)(c);
            }
          }
        }
      } catch (i) {
        return w(e)(d.I18N.command.permission.role_error(i));
      }
      const s = r.text.substring(t.length).trim();
      try {
        return await n.fn(r, t, s, e);
      } catch (i) {
        return w(e)(d.I18N.command.permission.command_error(i));
      }
    }
  return null;
}
async function Hr(r) {
  const e = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: []
  };
  for (const n in q)
    if (!d.HIDE_COMMAND_BUTTONS.includes(n) && q.hasOwnProperty(n) && q[n].scopes)
      for (const s of q[n].scopes)
        e[s] || (e[s] = []), e[s].push(n);
  const t = {};
  for (const n in e)
    t[n] = await fetch(
      `https://api.telegram.org/bot${r}/setMyCommands`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commands: e[n].map((s) => ({
            command: s,
            description: d.I18N.command.help[s.substring(1)] || ""
          })),
          scope: {
            type: n
          }
        })
      }
    ).then((s) => s.json());
  return { ok: !0, result: t };
}
function Br() {
  return Object.keys(q).map((r) => ({
    command: r,
    description: d.I18N.command.help[r.substring(1)]
  }));
}
const Fr = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/, Gr = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/, Kr = /^\s*["[{]|^\s*-?\d[\d.]{0,14}\s*$/;
function Jr(r, e) {
  if (r !== "__proto__" && !(r === "constructor" && e && typeof e == "object" && "prototype" in e))
    return e;
}
function Xr(r, e = {}) {
  if (typeof r != "string")
    return r;
  const t = r.toLowerCase().trim();
  if (t === "true")
    return !0;
  if (t === "false")
    return !1;
  if (t === "null")
    return null;
  if (t === "nan")
    return Number.NaN;
  if (t === "infinity")
    return Number.POSITIVE_INFINITY;
  if (t !== "undefined") {
    if (!Kr.test(r)) {
      if (e.strict)
        throw new SyntaxError("Invalid JSON");
      return r;
    }
    try {
      return Fr.test(r) || Gr.test(r) ? JSON.parse(r, Jr) : JSON.parse(r);
    } catch (n) {
      if (e.strict)
        throw n;
      return r;
    }
  }
}
const zr = /#/g, Yr = /&/g, Wr = /=/g, Lt = /\+/g, Vr = /%5e/gi, qr = /%60/gi, Qr = /%7c/gi, Zr = /%20/gi;
function en(r) {
  return encodeURI("" + r).replace(Qr, "|");
}
function Ve(r) {
  return en(typeof r == "string" ? r : JSON.stringify(r)).replace(Lt, "%2B").replace(Zr, "+").replace(zr, "%23").replace(Yr, "%26").replace(qr, "`").replace(Vr, "^");
}
function De(r) {
  return Ve(r).replace(Wr, "%3D");
}
function Mt(r = "") {
  try {
    return decodeURIComponent("" + r);
  } catch {
    return "" + r;
  }
}
function tn(r) {
  return Mt(r.replace(Lt, " "));
}
function rn(r = "") {
  const e = {};
  r[0] === "?" && (r = r.slice(1));
  for (const t of r.split("&")) {
    const n = t.match(/([^=]+)=?(.*)/) || [];
    if (n.length < 2)
      continue;
    const s = Mt(n[1]);
    if (s === "__proto__" || s === "constructor")
      continue;
    const i = tn(n[2] || "");
    typeof e[s] < "u" ? Array.isArray(e[s]) ? e[s].push(i) : e[s] = [e[s], i] : e[s] = i;
  }
  return e;
}
function nn(r, e) {
  return (typeof e == "number" || typeof e == "boolean") && (e = String(e)), e ? Array.isArray(e) ? e.map((t) => `${De(r)}=${Ve(t)}`).join("&") : `${De(r)}=${Ve(e)}` : De(r);
}
function sn(r) {
  return Object.keys(r).filter((e) => r[e] !== void 0).map((e) => nn(e, r[e])).join("&");
}
const on = /^\w{2,}:([/\\]{1,2})/, an = /^\w{2,}:([/\\]{2})?/, cn = /^([/\\]\s*){2,}[^/\\]/;
function xt(r, e = {}) {
  return typeof e == "boolean" && (e = { acceptRelative: e }), e.strict ? on.test(r) : an.test(r) || (e.acceptRelative ? cn.test(r) : !1);
}
const ln = /\/$|\/\?/;
function qe(r = "", e = !1) {
  return e ? ln.test(r) : r.endsWith("/");
}
function hn(r = "", e = !1) {
  if (!e)
    return (qe(r) ? r.slice(0, -1) : r) || "/";
  if (!qe(r, !0))
    return r || "/";
  const [t, ...n] = r.split("?");
  return (t.slice(0, -1) || "/") + (n.length > 0 ? `?${n.join("?")}` : "");
}
function un(r = "", e = !1) {
  if (!e)
    return r.endsWith("/") ? r : r + "/";
  if (qe(r, !0))
    return r || "/";
  const [t, ...n] = r.split("?");
  return t + "/" + (n.length > 0 ? `?${n.join("?")}` : "");
}
function dn(r = "") {
  return r.startsWith("/");
}
function fn(r = "") {
  return (dn(r) ? r.slice(1) : r) || "/";
}
function pn(r, e) {
  if (mn(e) || xt(r))
    return r;
  const t = hn(e);
  return r.startsWith(t) ? r : yn(t, r);
}
function _n(r, e) {
  const t = Ht(r), n = { ...rn(t.search), ...e };
  return t.search = sn(n), vn(t);
}
function mn(r) {
  return !r || r === "/";
}
function gn(r) {
  return r && r !== "/";
}
function yn(r, ...e) {
  let t = r || "";
  for (const n of e.filter((s) => gn(s)))
    t = t ? un(t) + fn(n) : n;
  return t;
}
function Ht(r = "", e) {
  if (!xt(r, { acceptRelative: !0 }))
    return e ? Ht(e + r) : mt(r);
  const [t = "", n, s = ""] = (r.replace(/\\/g, "/").match(/([^/:]+:)?\/\/([^/@]+@)?(.*)/) || []).splice(1), [i = "", o = ""] = (s.match(/([^#/?]*)(.*)?/) || []).splice(1), { pathname: c, search: l, hash: a } = mt(
    o.replace(/\/(?=[A-Za-z]:)/, "")
  );
  return {
    protocol: t,
    auth: n ? n.slice(0, Math.max(0, n.length - 1)) : "",
    host: i,
    pathname: c,
    search: l,
    hash: a
  };
}
function mt(r = "") {
  const [e = "", t = "", n = ""] = (r.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname: e,
    search: t,
    hash: n
  };
}
function vn(r) {
  const e = r.pathname + (r.search ? (r.search.startsWith("?") ? "" : "?") + r.search : "") + r.hash;
  return r.protocol ? r.protocol + "//" + (r.auth ? r.auth + "@" : "") + r.host + e : e;
}
class bn extends Error {
  constructor() {
    super(...arguments), this.name = "FetchError";
  }
}
function En(r, e, t) {
  let n = "";
  e && (n = e.message), r && t ? n = `${n} (${t.status} ${t.statusText} (${r.toString()}))` : r && (n = `${n} (${r.toString()})`);
  const s = new bn(n);
  return Object.defineProperty(s, "request", {
    get() {
      return r;
    }
  }), Object.defineProperty(s, "response", {
    get() {
      return t;
    }
  }), Object.defineProperty(s, "data", {
    get() {
      return t && t._data;
    }
  }), Object.defineProperty(s, "status", {
    get() {
      return t && t.status;
    }
  }), Object.defineProperty(s, "statusText", {
    get() {
      return t && t.statusText;
    }
  }), Object.defineProperty(s, "statusCode", {
    get() {
      return t && t.status;
    }
  }), Object.defineProperty(s, "statusMessage", {
    get() {
      return t && t.statusText;
    }
  }), s;
}
const Tn = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function gt(r = "GET") {
  return Tn.has(r.toUpperCase());
}
function wn(r) {
  if (r === void 0)
    return !1;
  const e = typeof r;
  return e === "string" || e === "number" || e === "boolean" || e === null ? !0 : e !== "object" ? !1 : Array.isArray(r) ? !0 : r.constructor && r.constructor.name === "Object" || typeof r.toJSON == "function";
}
const Sn = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]), On = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function An(r = "") {
  if (!r)
    return "json";
  const e = r.split(";").shift() || "";
  return On.test(e) ? "json" : Sn.has(e) || e.startsWith("text/") ? "text" : "blob";
}
const Rn = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  //  Gateway Timeout
]);
function Bt(r) {
  const { fetch: e, Headers: t } = r;
  function n(o) {
    const c = o.error && o.error.name === "AbortError" || !1;
    if (o.options.retry !== !1 && !c) {
      let a;
      typeof o.options.retry == "number" ? a = o.options.retry : a = gt(o.options.method) ? 0 : 1;
      const h = o.response && o.response.status || 500;
      if (a > 0 && Rn.has(h))
        return s(o.request, {
          ...o.options,
          retry: a - 1
        });
    }
    const l = En(
      o.request,
      o.error,
      o.response
    );
    throw Error.captureStackTrace && Error.captureStackTrace(l, s), l;
  }
  const s = async function(c, l = {}) {
    const a = {
      request: c,
      options: { ...r.defaults, ...l },
      response: void 0,
      error: void 0
    };
    a.options.onRequest && await a.options.onRequest(a), typeof a.request == "string" && (a.options.baseURL && (a.request = pn(a.request, a.options.baseURL)), (a.options.query || a.options.params) && (a.request = _n(a.request, {
      ...a.options.params,
      ...a.options.query
    })), a.options.body && gt(a.options.method) && wn(a.options.body) && (a.options.body = typeof a.options.body == "string" ? a.options.body : JSON.stringify(a.options.body), a.options.headers = new t(a.options.headers), a.options.headers.has("content-type") || a.options.headers.set("content-type", "application/json"), a.options.headers.has("accept") || a.options.headers.set("accept", "application/json"))), a.response = await e(
      a.request,
      a.options
    ).catch(async (f) => (a.error = f, a.options.onRequestError && await a.options.onRequestError(a), n(a)));
    const h = (a.options.parseResponse ? "json" : a.options.responseType) || An(a.response.headers.get("content-type") || "");
    if (h === "json") {
      const f = await a.response.text(), p = a.options.parseResponse || Xr;
      a.response._data = p(f);
    } else
      h === "stream" ? a.response._data = a.response.body : a.response._data = await a.response[h]();
    return a.options.onResponse && await a.options.onResponse(a), a.response.status >= 400 && a.response.status < 600 ? (a.options.onResponseError && await a.options.onResponseError(a), n(a)) : a.response;
  }, i = function(c, l) {
    return s(c, l).then((a) => a._data);
  };
  return i.raw = s, i.native = e, i.create = (o = {}) => Bt({
    ...r,
    defaults: {
      ...r.defaults,
      ...o
    }
  }), i;
}
const Ft = function() {
  if (typeof globalThis < "u")
    return globalThis;
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("unable to locate global object");
}(), Cn = Ft.fetch || (() => Promise.reject(new Error("[ofetch] global.fetch is not supported!"))), Nn = Ft.Headers, In = Bt({ fetch: Cn, Headers: Nn }), W = In, $n = "github.com", Pn = "twitter.com", ue = {}.VITE_NOTION_API_URL || "https://api.notion.com/v1", kn = {}.VITE_OPENAI_API_HOST || "https://api.openai.com/v1", jn = `Please summarize content within 300 words and then classify it to 1-5 types of classification. Classification names should be short and no explanation or description is needed.
You only speak JSON. Do not write text that isn't JSON. The JSON keys must be English word of "summary" and "categories".
Classification names used with array data.
The JSON format must be:
{
  "summary": "This is the summary content."
  "categories": ["XXX","YYY","ZZZ"]
}
`, Un = `Please answer in {language}. The Content is {webprompts}:
=====
{content}
=====
Please answer in {language}.`, Dn = {
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "Franch",
  kr: "Korean",
  nl: "Dutch",
  it: "Italian",
  ja: "Japanese",
  pt: "Portuguese",
  ru: "Russian",
  "zh-CN": "Chinese"
};
var Ln = Object.defineProperty, Mn = (r, e, t) => e in r ? Ln(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, $e = (r, e, t) => (Mn(r, typeof e != "symbol" ? e + "" : e, t), t);
let xn = class {
  constructor(e, t) {
    $e(this, "config"), $e(this, "data"), this.config = e, this.data = t;
  }
}, Hn = class {
  constructor(e, t) {
    $e(this, "config"), $e(this, "data"), this.config = e, this.data = t;
  }
}, Bn = class extends xn {
  constructor(e, t) {
    super(e, t);
  }
  async create(e) {
    if (!e && !this.data)
      throw new Error("DataStorage error: No Storage Data");
    const t = e || this.data, n = {
      title: t.title,
      summary: t.summary,
      url: t.url,
      categories: t.categories,
      status: "Starred",
      meta: t.meta
    };
    return await Fn(this.config, n);
  }
  async updateOgImage(e, t) {
    return await Gn(this.config, e.storageId, t);
  }
  getConfig() {
    return this.config;
  }
  getType() {
    return {
      type: "DataStorage",
      name: "NotionDataStorage"
    };
  }
};
async function Fn(r, e) {
  const t = r.apiKey;
  let n = [{
    name: "Others"
  }];
  n = e.categories.map((a) => (a = a.trim(), a.endsWith(".") && (a = a.slice(0, -1)), {
    name: a
  }));
  const s = {
    parent: {
      database_id: r.databaseId
    },
    properties: {
      Title: {
        title: [
          {
            text: {
              content: e.title
            }
          }
        ]
      },
      Summary: {
        rich_text: [
          {
            text: {
              content: e.summary
            }
          }
        ]
      },
      URL: {
        url: e.url
      },
      Categories: {
        multi_select: n
      },
      Status: {
        select: {
          name: "Starred"
        }
      }
    }
  };
  let i = r.defaultOgImage;
  if (e.meta && Object.keys(e.meta).length > 0) {
    const a = e.meta;
    if (a.ogImage && (i = a.ogImage), s.properties = {
      ...s.properties,
      OgImage: {
        url: i
      }
    }, s.properties = {
      ...s.properties,
      Website: {
        select: {
          name: a.siteName
        }
      }
    }, e.meta.domain === $n) {
      const h = a;
      if (h.languages) {
        const f = h.languages.map((p) => ({
          name: p
        }));
        s.properties = {
          ...s.properties,
          Languages: {
            multi_select: f
          }
        };
      }
      if (h.tags) {
        const f = h.tags.map((p) => ({
          name: p
        }));
        s.properties = {
          ...s.properties,
          Tags: {
            multi_select: f
          }
        };
      }
    } else if (e.meta.domain === Pn) {
      const h = a;
      if (h.tags) {
        const f = h.tags.map((p) => ({
          name: p
        }));
        s.properties = {
          ...s.properties,
          Tags: {
            multi_select: f
          }
        };
      }
    }
  }
  const o = await W(`${ue}/databases/${r.databaseId}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      Authorization: `Bearer ${t}`
    },
    body: {
      filter: {
        property: "URL",
        rich_text: {
          contains: e.url
        }
      }
    }
  });
  let c = "", l = !1;
  if (o.results.length > 0 && (o.results[0].properties.Status.select.name === "Starred" && (l = !0), c = o.results[0].id), c)
    return s.properties = {
      ...s.properties,
      Status: {
        select: {
          name: l ? "Unstarred" : "Starred"
        }
      }
    }, await W(`${ue}/pages/${c}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${t}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: s
    }), { starred: !l, storageId: c };
  if (i) {
    const a = {
      object: "block",
      image: {
        external: {
          url: i
        }
      }
    };
    s.children = [a];
  }
  return c = (await W(`${ue}/pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      Authorization: `Bearer ${t}`
    },
    body: s
  })).id, { starred: !l, storageId: c };
}
async function Gn(r, e, t) {
  const n = await W(`${ue}/blocks/${e}/children`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      Authorization: `Bearer ${r.apiKey}`
    }
  });
  let s = "";
  if (n.results.length > 0) {
    const i = n.results, o = i.length;
    for (let c = 0; c < o; c++)
      if (i[c].type === "image" && i[c].image.type === "external" && i[c].image.external.url.includes("starnexusogimage")) {
        s = i[c].id;
        break;
      }
  }
  return await W(`${ue}/pages/${e}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${r.apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: {
      properties: {
        OgImage: {
          url: t
        }
      }
    }
  }), s && await W(`${ue}/blocks/${s}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${r.apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: {
      image: {
        external: {
          url: t
        }
      }
    }
  }), {
    url: t
  };
}
var Kn = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
const Jn = (r) => {
  let e;
  return r ? e = r : typeof fetch > "u" ? e = (...t) => Kn(void 0, void 0, void 0, function* () {
    return yield (yield Promise.resolve().then(() => Pe)).fetch(...t);
  }) : e = fetch, (...t) => e(...t);
};
class it extends Error {
  constructor(e, t = "FunctionsError", n) {
    super(e), super.name = t, this.context = n;
  }
}
class Xn extends it {
  constructor(e) {
    super("Failed to send a request to the Edge Function", "FunctionsFetchError", e);
  }
}
class zn extends it {
  constructor(e) {
    super("Relay Error invoking the Edge Function", "FunctionsRelayError", e);
  }
}
class Yn extends it {
  constructor(e) {
    super("Edge Function returned a non-2xx status code", "FunctionsHttpError", e);
  }
}
var Wn = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
class Vn {
  constructor(e, { headers: t = {}, customFetch: n } = {}) {
    this.url = e, this.headers = t, this.fetch = Jn(n);
  }
  /**
   * Updates the authorization header
   * @param token - the new jwt token sent in the authorisation header
   */
  setAuth(e) {
    this.headers.Authorization = `Bearer ${e}`;
  }
  /**
   * Invokes a function
   * @param functionName - The name of the Function to invoke.
   * @param options - Options for invoking the Function.
   */
  invoke(e, t = {}) {
    var n;
    return Wn(this, void 0, void 0, function* () {
      try {
        const { headers: s, method: i, body: o } = t;
        let c = {}, l;
        o && (s && !Object.prototype.hasOwnProperty.call(s, "Content-Type") || !s) && (typeof Blob < "u" && o instanceof Blob || o instanceof ArrayBuffer ? (c["Content-Type"] = "application/octet-stream", l = o) : typeof o == "string" ? (c["Content-Type"] = "text/plain", l = o) : typeof FormData < "u" && o instanceof FormData ? l = o : (c["Content-Type"] = "application/json", l = JSON.stringify(o)));
        const a = yield this.fetch(`${this.url}/${e}`, {
          method: i || "POST",
          // headers priority is (high to low):
          // 1. invoke-level headers
          // 2. client-level headers
          // 3. default Content-Type header
          headers: Object.assign(Object.assign(Object.assign({}, c), this.headers), s),
          body: l
        }).catch((g) => {
          throw new Xn(g);
        }), h = a.headers.get("x-relay-error");
        if (h && h === "true")
          throw new zn(a);
        if (!a.ok)
          throw new Yn(a);
        let f = ((n = a.headers.get("Content-Type")) !== null && n !== void 0 ? n : "text/plain").split(";")[0].trim(), p;
        return f === "application/json" ? p = yield a.json() : f === "application/octet-stream" ? p = yield a.blob() : f === "multipart/form-data" ? p = yield a.formData() : p = yield a.text(), { data: p, error: null };
      } catch (s) {
        return { data: null, error: s };
      }
    });
  }
}
var qn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Qn(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Qe = { exports: {} };
(function(r, e) {
  var t = typeof self < "u" ? self : qn, n = function() {
    function i() {
      this.fetch = !1, this.DOMException = t.DOMException;
    }
    return i.prototype = t, new i();
  }();
  (function(i) {
    (function(o) {
      var c = {
        searchParams: "URLSearchParams" in i,
        iterable: "Symbol" in i && "iterator" in Symbol,
        blob: "FileReader" in i && "Blob" in i && function() {
          try {
            return new Blob(), !0;
          } catch {
            return !1;
          }
        }(),
        formData: "FormData" in i,
        arrayBuffer: "ArrayBuffer" in i
      };
      function l(u) {
        return u && DataView.prototype.isPrototypeOf(u);
      }
      if (c.arrayBuffer)
        var a = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], h = ArrayBuffer.isView || function(u) {
          return u && a.indexOf(Object.prototype.toString.call(u)) > -1;
        };
      function f(u) {
        if (typeof u != "string" && (u = String(u)), /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(u))
          throw new TypeError("Invalid character in header field name");
        return u.toLowerCase();
      }
      function p(u) {
        return typeof u != "string" && (u = String(u)), u;
      }
      function g(u) {
        var _ = {
          next: function() {
            var S = u.shift();
            return { done: S === void 0, value: S };
          }
        };
        return c.iterable && (_[Symbol.iterator] = function() {
          return _;
        }), _;
      }
      function m(u) {
        this.map = {}, u instanceof m ? u.forEach(function(_, S) {
          this.append(S, _);
        }, this) : Array.isArray(u) ? u.forEach(function(_) {
          this.append(_[0], _[1]);
        }, this) : u && Object.getOwnPropertyNames(u).forEach(function(_) {
          this.append(_, u[_]);
        }, this);
      }
      m.prototype.append = function(u, _) {
        u = f(u), _ = p(_);
        var S = this.map[u];
        this.map[u] = S ? S + ", " + _ : _;
      }, m.prototype.delete = function(u) {
        delete this.map[f(u)];
      }, m.prototype.get = function(u) {
        return u = f(u), this.has(u) ? this.map[u] : null;
      }, m.prototype.has = function(u) {
        return this.map.hasOwnProperty(f(u));
      }, m.prototype.set = function(u, _) {
        this.map[f(u)] = p(_);
      }, m.prototype.forEach = function(u, _) {
        for (var S in this.map)
          this.map.hasOwnProperty(S) && u.call(_, this.map[S], S, this);
      }, m.prototype.keys = function() {
        var u = [];
        return this.forEach(function(_, S) {
          u.push(S);
        }), g(u);
      }, m.prototype.values = function() {
        var u = [];
        return this.forEach(function(_) {
          u.push(_);
        }), g(u);
      }, m.prototype.entries = function() {
        var u = [];
        return this.forEach(function(_, S) {
          u.push([S, _]);
        }), g(u);
      }, c.iterable && (m.prototype[Symbol.iterator] = m.prototype.entries);
      function b(u) {
        if (u.bodyUsed)
          return Promise.reject(new TypeError("Already read"));
        u.bodyUsed = !0;
      }
      function v(u) {
        return new Promise(function(_, S) {
          u.onload = function() {
            _(u.result);
          }, u.onerror = function() {
            S(u.error);
          };
        });
      }
      function C(u) {
        var _ = new FileReader(), S = v(_);
        return _.readAsArrayBuffer(u), S;
      }
      function k(u) {
        var _ = new FileReader(), S = v(_);
        return _.readAsText(u), S;
      }
      function H(u) {
        for (var _ = new Uint8Array(u), S = new Array(_.length), D = 0; D < _.length; D++)
          S[D] = String.fromCharCode(_[D]);
        return S.join("");
      }
      function y(u) {
        if (u.slice)
          return u.slice(0);
        var _ = new Uint8Array(u.byteLength);
        return _.set(new Uint8Array(u)), _.buffer;
      }
      function T() {
        return this.bodyUsed = !1, this._initBody = function(u) {
          this._bodyInit = u, u ? typeof u == "string" ? this._bodyText = u : c.blob && Blob.prototype.isPrototypeOf(u) ? this._bodyBlob = u : c.formData && FormData.prototype.isPrototypeOf(u) ? this._bodyFormData = u : c.searchParams && URLSearchParams.prototype.isPrototypeOf(u) ? this._bodyText = u.toString() : c.arrayBuffer && c.blob && l(u) ? (this._bodyArrayBuffer = y(u.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : c.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(u) || h(u)) ? this._bodyArrayBuffer = y(u) : this._bodyText = u = Object.prototype.toString.call(u) : this._bodyText = "", this.headers.get("content-type") || (typeof u == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : c.searchParams && URLSearchParams.prototype.isPrototypeOf(u) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, c.blob && (this.blob = function() {
          var u = b(this);
          if (u)
            return u;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }, this.arrayBuffer = function() {
          return this._bodyArrayBuffer ? b(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(C);
        }), this.text = function() {
          var u = b(this);
          if (u)
            return u;
          if (this._bodyBlob)
            return k(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(H(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, c.formData && (this.formData = function() {
          return this.text().then(z);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var P = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      function M(u) {
        var _ = u.toUpperCase();
        return P.indexOf(_) > -1 ? _ : u;
      }
      function O(u, _) {
        _ = _ || {};
        var S = _.body;
        if (u instanceof O) {
          if (u.bodyUsed)
            throw new TypeError("Already read");
          this.url = u.url, this.credentials = u.credentials, _.headers || (this.headers = new m(u.headers)), this.method = u.method, this.mode = u.mode, this.signal = u.signal, !S && u._bodyInit != null && (S = u._bodyInit, u.bodyUsed = !0);
        } else
          this.url = String(u);
        if (this.credentials = _.credentials || this.credentials || "same-origin", (_.headers || !this.headers) && (this.headers = new m(_.headers)), this.method = M(_.method || this.method || "GET"), this.mode = _.mode || this.mode || null, this.signal = _.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && S)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        this._initBody(S);
      }
      O.prototype.clone = function() {
        return new O(this, { body: this._bodyInit });
      };
      function z(u) {
        var _ = new FormData();
        return u.trim().split("&").forEach(function(S) {
          if (S) {
            var D = S.split("="), U = D.shift().replace(/\+/g, " "), N = D.join("=").replace(/\+/g, " ");
            _.append(decodeURIComponent(U), decodeURIComponent(N));
          }
        }), _;
      }
      function Z(u) {
        var _ = new m(), S = u.replace(/\r?\n[\t ]+/g, " ");
        return S.split(/\r?\n/).forEach(function(D) {
          var U = D.split(":"), N = U.shift().trim();
          if (N) {
            var we = U.join(":").trim();
            _.append(N, we);
          }
        }), _;
      }
      T.call(O.prototype);
      function j(u, _) {
        _ || (_ = {}), this.type = "default", this.status = _.status === void 0 ? 200 : _.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = "statusText" in _ ? _.statusText : "OK", this.headers = new m(_.headers), this.url = _.url || "", this._initBody(u);
      }
      T.call(j.prototype), j.prototype.clone = function() {
        return new j(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new m(this.headers),
          url: this.url
        });
      }, j.error = function() {
        var u = new j(null, { status: 0, statusText: "" });
        return u.type = "error", u;
      };
      var x = [301, 302, 303, 307, 308];
      j.redirect = function(u, _) {
        if (x.indexOf(_) === -1)
          throw new RangeError("Invalid status code");
        return new j(null, { status: _, headers: { location: u } });
      }, o.DOMException = i.DOMException;
      try {
        new o.DOMException();
      } catch {
        o.DOMException = function(_, S) {
          this.message = _, this.name = S;
          var D = Error(_);
          this.stack = D.stack;
        }, o.DOMException.prototype = Object.create(Error.prototype), o.DOMException.prototype.constructor = o.DOMException;
      }
      function G(u, _) {
        return new Promise(function(S, D) {
          var U = new O(u, _);
          if (U.signal && U.signal.aborted)
            return D(new o.DOMException("Aborted", "AbortError"));
          var N = new XMLHttpRequest();
          function we() {
            N.abort();
          }
          N.onload = function() {
            var fe = {
              status: N.status,
              statusText: N.statusText,
              headers: Z(N.getAllResponseHeaders() || "")
            };
            fe.url = "responseURL" in N ? N.responseURL : fe.headers.get("X-Request-URL");
            var Ue = "response" in N ? N.response : N.responseText;
            S(new j(Ue, fe));
          }, N.onerror = function() {
            D(new TypeError("Network request failed"));
          }, N.ontimeout = function() {
            D(new TypeError("Network request failed"));
          }, N.onabort = function() {
            D(new o.DOMException("Aborted", "AbortError"));
          }, N.open(U.method, U.url, !0), U.credentials === "include" ? N.withCredentials = !0 : U.credentials === "omit" && (N.withCredentials = !1), "responseType" in N && c.blob && (N.responseType = "blob"), U.headers.forEach(function(fe, Ue) {
            N.setRequestHeader(Ue, fe);
          }), U.signal && (U.signal.addEventListener("abort", we), N.onreadystatechange = function() {
            N.readyState === 4 && U.signal.removeEventListener("abort", we);
          }), N.send(typeof U._bodyInit > "u" ? null : U._bodyInit);
        });
      }
      return G.polyfill = !0, i.fetch || (i.fetch = G, i.Headers = m, i.Request = O, i.Response = j), o.Headers = m, o.Request = O, o.Response = j, o.fetch = G, Object.defineProperty(o, "__esModule", { value: !0 }), o;
    })({});
  })(n), n.fetch.ponyfill = !0, delete n.fetch.polyfill;
  var s = n;
  e = s.fetch, e.default = s.fetch, e.fetch = s.fetch, e.Headers = s.Headers, e.Request = s.Request, e.Response = s.Response, r.exports = e;
})(Qe, Qe.exports);
var ot = Qe.exports;
const at = /* @__PURE__ */ Qn(ot), Pe = /* @__PURE__ */ rr({
  __proto__: null,
  default: at
}, [ot]);
class Zn {
  constructor(e) {
    this.shouldThrowOnError = !1, this.method = e.method, this.url = e.url, this.headers = e.headers, this.schema = e.schema, this.body = e.body, this.shouldThrowOnError = e.shouldThrowOnError, this.signal = e.signal, this.isMaybeSingle = e.isMaybeSingle, e.fetch ? this.fetch = e.fetch : typeof fetch > "u" ? this.fetch = at : this.fetch = fetch;
  }
  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError() {
    return this.shouldThrowOnError = !0, this;
  }
  then(e, t) {
    this.schema === void 0 || (["GET", "HEAD"].includes(this.method) ? this.headers["Accept-Profile"] = this.schema : this.headers["Content-Profile"] = this.schema), this.method !== "GET" && this.method !== "HEAD" && (this.headers["Content-Type"] = "application/json");
    const n = this.fetch;
    let s = n(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.signal
    }).then(async (i) => {
      var o, c, l;
      let a = null, h = null, f = null, p = i.status, g = i.statusText;
      if (i.ok) {
        if (this.method !== "HEAD") {
          const C = await i.text();
          C === "" || (this.headers.Accept === "text/csv" || this.headers.Accept && this.headers.Accept.includes("application/vnd.pgrst.plan+text") ? h = C : h = JSON.parse(C));
        }
        const b = (o = this.headers.Prefer) === null || o === void 0 ? void 0 : o.match(/count=(exact|planned|estimated)/), v = (c = i.headers.get("content-range")) === null || c === void 0 ? void 0 : c.split("/");
        b && v && v.length > 1 && (f = parseInt(v[1])), this.isMaybeSingle && this.method === "GET" && Array.isArray(h) && (h.length > 1 ? (a = {
          // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
          code: "PGRST116",
          details: `Results contain ${h.length} rows, application/vnd.pgrst.object+json requires 1 row`,
          hint: null,
          message: "JSON object requested, multiple (or no) rows returned"
        }, h = null, f = null, p = 406, g = "Not Acceptable") : h.length === 1 ? h = h[0] : h = null);
      } else {
        const b = await i.text();
        try {
          a = JSON.parse(b), Array.isArray(a) && i.status === 404 && (h = [], a = null, p = 200, g = "OK");
        } catch {
          i.status === 404 && b === "" ? (p = 204, g = "No Content") : a = {
            message: b
          };
        }
        if (a && this.isMaybeSingle && (!((l = a == null ? void 0 : a.details) === null || l === void 0) && l.includes("Results contain 0 rows")) && (a = null, p = 200, g = "OK"), a && this.shouldThrowOnError)
          throw a;
      }
      return {
        error: a,
        data: h,
        count: f,
        status: p,
        statusText: g
      };
    });
    return this.shouldThrowOnError || (s = s.catch((i) => {
      var o, c, l;
      return {
        error: {
          message: `${(o = i == null ? void 0 : i.name) !== null && o !== void 0 ? o : "FetchError"}: ${i == null ? void 0 : i.message}`,
          details: `${(c = i == null ? void 0 : i.stack) !== null && c !== void 0 ? c : ""}`,
          hint: "",
          code: `${(l = i == null ? void 0 : i.code) !== null && l !== void 0 ? l : ""}`
        },
        data: null,
        count: null,
        status: 0,
        statusText: ""
      };
    })), s.then(e, t);
  }
}
class es extends Zn {
  /**
   * Perform a SELECT on the query result.
   *
   * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
   * return modified rows. By calling this method, modified rows are returned in
   * `data`.
   *
   * @param columns - The columns to retrieve, separated by commas
   */
  select(e) {
    let t = !1;
    const n = (e ?? "*").split("").map((s) => /\s/.test(s) && !t ? "" : (s === '"' && (t = !t), s)).join("");
    return this.url.searchParams.set("select", n), this.headers.Prefer && (this.headers.Prefer += ","), this.headers.Prefer += "return=representation", this;
  }
  /**
   * Order the query result by `column`.
   *
   * You can call this method multiple times to order by multiple columns.
   *
   * You can order foreign tables, but it doesn't affect the ordering of the
   * current table.
   *
   * @param column - The column to order by
   * @param options - Named parameters
   * @param options.ascending - If `true`, the result will be in ascending order
   * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
   * `null`s appear last.
   * @param options.foreignTable - Set this to order a foreign table by foreign
   * columns
   */
  order(e, { ascending: t = !0, nullsFirst: n, foreignTable: s } = {}) {
    const i = s ? `${s}.order` : "order", o = this.url.searchParams.get(i);
    return this.url.searchParams.set(i, `${o ? `${o},` : ""}${e}.${t ? "asc" : "desc"}${n === void 0 ? "" : n ? ".nullsfirst" : ".nullslast"}`), this;
  }
  /**
   * Limit the query result by `count`.
   *
   * @param count - The maximum number of rows to return
   * @param options - Named parameters
   * @param options.foreignTable - Set this to limit rows of foreign tables
   * instead of the current table
   */
  limit(e, { foreignTable: t } = {}) {
    const n = typeof t > "u" ? "limit" : `${t}.limit`;
    return this.url.searchParams.set(n, `${e}`), this;
  }
  /**
   * Limit the query result by `from` and `to` inclusively.
   *
   * @param from - The starting index from which to limit the result
   * @param to - The last index to which to limit the result
   * @param options - Named parameters
   * @param options.foreignTable - Set this to limit rows of foreign tables
   * instead of the current table
   */
  range(e, t, { foreignTable: n } = {}) {
    const s = typeof n > "u" ? "offset" : `${n}.offset`, i = typeof n > "u" ? "limit" : `${n}.limit`;
    return this.url.searchParams.set(s, `${e}`), this.url.searchParams.set(i, `${t - e + 1}`), this;
  }
  /**
   * Set the AbortSignal for the fetch request.
   *
   * @param signal - The AbortSignal to use for the fetch request
   */
  abortSignal(e) {
    return this.signal = e, this;
  }
  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be one row (e.g. using `.limit(1)`), otherwise this
   * returns an error.
   */
  single() {
    return this.headers.Accept = "application/vnd.pgrst.object+json", this;
  }
  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
   * this returns an error.
   */
  maybeSingle() {
    return this.method === "GET" ? this.headers.Accept = "application/json" : this.headers.Accept = "application/vnd.pgrst.object+json", this.isMaybeSingle = !0, this;
  }
  /**
   * Return `data` as a string in CSV format.
   */
  csv() {
    return this.headers.Accept = "text/csv", this;
  }
  /**
   * Return `data` as an object in [GeoJSON](https://geojson.org) format.
   */
  geojson() {
    return this.headers.Accept = "application/geo+json", this;
  }
  /**
   * Return `data` as the EXPLAIN plan for the query.
   *
   * @param options - Named parameters
   *
   * @param options.analyze - If `true`, the query will be executed and the
   * actual run time will be returned
   *
   * @param options.verbose - If `true`, the query identifier will be returned
   * and `data` will include the output columns of the query
   *
   * @param options.settings - If `true`, include information on configuration
   * parameters that affect query planning
   *
   * @param options.buffers - If `true`, include information on buffer usage
   *
   * @param options.wal - If `true`, include information on WAL record generation
   *
   * @param options.format - The format of the output, can be `"text"` (default)
   * or `"json"`
   */
  explain({ analyze: e = !1, verbose: t = !1, settings: n = !1, buffers: s = !1, wal: i = !1, format: o = "text" } = {}) {
    const c = [
      e ? "analyze" : null,
      t ? "verbose" : null,
      n ? "settings" : null,
      s ? "buffers" : null,
      i ? "wal" : null
    ].filter(Boolean).join("|"), l = this.headers.Accept;
    return this.headers.Accept = `application/vnd.pgrst.plan+${o}; for="${l}"; options=${c};`, o === "json" ? this : this;
  }
  /**
   * Rollback the query.
   *
   * `data` will still be returned, but the query is not committed.
   */
  rollback() {
    var e;
    return ((e = this.headers.Prefer) !== null && e !== void 0 ? e : "").trim().length > 0 ? this.headers.Prefer += ",tx=rollback" : this.headers.Prefer = "tx=rollback", this;
  }
  /**
   * Override the type of the returned `data`.
   *
   * @typeParam NewResult - The new result type to override with
   */
  returns() {
    return this;
  }
}
class he extends es {
  /**
   * Match only rows where `column` is equal to `value`.
   *
   * To check if the value of `column` is NULL, you should use `.is()` instead.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  eq(e, t) {
    return this.url.searchParams.append(e, `eq.${t}`), this;
  }
  /**
   * Match only rows where `column` is not equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  neq(e, t) {
    return this.url.searchParams.append(e, `neq.${t}`), this;
  }
  /**
   * Match only rows where `column` is greater than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gt(e, t) {
    return this.url.searchParams.append(e, `gt.${t}`), this;
  }
  /**
   * Match only rows where `column` is greater than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gte(e, t) {
    return this.url.searchParams.append(e, `gte.${t}`), this;
  }
  /**
   * Match only rows where `column` is less than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lt(e, t) {
    return this.url.searchParams.append(e, `lt.${t}`), this;
  }
  /**
   * Match only rows where `column` is less than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lte(e, t) {
    return this.url.searchParams.append(e, `lte.${t}`), this;
  }
  /**
   * Match only rows where `column` matches `pattern` case-sensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  like(e, t) {
    return this.url.searchParams.append(e, `like.${t}`), this;
  }
  /**
   * Match only rows where `column` matches all of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAllOf(e, t) {
    return this.url.searchParams.append(e, `like(all).{${t.join(",")}}`), this;
  }
  /**
   * Match only rows where `column` matches any of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAnyOf(e, t) {
    return this.url.searchParams.append(e, `like(any).{${t.join(",")}}`), this;
  }
  /**
   * Match only rows where `column` matches `pattern` case-insensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  ilike(e, t) {
    return this.url.searchParams.append(e, `ilike.${t}`), this;
  }
  /**
   * Match only rows where `column` matches all of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAllOf(e, t) {
    return this.url.searchParams.append(e, `ilike(all).{${t.join(",")}}`), this;
  }
  /**
   * Match only rows where `column` matches any of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAnyOf(e, t) {
    return this.url.searchParams.append(e, `ilike(any).{${t.join(",")}}`), this;
  }
  /**
   * Match only rows where `column` IS `value`.
   *
   * For non-boolean columns, this is only relevant for checking if the value of
   * `column` is NULL by setting `value` to `null`.
   *
   * For boolean columns, you can also set `value` to `true` or `false` and it
   * will behave the same way as `.eq()`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  is(e, t) {
    return this.url.searchParams.append(e, `is.${t}`), this;
  }
  /**
   * Match only rows where `column` is included in the `values` array.
   *
   * @param column - The column to filter on
   * @param values - The values array to filter with
   */
  in(e, t) {
    const n = t.map((s) => typeof s == "string" && new RegExp("[,()]").test(s) ? `"${s}"` : `${s}`).join(",");
    return this.url.searchParams.append(e, `in.(${n})`), this;
  }
  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * `column` contains every element appearing in `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  contains(e, t) {
    return typeof t == "string" ? this.url.searchParams.append(e, `cs.${t}`) : Array.isArray(t) ? this.url.searchParams.append(e, `cs.{${t.join(",")}}`) : this.url.searchParams.append(e, `cs.${JSON.stringify(t)}`), this;
  }
  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * every element appearing in `column` is contained by `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  containedBy(e, t) {
    return typeof t == "string" ? this.url.searchParams.append(e, `cd.${t}`) : Array.isArray(t) ? this.url.searchParams.append(e, `cd.{${t.join(",")}}`) : this.url.searchParams.append(e, `cd.${JSON.stringify(t)}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is greater than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGt(e, t) {
    return this.url.searchParams.append(e, `sr.${t}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or greater than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGte(e, t) {
    return this.url.searchParams.append(e, `nxl.${t}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is less than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLt(e, t) {
    return this.url.searchParams.append(e, `sl.${t}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or less than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLte(e, t) {
    return this.url.searchParams.append(e, `nxr.${t}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where `column` is
   * mutually exclusive to `range` and there can be no element between the two
   * ranges.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeAdjacent(e, t) {
    return this.url.searchParams.append(e, `adj.${t}`), this;
  }
  /**
   * Only relevant for array and range columns. Match only rows where
   * `column` and `value` have an element in common.
   *
   * @param column - The array or range column to filter on
   * @param value - The array or range value to filter with
   */
  overlaps(e, t) {
    return typeof t == "string" ? this.url.searchParams.append(e, `ov.${t}`) : this.url.searchParams.append(e, `ov.{${t.join(",")}}`), this;
  }
  /**
   * Only relevant for text and tsvector columns. Match only rows where
   * `column` matches the query string in `query`.
   *
   * @param column - The text or tsvector column to filter on
   * @param query - The query text to match with
   * @param options - Named parameters
   * @param options.config - The text search configuration to use
   * @param options.type - Change how the `query` text is interpreted
   */
  textSearch(e, t, { config: n, type: s } = {}) {
    let i = "";
    s === "plain" ? i = "pl" : s === "phrase" ? i = "ph" : s === "websearch" && (i = "w");
    const o = n === void 0 ? "" : `(${n})`;
    return this.url.searchParams.append(e, `${i}fts${o}.${t}`), this;
  }
  /**
   * Match only rows where each column in `query` keys is equal to its
   * associated value. Shorthand for multiple `.eq()`s.
   *
   * @param query - The object to filter with, with column names as keys mapped
   * to their filter values
   */
  match(e) {
    return Object.entries(e).forEach(([t, n]) => {
      this.url.searchParams.append(t, `eq.${n}`);
    }), this;
  }
  /**
   * Match only rows which doesn't satisfy the filter.
   *
   * Unlike most filters, `opearator` and `value` are used as-is and need to
   * follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure they are properly sanitized.
   *
   * @param column - The column to filter on
   * @param operator - The operator to be negated to filter with, following
   * PostgREST syntax
   * @param value - The value to filter with, following PostgREST syntax
   */
  not(e, t, n) {
    return this.url.searchParams.append(e, `not.${t}.${n}`), this;
  }
  /**
   * Match only rows which satisfy at least one of the filters.
   *
   * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure it's properly sanitized.
   *
   * It's currently not possible to do an `.or()` filter across multiple tables.
   *
   * @param filters - The filters to use, following PostgREST syntax
   * @param foreignTable - Set this to filter on foreign tables instead of the
   * current table
   */
  or(e, { foreignTable: t } = {}) {
    const n = t ? `${t}.or` : "or";
    return this.url.searchParams.append(n, `(${e})`), this;
  }
  /**
   * Match only rows which satisfy the filter. This is an escape hatch - you
   * should use the specific filter methods wherever possible.
   *
   * Unlike most filters, `opearator` and `value` are used as-is and need to
   * follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure they are properly sanitized.
   *
   * @param column - The column to filter on
   * @param operator - The operator to filter with, following PostgREST syntax
   * @param value - The value to filter with, following PostgREST syntax
   */
  filter(e, t, n) {
    return this.url.searchParams.append(e, `${t}.${n}`), this;
  }
}
class ts {
  constructor(e, { headers: t = {}, schema: n, fetch: s }) {
    this.url = e, this.headers = t, this.schema = n, this.fetch = s;
  }
  /**
   * Perform a SELECT query on the table or view.
   *
   * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
   *
   * @param options - Named parameters
   *
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   *
   * @param options.count - Count algorithm to use to count rows in the table or view.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  select(e, { head: t = !1, count: n } = {}) {
    const s = t ? "HEAD" : "GET";
    let i = !1;
    const o = (e ?? "*").split("").map((c) => /\s/.test(c) && !i ? "" : (c === '"' && (i = !i), c)).join("");
    return this.url.searchParams.set("select", o), n && (this.headers.Prefer = `count=${n}`), new he({
      method: s,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: !1
    });
  }
  /**
   * Perform an INSERT into the table or view.
   *
   * By default, inserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to insert. Pass an object to insert a single row
   * or an array to insert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count inserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   *
   * @param options.defaultToNull - Make missing fields default to `null`.
   * Otherwise, use the default value for the column.
   */
  insert(e, { count: t, defaultToNull: n = !0 } = {}) {
    const s = "POST", i = [];
    if (this.headers.Prefer && i.push(this.headers.Prefer), t && i.push(`count=${t}`), n || i.push("missing=default"), this.headers.Prefer = i.join(","), Array.isArray(e)) {
      const o = e.reduce((c, l) => c.concat(Object.keys(l)), []);
      if (o.length > 0) {
        const c = [...new Set(o)].map((l) => `"${l}"`);
        this.url.searchParams.set("columns", c.join(","));
      }
    }
    return new he({
      method: s,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: e,
      fetch: this.fetch,
      allowEmpty: !1
    });
  }
  /**
   * Perform an UPSERT on the table or view. Depending on the column(s) passed
   * to `onConflict`, `.upsert()` allows you to perform the equivalent of
   * `.insert()` if a row with the corresponding `onConflict` columns doesn't
   * exist, or if it does exist, perform an alternative action depending on
   * `ignoreDuplicates`.
   *
   * By default, upserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to upsert with. Pass an object to upsert a
   * single row or an array to upsert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
   * duplicate rows are determined. Two rows are duplicates if all the
   * `onConflict` columns are equal.
   *
   * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
   * `false`, duplicate rows are merged with existing rows.
   *
   * @param options.count - Count algorithm to use to count upserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   *
   * @param options.defaultToNull - Make missing fields default to `null`.
   * Otherwise, use the default value for the column. This only applies when
   * inserting new rows, not when merging with existing rows under
   * `ignoreDuplicates: false`.
   */
  upsert(e, { onConflict: t, ignoreDuplicates: n = !1, count: s, defaultToNull: i = !0 } = {}) {
    const o = "POST", c = [`resolution=${n ? "ignore" : "merge"}-duplicates`];
    if (t !== void 0 && this.url.searchParams.set("on_conflict", t), this.headers.Prefer && c.push(this.headers.Prefer), s && c.push(`count=${s}`), i || c.push("missing=default"), this.headers.Prefer = c.join(","), Array.isArray(e)) {
      const l = e.reduce((a, h) => a.concat(Object.keys(h)), []);
      if (l.length > 0) {
        const a = [...new Set(l)].map((h) => `"${h}"`);
        this.url.searchParams.set("columns", a.join(","));
      }
    }
    return new he({
      method: o,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: e,
      fetch: this.fetch,
      allowEmpty: !1
    });
  }
  /**
   * Perform an UPDATE on the table or view.
   *
   * By default, updated rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param values - The values to update with
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count updated rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  update(e, { count: t } = {}) {
    const n = "PATCH", s = [];
    return this.headers.Prefer && s.push(this.headers.Prefer), t && s.push(`count=${t}`), this.headers.Prefer = s.join(","), new he({
      method: n,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: e,
      fetch: this.fetch,
      allowEmpty: !1
    });
  }
  /**
   * Perform a DELETE on the table or view.
   *
   * By default, deleted rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count deleted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  delete({ count: e } = {}) {
    const t = "DELETE", n = [];
    return e && n.push(`count=${e}`), this.headers.Prefer && n.unshift(this.headers.Prefer), this.headers.Prefer = n.join(","), new he({
      method: t,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: !1
    });
  }
}
const rs = "1.6.1", ns = { "X-Client-Info": `postgrest-js/${rs}` };
class ss {
  // TODO: Add back shouldThrowOnError once we figure out the typings
  /**
   * Creates a PostgREST client.
   *
   * @param url - URL of the PostgREST endpoint
   * @param options - Named parameters
   * @param options.headers - Custom headers
   * @param options.schema - Postgres schema to switch to
   * @param options.fetch - Custom fetch
   */
  constructor(e, { headers: t = {}, schema: n, fetch: s } = {}) {
    this.url = e, this.headers = Object.assign(Object.assign({}, ns), t), this.schema = n, this.fetch = s;
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(e) {
    const t = new URL(`${this.url}/${e}`);
    return new ts(t, {
      headers: Object.assign({}, this.headers),
      schema: this.schema,
      fetch: this.fetch
    });
  }
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(e, t = {}, { head: n = !1, count: s } = {}) {
    let i;
    const o = new URL(`${this.url}/rpc/${e}`);
    let c;
    n ? (i = "HEAD", Object.entries(t).forEach(([a, h]) => {
      o.searchParams.append(a, `${h}`);
    })) : (i = "POST", c = t);
    const l = Object.assign({}, this.headers);
    return s && (l.Prefer = `count=${s}`), new he({
      method: i,
      url: o,
      headers: l,
      schema: this.schema,
      body: c,
      fetch: this.fetch,
      allowEmpty: !1
    });
  }
}
var Le, yt;
function is() {
  if (yt)
    return Le;
  yt = 1;
  var r = function() {
    if (typeof self == "object" && self)
      return self;
    if (typeof window == "object" && window)
      return window;
    throw new Error("Unable to resolve global `this`");
  };
  return Le = function() {
    if (this)
      return this;
    if (typeof globalThis == "object" && globalThis)
      return globalThis;
    try {
      Object.defineProperty(Object.prototype, "__global__", {
        get: function() {
          return this;
        },
        configurable: !0
      });
    } catch {
      return r();
    }
    try {
      return __global__ || r();
    } finally {
      delete Object.prototype.__global__;
    }
  }(), Le;
}
const os = "websocket", as = "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.", cs = [
  "websocket",
  "websockets",
  "socket",
  "networking",
  "comet",
  "push",
  "RFC-6455",
  "realtime",
  "server",
  "client"
], ls = "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)", hs = [
  "Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
], us = "1.0.34", ds = {
  type: "git",
  url: "https://github.com/theturtle32/WebSocket-Node.git"
}, fs = "https://github.com/theturtle32/WebSocket-Node", ps = {
  node: ">=4.0.0"
}, _s = {
  bufferutil: "^4.0.1",
  debug: "^2.2.0",
  "es5-ext": "^0.10.50",
  "typedarray-to-buffer": "^3.1.5",
  "utf-8-validate": "^5.0.2",
  yaeti: "^0.0.6"
}, ms = {
  "buffer-equal": "^1.0.0",
  gulp: "^4.0.2",
  "gulp-jshint": "^2.0.4",
  "jshint-stylish": "^2.2.1",
  jshint: "^2.0.0",
  tape: "^4.9.1"
}, gs = {
  verbose: !1
}, ys = {
  test: "tape test/unit/*.js",
  gulp: "gulp"
}, vs = "index", bs = {
  lib: "./lib"
}, Es = "lib/browser.js", Ts = "Apache-2.0", ws = {
  name: os,
  description: as,
  keywords: cs,
  author: ls,
  contributors: hs,
  version: us,
  repository: ds,
  homepage: fs,
  engines: ps,
  dependencies: _s,
  devDependencies: ms,
  config: gs,
  scripts: ys,
  main: vs,
  directories: bs,
  browser: Es,
  license: Ts
};
var Ss = ws.version, se;
if (typeof globalThis == "object")
  se = globalThis;
else
  try {
    se = is();
  } catch {
  } finally {
    if (!se && typeof window < "u" && (se = window), !se)
      throw new Error("Could not determine global this");
  }
var be = se.WebSocket || se.MozWebSocket, Os = Ss;
function Gt(r, e) {
  var t;
  return e ? t = new be(r, e) : t = new be(r), t;
}
be && ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(function(r) {
  Object.defineProperty(Gt, r, {
    get: function() {
      return be[r];
    }
  });
});
var As = {
  w3cwebsocket: be ? Gt : null,
  version: Os
};
const Rs = "2.7.2", Cs = { "X-Client-Info": `realtime-js/${Rs}` }, Ns = "1.0.0", Kt = 1e4, Is = 1e3;
var ye;
(function(r) {
  r[r.connecting = 0] = "connecting", r[r.open = 1] = "open", r[r.closing = 2] = "closing", r[r.closed = 3] = "closed";
})(ye || (ye = {}));
var F;
(function(r) {
  r.closed = "closed", r.errored = "errored", r.joined = "joined", r.joining = "joining", r.leaving = "leaving";
})(F || (F = {}));
var X;
(function(r) {
  r.close = "phx_close", r.error = "phx_error", r.join = "phx_join", r.reply = "phx_reply", r.leave = "phx_leave", r.access_token = "access_token";
})(X || (X = {}));
var Ze;
(function(r) {
  r.websocket = "websocket";
})(Ze || (Ze = {}));
var ie;
(function(r) {
  r.Connecting = "connecting", r.Open = "open", r.Closing = "closing", r.Closed = "closed";
})(ie || (ie = {}));
class Jt {
  constructor(e, t) {
    this.callback = e, this.timerCalc = t, this.timer = void 0, this.tries = 0, this.callback = e, this.timerCalc = t;
  }
  reset() {
    this.tries = 0, clearTimeout(this.timer);
  }
  // Cancels any previous scheduleTimeout and schedules callback
  scheduleTimeout() {
    clearTimeout(this.timer), this.timer = setTimeout(() => {
      this.tries = this.tries + 1, this.callback();
    }, this.timerCalc(this.tries + 1));
  }
}
class $s {
  constructor() {
    this.HEADER_LENGTH = 1;
  }
  decode(e, t) {
    return e.constructor === ArrayBuffer ? t(this._binaryDecode(e)) : t(typeof e == "string" ? JSON.parse(e) : {});
  }
  _binaryDecode(e) {
    const t = new DataView(e), n = new TextDecoder();
    return this._decodeBroadcast(e, t, n);
  }
  _decodeBroadcast(e, t, n) {
    const s = t.getUint8(1), i = t.getUint8(2);
    let o = this.HEADER_LENGTH + 2;
    const c = n.decode(e.slice(o, o + s));
    o = o + s;
    const l = n.decode(e.slice(o, o + i));
    o = o + i;
    const a = JSON.parse(n.decode(e.slice(o, e.byteLength)));
    return { ref: null, topic: c, event: l, payload: a };
  }
}
class Me {
  /**
   * Initializes the Push
   *
   * @param channel The Channel
   * @param event The event, for example `"phx_join"`
   * @param payload The payload, for example `{user_id: 123}`
   * @param timeout The push timeout in milliseconds
   */
  constructor(e, t, n = {}, s = Kt) {
    this.channel = e, this.event = t, this.payload = n, this.timeout = s, this.sent = !1, this.timeoutTimer = void 0, this.ref = "", this.receivedResp = null, this.recHooks = [], this.refEvent = null, this.rateLimited = !1;
  }
  resend(e) {
    this.timeout = e, this._cancelRefEvent(), this.ref = "", this.refEvent = null, this.receivedResp = null, this.sent = !1, this.send();
  }
  send() {
    if (this._hasReceived("timeout"))
      return;
    this.startTimeout(), this.sent = !0, this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref,
      join_ref: this.channel._joinRef()
    }) === "rate limited" && (this.rateLimited = !0);
  }
  updatePayload(e) {
    this.payload = Object.assign(Object.assign({}, this.payload), e);
  }
  receive(e, t) {
    var n;
    return this._hasReceived(e) && t((n = this.receivedResp) === null || n === void 0 ? void 0 : n.response), this.recHooks.push({ status: e, callback: t }), this;
  }
  startTimeout() {
    if (this.timeoutTimer)
      return;
    this.ref = this.channel.socket._makeRef(), this.refEvent = this.channel._replyEventName(this.ref);
    const e = (t) => {
      this._cancelRefEvent(), this._cancelTimeout(), this.receivedResp = t, this._matchReceive(t);
    };
    this.channel._on(this.refEvent, {}, e), this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }
  trigger(e, t) {
    this.refEvent && this.channel._trigger(this.refEvent, { status: e, response: t });
  }
  destroy() {
    this._cancelRefEvent(), this._cancelTimeout();
  }
  _cancelRefEvent() {
    this.refEvent && this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    clearTimeout(this.timeoutTimer), this.timeoutTimer = void 0;
  }
  _matchReceive({ status: e, response: t }) {
    this.recHooks.filter((n) => n.status === e).forEach((n) => n.callback(t));
  }
  _hasReceived(e) {
    return this.receivedResp && this.receivedResp.status === e;
  }
}
var vt;
(function(r) {
  r.SYNC = "sync", r.JOIN = "join", r.LEAVE = "leave";
})(vt || (vt = {}));
class ve {
  /**
   * Initializes the Presence.
   *
   * @param channel - The RealtimeChannel
   * @param opts - The options,
   *        for example `{events: {state: 'state', diff: 'diff'}}`
   */
  constructor(e, t) {
    this.channel = e, this.state = {}, this.pendingDiffs = [], this.joinRef = null, this.caller = {
      onJoin: () => {
      },
      onLeave: () => {
      },
      onSync: () => {
      }
    };
    const n = (t == null ? void 0 : t.events) || {
      state: "presence_state",
      diff: "presence_diff"
    };
    this.channel._on(n.state, {}, (s) => {
      const { onJoin: i, onLeave: o, onSync: c } = this.caller;
      this.joinRef = this.channel._joinRef(), this.state = ve.syncState(this.state, s, i, o), this.pendingDiffs.forEach((l) => {
        this.state = ve.syncDiff(this.state, l, i, o);
      }), this.pendingDiffs = [], c();
    }), this.channel._on(n.diff, {}, (s) => {
      const { onJoin: i, onLeave: o, onSync: c } = this.caller;
      this.inPendingSyncState() ? this.pendingDiffs.push(s) : (this.state = ve.syncDiff(this.state, s, i, o), c());
    }), this.onJoin((s, i, o) => {
      this.channel._trigger("presence", {
        event: "join",
        key: s,
        currentPresences: i,
        newPresences: o
      });
    }), this.onLeave((s, i, o) => {
      this.channel._trigger("presence", {
        event: "leave",
        key: s,
        currentPresences: i,
        leftPresences: o
      });
    }), this.onSync(() => {
      this.channel._trigger("presence", { event: "sync" });
    });
  }
  /**
   * Used to sync the list of presences on the server with the
   * client's state.
   *
   * An optional `onJoin` and `onLeave` callback can be provided to
   * react to changes in the client's local presences across
   * disconnects and reconnects with the server.
   *
   * @internal
   */
  static syncState(e, t, n, s) {
    const i = this.cloneDeep(e), o = this.transformState(t), c = {}, l = {};
    return this.map(i, (a, h) => {
      o[a] || (l[a] = h);
    }), this.map(o, (a, h) => {
      const f = i[a];
      if (f) {
        const p = h.map((v) => v.presence_ref), g = f.map((v) => v.presence_ref), m = h.filter((v) => g.indexOf(v.presence_ref) < 0), b = f.filter((v) => p.indexOf(v.presence_ref) < 0);
        m.length > 0 && (c[a] = m), b.length > 0 && (l[a] = b);
      } else
        c[a] = h;
    }), this.syncDiff(i, { joins: c, leaves: l }, n, s);
  }
  /**
   * Used to sync a diff of presence join and leave events from the
   * server, as they happen.
   *
   * Like `syncState`, `syncDiff` accepts optional `onJoin` and
   * `onLeave` callbacks to react to a user joining or leaving from a
   * device.
   *
   * @internal
   */
  static syncDiff(e, t, n, s) {
    const { joins: i, leaves: o } = {
      joins: this.transformState(t.joins),
      leaves: this.transformState(t.leaves)
    };
    return n || (n = () => {
    }), s || (s = () => {
    }), this.map(i, (c, l) => {
      var a;
      const h = (a = e[c]) !== null && a !== void 0 ? a : [];
      if (e[c] = this.cloneDeep(l), h.length > 0) {
        const f = e[c].map((g) => g.presence_ref), p = h.filter((g) => f.indexOf(g.presence_ref) < 0);
        e[c].unshift(...p);
      }
      n(c, h, l);
    }), this.map(o, (c, l) => {
      let a = e[c];
      if (!a)
        return;
      const h = l.map((f) => f.presence_ref);
      a = a.filter((f) => h.indexOf(f.presence_ref) < 0), e[c] = a, s(c, a, l), a.length === 0 && delete e[c];
    }), e;
  }
  /** @internal */
  static map(e, t) {
    return Object.getOwnPropertyNames(e).map((n) => t(n, e[n]));
  }
  /**
   * Remove 'metas' key
   * Change 'phx_ref' to 'presence_ref'
   * Remove 'phx_ref' and 'phx_ref_prev'
   *
   * @example
   * // returns {
   *  abc123: [
   *    { presence_ref: '2', user_id: 1 },
   *    { presence_ref: '3', user_id: 2 }
   *  ]
   * }
   * RealtimePresence.transformState({
   *  abc123: {
   *    metas: [
   *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
   *      { phx_ref: '3', user_id: 2 }
   *    ]
   *  }
   * })
   *
   * @internal
   */
  static transformState(e) {
    return e = this.cloneDeep(e), Object.getOwnPropertyNames(e).reduce((t, n) => {
      const s = e[n];
      return "metas" in s ? t[n] = s.metas.map((i) => (i.presence_ref = i.phx_ref, delete i.phx_ref, delete i.phx_ref_prev, i)) : t[n] = s, t;
    }, {});
  }
  /** @internal */
  static cloneDeep(e) {
    return JSON.parse(JSON.stringify(e));
  }
  /** @internal */
  onJoin(e) {
    this.caller.onJoin = e;
  }
  /** @internal */
  onLeave(e) {
    this.caller.onLeave = e;
  }
  /** @internal */
  onSync(e) {
    this.caller.onSync = e;
  }
  /** @internal */
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
}
var I;
(function(r) {
  r.abstime = "abstime", r.bool = "bool", r.date = "date", r.daterange = "daterange", r.float4 = "float4", r.float8 = "float8", r.int2 = "int2", r.int4 = "int4", r.int4range = "int4range", r.int8 = "int8", r.int8range = "int8range", r.json = "json", r.jsonb = "jsonb", r.money = "money", r.numeric = "numeric", r.oid = "oid", r.reltime = "reltime", r.text = "text", r.time = "time", r.timestamp = "timestamp", r.timestamptz = "timestamptz", r.timetz = "timetz", r.tsrange = "tsrange", r.tstzrange = "tstzrange";
})(I || (I = {}));
const bt = (r, e, t = {}) => {
  var n;
  const s = (n = t.skipTypes) !== null && n !== void 0 ? n : [];
  return Object.keys(e).reduce((i, o) => (i[o] = Ps(o, r, e, s), i), {});
}, Ps = (r, e, t, n) => {
  const s = e.find((c) => c.name === r), i = s == null ? void 0 : s.type, o = t[r];
  return i && !n.includes(i) ? Xt(i, o) : et(o);
}, Xt = (r, e) => {
  if (r.charAt(0) === "_") {
    const t = r.slice(1, r.length);
    return Ds(e, t);
  }
  switch (r) {
    case I.bool:
      return ks(e);
    case I.float4:
    case I.float8:
    case I.int2:
    case I.int4:
    case I.int8:
    case I.numeric:
    case I.oid:
      return js(e);
    case I.json:
    case I.jsonb:
      return Us(e);
    case I.timestamp:
      return Ls(e);
    case I.abstime:
    case I.date:
    case I.daterange:
    case I.int4range:
    case I.int8range:
    case I.money:
    case I.reltime:
    case I.text:
    case I.time:
    case I.timestamptz:
    case I.timetz:
    case I.tsrange:
    case I.tstzrange:
      return et(e);
    default:
      return et(e);
  }
}, et = (r) => r, ks = (r) => {
  switch (r) {
    case "t":
      return !0;
    case "f":
      return !1;
    default:
      return r;
  }
}, js = (r) => {
  if (typeof r == "string") {
    const e = parseFloat(r);
    if (!Number.isNaN(e))
      return e;
  }
  return r;
}, Us = (r) => {
  if (typeof r == "string")
    try {
      return JSON.parse(r);
    } catch (e) {
      return console.log(`JSON parse error: ${e}`), r;
    }
  return r;
}, Ds = (r, e) => {
  if (typeof r != "string")
    return r;
  const t = r.length - 1, n = r[t];
  if (r[0] === "{" && n === "}") {
    let i;
    const o = r.slice(1, t);
    try {
      i = JSON.parse("[" + o + "]");
    } catch {
      i = o ? o.split(",") : [];
    }
    return i.map((c) => Xt(e, c));
  }
  return r;
}, Ls = (r) => typeof r == "string" ? r.replace(" ", "T") : r;
var Et = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
}, Tt;
(function(r) {
  r.ALL = "*", r.INSERT = "INSERT", r.UPDATE = "UPDATE", r.DELETE = "DELETE";
})(Tt || (Tt = {}));
var wt;
(function(r) {
  r.BROADCAST = "broadcast", r.PRESENCE = "presence", r.POSTGRES_CHANGES = "postgres_changes";
})(wt || (wt = {}));
var St;
(function(r) {
  r.SUBSCRIBED = "SUBSCRIBED", r.TIMED_OUT = "TIMED_OUT", r.CLOSED = "CLOSED", r.CHANNEL_ERROR = "CHANNEL_ERROR";
})(St || (St = {}));
class ct {
  constructor(e, t = { config: {} }, n) {
    this.topic = e, this.params = t, this.socket = n, this.bindings = {}, this.state = F.closed, this.joinedOnce = !1, this.pushBuffer = [], this.params.config = Object.assign({
      broadcast: { ack: !1, self: !1 },
      presence: { key: "" }
    }, t.config), this.timeout = this.socket.timeout, this.joinPush = new Me(this, X.join, this.params, this.timeout), this.rejoinTimer = new Jt(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs), this.joinPush.receive("ok", () => {
      this.state = F.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach((s) => s.send()), this.pushBuffer = [];
    }), this._onClose(() => {
      this.rejoinTimer.reset(), this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`), this.state = F.closed, this.socket._remove(this);
    }), this._onError((s) => {
      this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, s), this.state = F.errored, this.rejoinTimer.scheduleTimeout());
    }), this.joinPush.receive("timeout", () => {
      this._isJoining() && (this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), this.state = F.errored, this.rejoinTimer.scheduleTimeout());
    }), this._on(X.reply, {}, (s, i) => {
      this._trigger(this._replyEventName(i), s);
    }), this.presence = new ve(this);
  }
  /** Subscribe registers your client with the server */
  subscribe(e, t = this.timeout) {
    var n, s;
    if (this.joinedOnce)
      throw "tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance";
    {
      const { config: { broadcast: i, presence: o } } = this.params;
      this._onError((a) => e && e("CHANNEL_ERROR", a)), this._onClose(() => e && e("CLOSED"));
      const c = {}, l = {
        broadcast: i,
        presence: o,
        postgres_changes: (s = (n = this.bindings.postgres_changes) === null || n === void 0 ? void 0 : n.map((a) => a.filter)) !== null && s !== void 0 ? s : []
      };
      this.socket.accessToken && (c.access_token = this.socket.accessToken), this.updateJoinPayload(Object.assign({ config: l }, c)), this.joinedOnce = !0, this._rejoin(t), this.joinPush.receive("ok", ({ postgres_changes: a }) => {
        var h;
        if (this.socket.accessToken && this.socket.setAuth(this.socket.accessToken), a === void 0) {
          e && e("SUBSCRIBED");
          return;
        } else {
          const f = this.bindings.postgres_changes, p = (h = f == null ? void 0 : f.length) !== null && h !== void 0 ? h : 0, g = [];
          for (let m = 0; m < p; m++) {
            const b = f[m], { filter: { event: v, schema: C, table: k, filter: H } } = b, y = a && a[m];
            if (y && y.event === v && y.schema === C && y.table === k && y.filter === H)
              g.push(Object.assign(Object.assign({}, b), { id: y.id }));
            else {
              this.unsubscribe(), e && e("CHANNEL_ERROR", new Error("mismatch between server and client bindings for postgres changes"));
              return;
            }
          }
          this.bindings.postgres_changes = g, e && e("SUBSCRIBED");
          return;
        }
      }).receive("error", (a) => {
        e && e("CHANNEL_ERROR", new Error(JSON.stringify(Object.values(a).join(", ") || "error")));
      }).receive("timeout", () => {
        e && e("TIMED_OUT");
      });
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  track(e, t = {}) {
    return Et(this, void 0, void 0, function* () {
      return yield this.send({
        type: "presence",
        event: "track",
        payload: e
      }, t.timeout || this.timeout);
    });
  }
  untrack(e = {}) {
    return Et(this, void 0, void 0, function* () {
      return yield this.send({
        type: "presence",
        event: "untrack"
      }, e);
    });
  }
  on(e, t, n) {
    return this._on(e, t, n);
  }
  send(e, t = {}) {
    return new Promise((n) => {
      var s, i, o;
      const c = this._push(e.type, e, t.timeout || this.timeout);
      c.rateLimited && n("rate limited"), e.type === "broadcast" && !(!((o = (i = (s = this.params) === null || s === void 0 ? void 0 : s.config) === null || i === void 0 ? void 0 : i.broadcast) === null || o === void 0) && o.ack) && n("ok"), c.receive("ok", () => n("ok")), c.receive("timeout", () => n("timed out"));
    });
  }
  updateJoinPayload(e) {
    this.joinPush.updatePayload(e);
  }
  /**
   * Leaves the channel.
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   */
  unsubscribe(e = this.timeout) {
    this.state = F.leaving;
    const t = () => {
      this.socket.log("channel", `leave ${this.topic}`), this._trigger(X.close, "leave", this._joinRef());
    };
    return this.rejoinTimer.reset(), this.joinPush.destroy(), new Promise((n) => {
      const s = new Me(this, X.leave, {}, e);
      s.receive("ok", () => {
        t(), n("ok");
      }).receive("timeout", () => {
        t(), n("timed out");
      }).receive("error", () => {
        n("error");
      }), s.send(), this._canPush() || s.trigger("ok", {});
    });
  }
  /** @internal */
  _push(e, t, n = this.timeout) {
    if (!this.joinedOnce)
      throw `tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    let s = new Me(this, e, t, n);
    return this._canPush() ? s.send() : (s.startTimeout(), this.pushBuffer.push(s)), s;
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   *
   * @internal
   */
  _onMessage(e, t, n) {
    return t;
  }
  /** @internal */
  _isMember(e) {
    return this.topic === e;
  }
  /** @internal */
  _joinRef() {
    return this.joinPush.ref;
  }
  /** @internal */
  _trigger(e, t, n) {
    var s, i;
    const o = e.toLocaleLowerCase(), { close: c, error: l, leave: a, join: h } = X;
    if (n && [c, l, a, h].indexOf(o) >= 0 && n !== this._joinRef())
      return;
    let p = this._onMessage(o, t, n);
    if (t && !p)
      throw "channel onMessage callbacks must return the payload, modified or unmodified";
    ["insert", "update", "delete"].includes(o) ? (s = this.bindings.postgres_changes) === null || s === void 0 || s.filter((g) => {
      var m, b, v;
      return ((m = g.filter) === null || m === void 0 ? void 0 : m.event) === "*" || ((v = (b = g.filter) === null || b === void 0 ? void 0 : b.event) === null || v === void 0 ? void 0 : v.toLocaleLowerCase()) === o;
    }).map((g) => g.callback(p, n)) : (i = this.bindings[o]) === null || i === void 0 || i.filter((g) => {
      var m, b, v, C, k, H;
      if (["broadcast", "presence", "postgres_changes"].includes(o))
        if ("id" in g) {
          const y = g.id, T = (m = g.filter) === null || m === void 0 ? void 0 : m.event;
          return y && ((b = t.ids) === null || b === void 0 ? void 0 : b.includes(y)) && (T === "*" || (T == null ? void 0 : T.toLocaleLowerCase()) === ((v = t.data) === null || v === void 0 ? void 0 : v.type.toLocaleLowerCase()));
        } else {
          const y = (k = (C = g == null ? void 0 : g.filter) === null || C === void 0 ? void 0 : C.event) === null || k === void 0 ? void 0 : k.toLocaleLowerCase();
          return y === "*" || y === ((H = t == null ? void 0 : t.event) === null || H === void 0 ? void 0 : H.toLocaleLowerCase());
        }
      else
        return g.type.toLocaleLowerCase() === o;
    }).map((g) => {
      if (typeof p == "object" && "ids" in p) {
        const m = p.data, { schema: b, table: v, commit_timestamp: C, type: k, errors: H } = m;
        p = Object.assign(Object.assign({}, {
          schema: b,
          table: v,
          commit_timestamp: C,
          eventType: k,
          new: {},
          old: {},
          errors: H
        }), this._getPayloadRecords(m));
      }
      g.callback(p, n);
    });
  }
  /** @internal */
  _isClosed() {
    return this.state === F.closed;
  }
  /** @internal */
  _isJoined() {
    return this.state === F.joined;
  }
  /** @internal */
  _isJoining() {
    return this.state === F.joining;
  }
  /** @internal */
  _isLeaving() {
    return this.state === F.leaving;
  }
  /** @internal */
  _replyEventName(e) {
    return `chan_reply_${e}`;
  }
  /** @internal */
  _on(e, t, n) {
    const s = e.toLocaleLowerCase(), i = {
      type: s,
      filter: t,
      callback: n
    };
    return this.bindings[s] ? this.bindings[s].push(i) : this.bindings[s] = [i], this;
  }
  /** @internal */
  _off(e, t) {
    const n = e.toLocaleLowerCase();
    return this.bindings[n] = this.bindings[n].filter((s) => {
      var i;
      return !(((i = s.type) === null || i === void 0 ? void 0 : i.toLocaleLowerCase()) === n && ct.isEqual(s.filter, t));
    }), this;
  }
  /** @internal */
  static isEqual(e, t) {
    if (Object.keys(e).length !== Object.keys(t).length)
      return !1;
    for (const n in e)
      if (e[n] !== t[n])
        return !1;
    return !0;
  }
  /** @internal */
  _rejoinUntilConnected() {
    this.rejoinTimer.scheduleTimeout(), this.socket.isConnected() && this._rejoin();
  }
  /**
   * Registers a callback that will be executed when the channel closes.
   *
   * @internal
   */
  _onClose(e) {
    this._on(X.close, {}, e);
  }
  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   *
   * @internal
   */
  _onError(e) {
    this._on(X.error, {}, (t) => e(t));
  }
  /**
   * Returns `true` if the socket is connected and the channel has been joined.
   *
   * @internal
   */
  _canPush() {
    return this.socket.isConnected() && this._isJoined();
  }
  /** @internal */
  _rejoin(e = this.timeout) {
    this._isLeaving() || (this.socket._leaveOpenTopic(this.topic), this.state = F.joining, this.joinPush.resend(e));
  }
  /** @internal */
  _getPayloadRecords(e) {
    const t = {
      new: {},
      old: {}
    };
    return (e.type === "INSERT" || e.type === "UPDATE") && (t.new = bt(e.columns, e.record)), (e.type === "UPDATE" || e.type === "DELETE") && (t.old = bt(e.columns, e.old_record)), t;
  }
}
var xe = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
const Ms = () => {
};
class xs {
  /**
   * Initializes the Socket.
   *
   * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
   * @param options.transport The Websocket Transport, for example WebSocket.
   * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
   * @param options.params The optional params to pass when connecting.
   * @param options.headers The optional headers to pass when connecting.
   * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
   * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
   * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
   * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
   * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
   */
  constructor(e, t) {
    var n;
    this.accessToken = null, this.channels = [], this.endPoint = "", this.headers = Cs, this.params = {}, this.timeout = Kt, this.transport = As.w3cwebsocket, this.heartbeatIntervalMs = 3e4, this.heartbeatTimer = void 0, this.pendingHeartbeatRef = null, this.ref = 0, this.logger = Ms, this.conn = null, this.sendBuffer = [], this.serializer = new $s(), this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    }, this.eventsPerSecondLimitMs = 100, this.inThrottle = !1, this.endPoint = `${e}/${Ze.websocket}`, t != null && t.params && (this.params = t.params), t != null && t.headers && (this.headers = Object.assign(Object.assign({}, this.headers), t.headers)), t != null && t.timeout && (this.timeout = t.timeout), t != null && t.logger && (this.logger = t.logger), t != null && t.transport && (this.transport = t.transport), t != null && t.heartbeatIntervalMs && (this.heartbeatIntervalMs = t.heartbeatIntervalMs);
    const s = (n = t == null ? void 0 : t.params) === null || n === void 0 ? void 0 : n.eventsPerSecond;
    s && (this.eventsPerSecondLimitMs = Math.floor(1e3 / s)), this.reconnectAfterMs = t != null && t.reconnectAfterMs ? t.reconnectAfterMs : (i) => [1e3, 2e3, 5e3, 1e4][i - 1] || 1e4, this.encode = t != null && t.encode ? t.encode : (i, o) => o(JSON.stringify(i)), this.decode = t != null && t.decode ? t.decode : this.serializer.decode.bind(this.serializer), this.reconnectTimer = new Jt(() => xe(this, void 0, void 0, function* () {
      this.disconnect(), this.connect();
    }), this.reconnectAfterMs);
  }
  /**
   * Connects the socket, unless already connected.
   */
  connect() {
    this.conn || (this.conn = new this.transport(this._endPointURL(), [], null, this.headers), this.conn && (this.conn.binaryType = "arraybuffer", this.conn.onopen = () => this._onConnOpen(), this.conn.onerror = (e) => this._onConnError(e), this.conn.onmessage = (e) => this._onConnMessage(e), this.conn.onclose = (e) => this._onConnClose(e)));
  }
  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   */
  disconnect(e, t) {
    this.conn && (this.conn.onclose = function() {
    }, e ? this.conn.close(e, t ?? "") : this.conn.close(), this.conn = null, this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.reconnectTimer.reset());
  }
  /**
   * Returns all created channels
   */
  getChannels() {
    return this.channels;
  }
  /**
   * Unsubscribes and removes a single channel
   * @param channel A RealtimeChannel instance
   */
  removeChannel(e) {
    return xe(this, void 0, void 0, function* () {
      const t = yield e.unsubscribe();
      return this.channels.length === 0 && this.disconnect(), t;
    });
  }
  /**
   * Unsubscribes and removes all channels
   */
  removeAllChannels() {
    return xe(this, void 0, void 0, function* () {
      const e = yield Promise.all(this.channels.map((t) => t.unsubscribe()));
      return this.disconnect(), e;
    });
  }
  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden.
   */
  log(e, t, n) {
    this.logger(e, t, n);
  }
  /**
   * Returns the current state of the socket.
   */
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case ye.connecting:
        return ie.Connecting;
      case ye.open:
        return ie.Open;
      case ye.closing:
        return ie.Closing;
      default:
        return ie.Closed;
    }
  }
  /**
   * Returns `true` is the connection is open.
   */
  isConnected() {
    return this.connectionState() === ie.Open;
  }
  channel(e, t = { config: {} }) {
    this.isConnected() || this.connect();
    const n = new ct(`realtime:${e}`, t, this);
    return this.channels.push(n), n;
  }
  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   */
  push(e) {
    const { topic: t, event: n, payload: s, ref: i } = e;
    let o = () => {
      this.encode(e, (c) => {
        var l;
        (l = this.conn) === null || l === void 0 || l.send(c);
      });
    };
    if (this.log("push", `${t} ${n} (${i})`, s), this.isConnected())
      if (["broadcast", "presence", "postgres_changes"].includes(n)) {
        if (this._throttle(o)())
          return "rate limited";
      } else
        o();
    else
      this.sendBuffer.push(o);
  }
  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * @param token A JWT string.
   */
  setAuth(e) {
    this.accessToken = e, this.channels.forEach((t) => {
      e && t.updateJoinPayload({ access_token: e }), t.joinedOnce && t._isJoined() && t._push(X.access_token, { access_token: e });
    });
  }
  /**
   * Return the next message ref, accounting for overflows
   *
   * @internal
   */
  _makeRef() {
    let e = this.ref + 1;
    return e === this.ref ? this.ref = 0 : this.ref = e, this.ref.toString();
  }
  /**
   * Unsubscribe from channels with the specified topic.
   *
   * @internal
   */
  _leaveOpenTopic(e) {
    let t = this.channels.find((n) => n.topic === e && (n._isJoined() || n._isJoining()));
    t && (this.log("transport", `leaving duplicate topic "${e}"`), t.unsubscribe());
  }
  /**
   * Removes a subscription from the socket.
   *
   * @param channel An open subscription.
   *
   * @internal
   */
  _remove(e) {
    this.channels = this.channels.filter((t) => t._joinRef() !== e._joinRef());
  }
  /**
   * Returns the URL of the websocket.
   *
   * @internal
   */
  _endPointURL() {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: Ns }));
  }
  /** @internal */
  _onConnMessage(e) {
    this.decode(e.data, (t) => {
      let { topic: n, event: s, payload: i, ref: o } = t;
      (o && o === this.pendingHeartbeatRef || s === (i == null ? void 0 : i.type)) && (this.pendingHeartbeatRef = null), this.log("receive", `${i.status || ""} ${n} ${s} ${o && "(" + o + ")" || ""}`, i), this.channels.filter((c) => c._isMember(n)).forEach((c) => c._trigger(s, i, o)), this.stateChangeCallbacks.message.forEach((c) => c(t));
    });
  }
  /** @internal */
  _onConnOpen() {
    this.log("transport", `connected to ${this._endPointURL()}`), this._flushSendBuffer(), this.reconnectTimer.reset(), this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs), this.stateChangeCallbacks.open.forEach((e) => e());
  }
  /** @internal */
  _onConnClose(e) {
    this.log("transport", "close", e), this._triggerChanError(), this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.reconnectTimer.scheduleTimeout(), this.stateChangeCallbacks.close.forEach((t) => t(e));
  }
  /** @internal */
  _onConnError(e) {
    this.log("transport", e.message), this._triggerChanError(), this.stateChangeCallbacks.error.forEach((t) => t(e));
  }
  /** @internal */
  _triggerChanError() {
    this.channels.forEach((e) => e._trigger(X.error));
  }
  /** @internal */
  _appendParams(e, t) {
    if (Object.keys(t).length === 0)
      return e;
    const n = e.match(/\?/) ? "&" : "?", s = new URLSearchParams(t);
    return `${e}${n}${s}`;
  }
  /** @internal */
  _flushSendBuffer() {
    this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((e) => e()), this.sendBuffer = []);
  }
  /** @internal */
  _sendHeartbeat() {
    var e;
    if (this.isConnected()) {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null, this.log("transport", "heartbeat timeout. Attempting to re-establish connection"), (e = this.conn) === null || e === void 0 || e.close(Is, "hearbeat timeout");
        return;
      }
      this.pendingHeartbeatRef = this._makeRef(), this.push({
        topic: "phoenix",
        event: "heartbeat",
        payload: {},
        ref: this.pendingHeartbeatRef
      }), this.setAuth(this.accessToken);
    }
  }
  /** @internal */
  _throttle(e, t = this.eventsPerSecondLimitMs) {
    return () => this.inThrottle ? !0 : (e(), t > 0 && (this.inThrottle = !0, setTimeout(() => {
      this.inThrottle = !1;
    }, t)), !1);
  }
}
class lt extends Error {
  constructor(e) {
    super(e), this.__isStorageError = !0, this.name = "StorageError";
  }
}
function L(r) {
  return typeof r == "object" && r !== null && "__isStorageError" in r;
}
class Hs extends lt {
  constructor(e, t) {
    super(e), this.name = "StorageApiError", this.status = t;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
class Ot extends lt {
  constructor(e, t) {
    super(e), this.name = "StorageUnknownError", this.originalError = t;
  }
}
var zt = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
const Yt = (r) => {
  let e;
  return r ? e = r : typeof fetch > "u" ? e = (...t) => zt(void 0, void 0, void 0, function* () {
    return yield (yield Promise.resolve().then(() => Pe)).fetch(...t);
  }) : e = fetch, (...t) => e(...t);
}, Bs = () => zt(void 0, void 0, void 0, function* () {
  return typeof Response > "u" ? (yield Promise.resolve().then(() => Pe)).Response : Response;
});
var de = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
const He = (r) => r.msg || r.message || r.error_description || r.error || JSON.stringify(r), Fs = (r, e) => de(void 0, void 0, void 0, function* () {
  const t = yield Bs();
  r instanceof t ? r.json().then((n) => {
    e(new Hs(He(n), r.status || 500));
  }).catch((n) => {
    e(new Ot(He(n), n));
  }) : e(new Ot(He(r), r));
}), Gs = (r, e, t, n) => {
  const s = { method: r, headers: (e == null ? void 0 : e.headers) || {} };
  return r === "GET" ? s : (s.headers = Object.assign({ "Content-Type": "application/json" }, e == null ? void 0 : e.headers), s.body = JSON.stringify(n), Object.assign(Object.assign({}, s), t));
};
function ke(r, e, t, n, s, i) {
  return de(this, void 0, void 0, function* () {
    return new Promise((o, c) => {
      r(t, Gs(e, n, s, i)).then((l) => {
        if (!l.ok)
          throw l;
        return n != null && n.noResolveJson ? l : l.json();
      }).then((l) => o(l)).catch((l) => Fs(l, c));
    });
  });
}
function tt(r, e, t, n) {
  return de(this, void 0, void 0, function* () {
    return ke(r, "GET", e, t, n);
  });
}
function re(r, e, t, n, s) {
  return de(this, void 0, void 0, function* () {
    return ke(r, "POST", e, n, s, t);
  });
}
function Ks(r, e, t, n, s) {
  return de(this, void 0, void 0, function* () {
    return ke(r, "PUT", e, n, s, t);
  });
}
function Wt(r, e, t, n, s) {
  return de(this, void 0, void 0, function* () {
    return ke(r, "DELETE", e, n, s, t);
  });
}
var K = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
const Js = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: "name",
    order: "asc"
  }
}, At = {
  cacheControl: "3600",
  contentType: "text/plain;charset=UTF-8",
  upsert: !1
};
class Xs {
  constructor(e, t = {}, n, s) {
    this.url = e, this.headers = t, this.bucketId = n, this.fetch = Yt(s);
  }
  /**
   * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
   *
   * @param method HTTP method.
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadOrUpdate(e, t, n, s) {
    return K(this, void 0, void 0, function* () {
      try {
        let i;
        const o = Object.assign(Object.assign({}, At), s), c = Object.assign(Object.assign({}, this.headers), e === "POST" && { "x-upsert": String(o.upsert) });
        typeof Blob < "u" && n instanceof Blob ? (i = new FormData(), i.append("cacheControl", o.cacheControl), i.append("", n)) : typeof FormData < "u" && n instanceof FormData ? (i = n, i.append("cacheControl", o.cacheControl)) : (i = n, c["cache-control"] = `max-age=${o.cacheControl}`, c["content-type"] = o.contentType);
        const l = this._removeEmptyFolders(t), a = this._getFinalPath(l), h = yield this.fetch(`${this.url}/object/${a}`, Object.assign({ method: e, body: i, headers: c }, o != null && o.duplex ? { duplex: o.duplex } : {}));
        return h.ok ? {
          data: { path: l },
          error: null
        } : { data: null, error: yield h.json() };
      } catch (i) {
        if (L(i))
          return { data: null, error: i };
        throw i;
      }
    });
  }
  /**
   * Uploads a file to an existing bucket.
   *
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  upload(e, t, n) {
    return K(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("POST", e, t, n);
    });
  }
  /**
   * Upload a file with a token generated from `createSignedUploadUrl`.
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param token The token generated from `createSignedUploadUrl`
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadToSignedUrl(e, t, n, s) {
    return K(this, void 0, void 0, function* () {
      const i = this._removeEmptyFolders(e), o = this._getFinalPath(i), c = new URL(this.url + `/object/upload/sign/${o}`);
      c.searchParams.set("token", t);
      try {
        let l;
        const a = Object.assign({ upsert: At.upsert }, s), h = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(a.upsert) });
        typeof Blob < "u" && n instanceof Blob ? (l = new FormData(), l.append("cacheControl", a.cacheControl), l.append("", n)) : typeof FormData < "u" && n instanceof FormData ? (l = n, l.append("cacheControl", a.cacheControl)) : (l = n, h["cache-control"] = `max-age=${a.cacheControl}`, h["content-type"] = a.contentType);
        const f = yield this.fetch(c.toString(), {
          method: "PUT",
          body: l,
          headers: h
        });
        return f.ok ? {
          data: { path: i },
          error: null
        } : { data: null, error: yield f.json() };
      } catch (l) {
        if (L(l))
          return { data: null, error: l };
        throw l;
      }
    });
  }
  /**
   * Creates a signed upload URL.
   * Signed upload URLs can be used to upload files to the bucket without further authentication.
   * They are valid for one minute.
   * @param path The file path, including the current file name. For example `folder/image.png`.
   */
  createSignedUploadUrl(e) {
    return K(this, void 0, void 0, function* () {
      try {
        let t = this._getFinalPath(e);
        const n = yield re(this.fetch, `${this.url}/object/upload/sign/${t}`, {}, { headers: this.headers }), s = new URL(this.url + n.url), i = s.searchParams.get("token");
        if (!i)
          throw new lt("No token returned by API");
        return { data: { signedUrl: s.toString(), path: e, token: i }, error: null };
      } catch (t) {
        if (L(t))
          return { data: null, error: t };
        throw t;
      }
    });
  }
  /**
   * Replaces an existing file at the specified path with a new one.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  update(e, t, n) {
    return K(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("PUT", e, t, n);
    });
  }
  /**
   * Moves an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
   */
  move(e, t) {
    return K(this, void 0, void 0, function* () {
      try {
        return { data: yield re(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: e, destinationKey: t }, { headers: this.headers }), error: null };
      } catch (n) {
        if (L(n))
          return { data: null, error: n };
        throw n;
      }
    });
  }
  /**
   * Copies an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
   */
  copy(e, t) {
    return K(this, void 0, void 0, function* () {
      try {
        return { data: { path: (yield re(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: e, destinationKey: t }, { headers: this.headers })).Key }, error: null };
      } catch (n) {
        if (L(n))
          return { data: null, error: n };
        throw n;
      }
    });
  }
  /**
   * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  createSignedUrl(e, t, n) {
    return K(this, void 0, void 0, function* () {
      try {
        let s = this._getFinalPath(e), i = yield re(this.fetch, `${this.url}/object/sign/${s}`, Object.assign({ expiresIn: t }, n != null && n.transform ? { transform: n.transform } : {}), { headers: this.headers });
        const o = n != null && n.download ? `&download=${n.download === !0 ? "" : n.download}` : "";
        return i = { signedUrl: encodeURI(`${this.url}${i.signedURL}${o}`) }, { data: i, error: null };
      } catch (s) {
        if (L(s))
          return { data: null, error: s };
        throw s;
      }
    });
  }
  /**
   * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
   * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   */
  createSignedUrls(e, t, n) {
    return K(this, void 0, void 0, function* () {
      try {
        const s = yield re(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn: t, paths: e }, { headers: this.headers }), i = n != null && n.download ? `&download=${n.download === !0 ? "" : n.download}` : "";
        return {
          data: s.map((o) => Object.assign(Object.assign({}, o), { signedUrl: o.signedURL ? encodeURI(`${this.url}${o.signedURL}${i}`) : null })),
          error: null
        };
      } catch (s) {
        if (L(s))
          return { data: null, error: s };
        throw s;
      }
    });
  }
  /**
   * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
   *
   * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
   * @param options.transform Transform the asset before serving it to the client.
   */
  download(e, t) {
    return K(this, void 0, void 0, function* () {
      const s = typeof (t == null ? void 0 : t.transform) < "u" ? "render/image/authenticated" : "object", i = this.transformOptsToQueryString((t == null ? void 0 : t.transform) || {}), o = i ? `?${i}` : "";
      try {
        const c = this._getFinalPath(e);
        return { data: yield (yield tt(this.fetch, `${this.url}/${s}/${c}${o}`, {
          headers: this.headers,
          noResolveJson: !0
        })).blob(), error: null };
      } catch (c) {
        if (L(c))
          return { data: null, error: c };
        throw c;
      }
    });
  }
  /**
   * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
   * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
   *
   * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
   * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  getPublicUrl(e, t) {
    const n = this._getFinalPath(e), s = [], i = t != null && t.download ? `download=${t.download === !0 ? "" : t.download}` : "";
    i !== "" && s.push(i);
    const c = typeof (t == null ? void 0 : t.transform) < "u" ? "render/image" : "object", l = this.transformOptsToQueryString((t == null ? void 0 : t.transform) || {});
    l !== "" && s.push(l);
    let a = s.join("&");
    return a !== "" && (a = `?${a}`), {
      data: { publicUrl: encodeURI(`${this.url}/${c}/public/${n}${a}`) }
    };
  }
  /**
   * Deletes files within the same bucket
   *
   * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
   */
  remove(e) {
    return K(this, void 0, void 0, function* () {
      try {
        return { data: yield Wt(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: e }, { headers: this.headers }), error: null };
      } catch (t) {
        if (L(t))
          return { data: null, error: t };
        throw t;
      }
    });
  }
  /**
   * Get file metadata
   * @param id the file id to retrieve metadata
   */
  // async getMetadata(
  //   id: string
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Update file metadata
   * @param id the file id to update metadata
   * @param meta the new file metadata
   */
  // async updateMetadata(
  //   id: string,
  //   meta: Metadata
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await post(
  //       this.fetch,
  //       `${this.url}/metadata/${id}`,
  //       { ...meta },
  //       { headers: this.headers }
  //     )
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Lists all the files within a bucket.
   * @param path The folder path.
   */
  list(e, t, n) {
    return K(this, void 0, void 0, function* () {
      try {
        const s = Object.assign(Object.assign(Object.assign({}, Js), t), { prefix: e || "" });
        return { data: yield re(this.fetch, `${this.url}/object/list/${this.bucketId}`, s, { headers: this.headers }, n), error: null };
      } catch (s) {
        if (L(s))
          return { data: null, error: s };
        throw s;
      }
    });
  }
  _getFinalPath(e) {
    return `${this.bucketId}/${e}`;
  }
  _removeEmptyFolders(e) {
    return e.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
  }
  transformOptsToQueryString(e) {
    const t = [];
    return e.width && t.push(`width=${e.width}`), e.height && t.push(`height=${e.height}`), e.resize && t.push(`resize=${e.resize}`), e.format && t.push(`format=${e.format}`), e.quality && t.push(`quality=${e.quality}`), t.join("&");
  }
}
const zs = "2.5.1", Ys = { "X-Client-Info": `storage-js/${zs}` };
var le = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
class Ws {
  constructor(e, t = {}, n) {
    this.url = e, this.headers = Object.assign(Object.assign({}, Ys), t), this.fetch = Yt(n);
  }
  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  listBuckets() {
    return le(this, void 0, void 0, function* () {
      try {
        return { data: yield tt(this.fetch, `${this.url}/bucket`, { headers: this.headers }), error: null };
      } catch (e) {
        if (L(e))
          return { data: null, error: e };
        throw e;
      }
    });
  }
  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  getBucket(e) {
    return le(this, void 0, void 0, function* () {
      try {
        return { data: yield tt(this.fetch, `${this.url}/bucket/${e}`, { headers: this.headers }), error: null };
      } catch (t) {
        if (L(t))
          return { data: null, error: t };
        throw t;
      }
    });
  }
  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   * @returns newly created bucket id
   */
  createBucket(e, t = {
    public: !1
  }) {
    return le(this, void 0, void 0, function* () {
      try {
        return { data: yield re(this.fetch, `${this.url}/bucket`, {
          id: e,
          name: e,
          public: t.public,
          file_size_limit: t.fileSizeLimit,
          allowed_mime_types: t.allowedMimeTypes
        }, { headers: this.headers }), error: null };
      } catch (n) {
        if (L(n))
          return { data: null, error: n };
        throw n;
      }
    });
  }
  /**
   * Updates a Storage bucket
   *
   * @param id A unique identifier for the bucket you are updating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   */
  updateBucket(e, t) {
    return le(this, void 0, void 0, function* () {
      try {
        return { data: yield Ks(this.fetch, `${this.url}/bucket/${e}`, {
          id: e,
          name: e,
          public: t.public,
          file_size_limit: t.fileSizeLimit,
          allowed_mime_types: t.allowedMimeTypes
        }, { headers: this.headers }), error: null };
      } catch (n) {
        if (L(n))
          return { data: null, error: n };
        throw n;
      }
    });
  }
  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  emptyBucket(e) {
    return le(this, void 0, void 0, function* () {
      try {
        return { data: yield re(this.fetch, `${this.url}/bucket/${e}/empty`, {}, { headers: this.headers }), error: null };
      } catch (t) {
        if (L(t))
          return { data: null, error: t };
        throw t;
      }
    });
  }
  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  deleteBucket(e) {
    return le(this, void 0, void 0, function* () {
      try {
        return { data: yield Wt(this.fetch, `${this.url}/bucket/${e}`, {}, { headers: this.headers }), error: null };
      } catch (t) {
        if (L(t))
          return { data: null, error: t };
        throw t;
      }
    });
  }
}
class Vs extends Ws {
  constructor(e, t = {}, n) {
    super(e, t, n);
  }
  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */
  from(e) {
    return new Xs(this.url, this.headers, e, this.fetch);
  }
}
const qs = "2.22.0", Qs = { "X-Client-Info": `supabase-js/${qs}` };
var Zs = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
const ei = (r) => {
  let e;
  return r ? e = r : typeof fetch > "u" ? e = at : e = fetch, (...t) => e(...t);
}, ti = () => typeof Headers > "u" ? ot.Headers : Headers, ri = (r, e, t) => {
  const n = ei(t), s = ti();
  return (i, o) => Zs(void 0, void 0, void 0, function* () {
    var c;
    const l = (c = yield e()) !== null && c !== void 0 ? c : r;
    let a = new s(o == null ? void 0 : o.headers);
    return a.has("apikey") || a.set("apikey", r), a.has("Authorization") || a.set("Authorization", `Bearer ${l}`), n(i, Object.assign(Object.assign({}, o), { headers: a }));
  });
};
function ni(r) {
  return r.replace(/\/$/, "");
}
function si(r, e) {
  const { db: t, auth: n, realtime: s, global: i } = r, { db: o, auth: c, realtime: l, global: a } = e;
  return {
    db: Object.assign(Object.assign({}, o), t),
    auth: Object.assign(Object.assign({}, c), n),
    realtime: Object.assign(Object.assign({}, l), s),
    global: Object.assign(Object.assign({}, a), i)
  };
}
var ce = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
function ii(r) {
  return Math.round(Date.now() / 1e3) + r;
}
function oi() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(r) {
    const e = Math.random() * 16 | 0;
    return (r == "x" ? e : e & 3 | 8).toString(16);
  });
}
const te = () => typeof document < "u", ne = {
  tested: !1,
  writable: !1
}, Be = () => {
  if (!te())
    return !1;
  try {
    if (typeof globalThis.localStorage != "object")
      return !1;
  } catch {
    return !1;
  }
  if (ne.tested)
    return ne.writable;
  const r = `lswt-${Math.random()}${Math.random()}`;
  try {
    globalThis.localStorage.setItem(r, r), globalThis.localStorage.removeItem(r), ne.tested = !0, ne.writable = !0;
  } catch {
    ne.tested = !0, ne.writable = !1;
  }
  return ne.writable;
};
function B(r, e) {
  var t;
  e || (e = ((t = window == null ? void 0 : window.location) === null || t === void 0 ? void 0 : t.href) || ""), r = r.replace(/[\[\]]/g, "\\$&");
  const n = new RegExp("[?&#]" + r + "(=([^&#]*)|&|#|$)"), s = n.exec(e);
  return s ? s[2] ? decodeURIComponent(s[2].replace(/\+/g, " ")) : "" : null;
}
const Vt = (r) => {
  let e;
  return r ? e = r : typeof fetch > "u" ? e = (...t) => ce(void 0, void 0, void 0, function* () {
    return yield (yield Promise.resolve().then(() => Pe)).fetch(...t);
  }) : e = fetch, (...t) => e(...t);
}, ai = (r) => typeof r == "object" && r !== null && "status" in r && "ok" in r && "json" in r && typeof r.json == "function", _e = (r, e, t) => ce(void 0, void 0, void 0, function* () {
  yield r.setItem(e, JSON.stringify(t));
}), Se = (r, e) => ce(void 0, void 0, void 0, function* () {
  const t = yield r.getItem(e);
  if (!t)
    return null;
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}), Fe = (r, e) => ce(void 0, void 0, void 0, function* () {
  yield r.removeItem(e);
});
function ci(r) {
  const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let t = "", n, s, i, o, c, l, a, h = 0;
  for (r = r.replace("-", "+").replace("_", "/"); h < r.length; )
    o = e.indexOf(r.charAt(h++)), c = e.indexOf(r.charAt(h++)), l = e.indexOf(r.charAt(h++)), a = e.indexOf(r.charAt(h++)), n = o << 2 | c >> 4, s = (c & 15) << 4 | l >> 2, i = (l & 3) << 6 | a, t = t + String.fromCharCode(n), l != 64 && s != 0 && (t = t + String.fromCharCode(s)), a != 64 && i != 0 && (t = t + String.fromCharCode(i));
  return t;
}
class je {
  constructor() {
    this.promise = new je.promiseConstructor((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}
je.promiseConstructor = Promise;
function Rt(r) {
  const e = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i, t = r.split(".");
  if (t.length !== 3)
    throw new Error("JWT is not valid: not a JWT structure");
  if (!e.test(t[1]))
    throw new Error("JWT is not valid: payload is not in base64url format");
  const n = t[1];
  return JSON.parse(ci(n));
}
function li(r) {
  return new Promise((e) => {
    setTimeout(() => e(null), r);
  });
}
function hi(r, e) {
  return new Promise((n, s) => {
    ce(this, void 0, void 0, function* () {
      for (let i = 0; i < 1 / 0; i++)
        try {
          const o = yield r(i);
          if (!e(i, null, o)) {
            n(o);
            return;
          }
        } catch (o) {
          if (!e(i, o)) {
            s(o);
            return;
          }
        }
    });
  });
}
function ui(r) {
  return ("0" + r.toString(16)).substr(-2);
}
function Oe() {
  const e = new Uint32Array(56);
  if (typeof crypto > "u") {
    const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", n = t.length;
    let s = "";
    for (let i = 0; i < 56; i++)
      s += t.charAt(Math.floor(Math.random() * n));
    return s;
  }
  return crypto.getRandomValues(e), Array.from(e, ui).join("");
}
function di(r) {
  return ce(this, void 0, void 0, function* () {
    const t = new TextEncoder().encode(r), n = yield crypto.subtle.digest("SHA-256", t), s = new Uint8Array(n);
    return Array.from(s).map((i) => String.fromCharCode(i)).join("");
  });
}
function fi(r) {
  return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function Ae(r) {
  return ce(this, void 0, void 0, function* () {
    if (typeof crypto > "u")
      return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), r;
    const e = yield di(r);
    return fi(e);
  });
}
class ht extends Error {
  constructor(e, t) {
    super(e), this.__isAuthError = !0, this.name = "AuthError", this.status = t;
  }
}
function A(r) {
  return typeof r == "object" && r !== null && "__isAuthError" in r;
}
class pi extends ht {
  constructor(e, t) {
    super(e, t), this.name = "AuthApiError", this.status = t;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
function _i(r) {
  return A(r) && r.name === "AuthApiError";
}
class qt extends ht {
  constructor(e, t) {
    super(e), this.name = "AuthUnknownError", this.originalError = t;
  }
}
class Te extends ht {
  constructor(e, t, n) {
    super(e), this.name = t, this.status = n;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
class me extends Te {
  constructor() {
    super("Auth session missing!", "AuthSessionMissingError", 400);
  }
}
class Re extends Te {
  constructor(e) {
    super(e, "AuthInvalidCredentialsError", 400);
  }
}
class V extends Te {
  constructor(e, t = null) {
    super(e, "AuthImplicitGrantRedirectError", 500), this.details = null, this.details = t;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
class Ge extends Te {
  constructor(e, t = null) {
    super(e, "AuthPKCEGrantCodeExchangeError", 500), this.details = null, this.details = t;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
class rt extends Te {
  constructor(e, t) {
    super(e, "AuthRetryableFetchError", t);
  }
}
var ut = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
}, mi = globalThis && globalThis.__rest || function(r, e) {
  var t = {};
  for (var n in r)
    Object.prototype.hasOwnProperty.call(r, n) && e.indexOf(n) < 0 && (t[n] = r[n]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(r); s < n.length; s++)
      e.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(r, n[s]) && (t[n[s]] = r[n[s]]);
  return t;
};
const Ce = (r) => r.msg || r.message || r.error_description || r.error || JSON.stringify(r), gi = (r, e) => ut(void 0, void 0, void 0, function* () {
  const t = [502, 503, 504];
  ai(r) ? t.includes(r.status) ? e(new rt(Ce(r), r.status)) : r.json().then((n) => {
    e(new pi(Ce(n), r.status || 500));
  }).catch((n) => {
    e(new qt(Ce(n), n));
  }) : e(new rt(Ce(r), 0));
}), yi = (r, e, t, n) => {
  const s = { method: r, headers: (e == null ? void 0 : e.headers) || {} };
  return r === "GET" ? s : (s.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, e == null ? void 0 : e.headers), s.body = JSON.stringify(n), Object.assign(Object.assign({}, s), t));
};
function R(r, e, t, n) {
  var s;
  return ut(this, void 0, void 0, function* () {
    const i = Object.assign({}, n == null ? void 0 : n.headers);
    n != null && n.jwt && (i.Authorization = `Bearer ${n.jwt}`);
    const o = (s = n == null ? void 0 : n.query) !== null && s !== void 0 ? s : {};
    n != null && n.redirectTo && (o.redirect_to = n.redirectTo);
    const c = Object.keys(o).length ? "?" + new URLSearchParams(o).toString() : "", l = yield vi(r, e, t + c, { headers: i, noResolveJson: n == null ? void 0 : n.noResolveJson }, {}, n == null ? void 0 : n.body);
    return n != null && n.xform ? n == null ? void 0 : n.xform(l) : { data: Object.assign({}, l), error: null };
  });
}
function vi(r, e, t, n, s, i) {
  return ut(this, void 0, void 0, function* () {
    return new Promise((o, c) => {
      r(t, yi(e, n, s, i)).then((l) => {
        if (!l.ok)
          throw l;
        return n != null && n.noResolveJson ? l : l.json();
      }).then((l) => o(l)).catch((l) => gi(l, c));
    });
  });
}
function ee(r) {
  var e;
  let t = null;
  wi(r) && (t = Object.assign({}, r), t.expires_at = ii(r.expires_in));
  const n = (e = r.user) !== null && e !== void 0 ? e : r;
  return { data: { session: t, user: n }, error: null };
}
function oe(r) {
  var e;
  return { data: { user: (e = r.user) !== null && e !== void 0 ? e : r }, error: null };
}
function bi(r) {
  return { data: r, error: null };
}
function Ei(r) {
  const { action_link: e, email_otp: t, hashed_token: n, redirect_to: s, verification_type: i } = r, o = mi(r, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]), c = {
    action_link: e,
    email_otp: t,
    hashed_token: n,
    redirect_to: s,
    verification_type: i
  }, l = Object.assign({}, o);
  return {
    data: {
      properties: c,
      user: l
    },
    error: null
  };
}
function Ti(r) {
  return r;
}
function wi(r) {
  return r.access_token && r.refresh_token && r.expires_in;
}
var Y = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
}, Si = globalThis && globalThis.__rest || function(r, e) {
  var t = {};
  for (var n in r)
    Object.prototype.hasOwnProperty.call(r, n) && e.indexOf(n) < 0 && (t[n] = r[n]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, n = Object.getOwnPropertySymbols(r); s < n.length; s++)
      e.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(r, n[s]) && (t[n[s]] = r[n[s]]);
  return t;
};
class Oi {
  constructor({ url: e = "", headers: t = {}, fetch: n }) {
    this.url = e, this.headers = t, this.fetch = Vt(n), this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this)
    };
  }
  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   */
  signOut(e) {
    return Y(this, void 0, void 0, function* () {
      try {
        return yield R(this.fetch, "POST", `${this.url}/logout`, {
          headers: this.headers,
          jwt: e,
          noResolveJson: !0
        }), { data: null, error: null };
      } catch (t) {
        if (A(t))
          return { data: null, error: t };
        throw t;
      }
    });
  }
  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options.redirectTo A URL or mobile deeplink to send the user to after they are confirmed.
   * @param options.data Optional user metadata
   */
  inviteUserByEmail(e, t = {}) {
    return Y(this, void 0, void 0, function* () {
      try {
        return yield R(this.fetch, "POST", `${this.url}/invite`, {
          body: { email: e, data: t.data },
          headers: this.headers,
          redirectTo: t.redirectTo,
          xform: oe
        });
      } catch (n) {
        if (A(n))
          return { data: { user: null }, error: n };
        throw n;
      }
    });
  }
  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param email The user's email.
   * @param options.password User password. For signup only.
   * @param options.data Optional user metadata. For signup only.
   * @param options.redirectTo The redirect url which should be appended to the generated link
   */
  generateLink(e) {
    return Y(this, void 0, void 0, function* () {
      try {
        const { options: t } = e, n = Si(e, ["options"]), s = Object.assign(Object.assign({}, n), t);
        return "newEmail" in n && (s.new_email = n == null ? void 0 : n.newEmail, delete s.newEmail), yield R(this.fetch, "POST", `${this.url}/admin/generate_link`, {
          body: s,
          headers: this.headers,
          xform: Ei,
          redirectTo: t == null ? void 0 : t.redirectTo
        });
      } catch (t) {
        if (A(t))
          return {
            data: {
              properties: null,
              user: null
            },
            error: t
          };
        throw t;
      }
    });
  }
  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  createUser(e) {
    return Y(this, void 0, void 0, function* () {
      try {
        return yield R(this.fetch, "POST", `${this.url}/admin/users`, {
          body: e,
          headers: this.headers,
          xform: oe
        });
      } catch (t) {
        if (A(t))
          return { data: { user: null }, error: t };
        throw t;
      }
    });
  }
  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   */
  listUsers(e) {
    var t, n, s, i, o, c, l;
    return Y(this, void 0, void 0, function* () {
      try {
        const a = { nextPage: null, lastPage: 0, total: 0 }, h = yield R(this.fetch, "GET", `${this.url}/admin/users`, {
          headers: this.headers,
          noResolveJson: !0,
          query: {
            page: (n = (t = e == null ? void 0 : e.page) === null || t === void 0 ? void 0 : t.toString()) !== null && n !== void 0 ? n : "",
            per_page: (i = (s = e == null ? void 0 : e.perPage) === null || s === void 0 ? void 0 : s.toString()) !== null && i !== void 0 ? i : ""
          },
          xform: Ti
        });
        if (h.error)
          throw h.error;
        const f = yield h.json(), p = (o = h.headers.get("x-total-count")) !== null && o !== void 0 ? o : 0, g = (l = (c = h.headers.get("link")) === null || c === void 0 ? void 0 : c.split(",")) !== null && l !== void 0 ? l : [];
        return g.length > 0 && (g.forEach((m) => {
          const b = parseInt(m.split(";")[0].split("=")[1].substring(0, 1)), v = JSON.parse(m.split(";")[1].split("=")[1]);
          a[`${v}Page`] = b;
        }), a.total = parseInt(p)), { data: Object.assign(Object.assign({}, f), a), error: null };
      } catch (a) {
        if (A(a))
          return { data: { users: [] }, error: a };
        throw a;
      }
    });
  }
  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  getUserById(e) {
    return Y(this, void 0, void 0, function* () {
      try {
        return yield R(this.fetch, "GET", `${this.url}/admin/users/${e}`, {
          headers: this.headers,
          xform: oe
        });
      } catch (t) {
        if (A(t))
          return { data: { user: null }, error: t };
        throw t;
      }
    });
  }
  /**
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  updateUserById(e, t) {
    return Y(this, void 0, void 0, function* () {
      try {
        return yield R(this.fetch, "PUT", `${this.url}/admin/users/${e}`, {
          body: t,
          headers: this.headers,
          xform: oe
        });
      } catch (n) {
        if (A(n))
          return { data: { user: null }, error: n };
        throw n;
      }
    });
  }
  /**
   * Delete a user. Requires a `service_role` key.
   *
   * @param id The user id you want to remove.
   * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema.
   * Defaults to false for backward compatibility.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  deleteUser(e, t = !1) {
    return Y(this, void 0, void 0, function* () {
      try {
        return yield R(this.fetch, "DELETE", `${this.url}/admin/users/${e}`, {
          headers: this.headers,
          body: {
            should_soft_delete: t
          },
          xform: oe
        });
      } catch (n) {
        if (A(n))
          return { data: { user: null }, error: n };
        throw n;
      }
    });
  }
  _listFactors(e) {
    return Y(this, void 0, void 0, function* () {
      try {
        const { data: t, error: n } = yield R(this.fetch, "GET", `${this.url}/admin/users/${e.userId}/factors`, {
          headers: this.headers,
          xform: (s) => ({ data: { factors: s }, error: null })
        });
        return { data: t, error: n };
      } catch (t) {
        if (A(t))
          return { data: null, error: t };
        throw t;
      }
    });
  }
  _deleteFactor(e) {
    return Y(this, void 0, void 0, function* () {
      try {
        return { data: yield R(this.fetch, "DELETE", `${this.url}/admin/users/${e.userId}/factors/${e.id}`, {
          headers: this.headers
        }), error: null };
      } catch (t) {
        if (A(t))
          return { data: null, error: t };
        throw t;
      }
    });
  }
}
const Ai = "2.27.0", Ri = "http://localhost:9999", Ci = "supabase.auth.token", Ni = { "X-Client-Info": `gotrue-js/${Ai}` }, Ii = 10, $i = {
  getItem: (r) => Be() ? globalThis.localStorage.getItem(r) : null,
  setItem: (r, e) => {
    Be() && globalThis.localStorage.setItem(r, e);
  },
  removeItem: (r) => {
    Be() && globalThis.localStorage.removeItem(r);
  }
};
function Pi() {
  if (typeof globalThis != "object")
    try {
      Object.defineProperty(Object.prototype, "__magic__", {
        get: function() {
          return this;
        },
        configurable: !0
      }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
    } catch {
      typeof self < "u" && (self.globalThis = self);
    }
}
var E = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
Pi();
const ki = {
  url: Ri,
  storageKey: Ci,
  autoRefreshToken: !0,
  persistSession: !0,
  detectSessionInUrl: !0,
  headers: Ni,
  flowType: "implicit"
}, Ke = 30 * 1e3, ji = 3;
class Ui {
  /**
   * Create a new client for use in the browser.
   */
  constructor(e) {
    var t;
    this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = !0, this.broadcastChannel = null;
    const n = Object.assign(Object.assign({}, ki), e);
    if (this.inMemorySession = null, this.storageKey = n.storageKey, this.autoRefreshToken = n.autoRefreshToken, this.persistSession = n.persistSession, this.storage = n.storage || $i, this.admin = new Oi({
      url: n.url,
      headers: n.headers,
      fetch: n.fetch
    }), this.url = n.url, this.headers = n.headers, this.fetch = Vt(n.fetch), this.detectSessionInUrl = n.detectSessionInUrl, this.flowType = n.flowType, this.mfa = {
      verify: this._verify.bind(this),
      enroll: this._enroll.bind(this),
      unenroll: this._unenroll.bind(this),
      challenge: this._challenge.bind(this),
      listFactors: this._listFactors.bind(this),
      challengeAndVerify: this._challengeAndVerify.bind(this),
      getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
    }, te() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
      } catch (s) {
        console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", s);
      }
      (t = this.broadcastChannel) === null || t === void 0 || t.addEventListener("message", (s) => {
        this._notifyAllSubscribers(s.data.event, s.data.session, !1);
      });
    }
    this.initialize();
  }
  /**
   * Initializes the client session either from the url or from storage.
   * This method is automatically called when instantiating the client, but should also be called
   * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
   */
  initialize() {
    return this.initializePromise || (this.initializePromise = this._initialize()), this.initializePromise;
  }
  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  _initialize() {
    return E(this, void 0, void 0, function* () {
      if (this.initializePromise)
        return this.initializePromise;
      try {
        const e = yield this._isPKCEFlow();
        if (this.detectSessionInUrl && this._isImplicitGrantFlow() || e) {
          const { data: t, error: n } = yield this._getSessionFromUrl(e);
          if (n)
            return yield this._removeSession(), { error: n };
          const { session: s, redirectType: i } = t;
          return yield this._saveSession(s), setTimeout(() => {
            i === "recovery" ? this._notifyAllSubscribers("PASSWORD_RECOVERY", s) : this._notifyAllSubscribers("SIGNED_IN", s);
          }, 0), { error: null };
        }
        return yield this._recoverAndRefresh(), { error: null };
      } catch (e) {
        return A(e) ? { error: e } : {
          error: new qt("Unexpected error during initialization", e)
        };
      } finally {
        yield this._handleVisibilityChange();
      }
    });
  }
  /**
   * Creates a new user.
   *
   * Be aware that if a user account exists in the system you may get back an
   * error message that attempts to hide this information from the user.
   *
   * @returns A logged-in session if the server has "autoconfirm" ON
   * @returns A user if the server has "autoconfirm" OFF
   */
  signUp(e) {
    var t, n, s;
    return E(this, void 0, void 0, function* () {
      try {
        yield this._removeSession();
        let i;
        if ("email" in e) {
          const { email: h, password: f, options: p } = e;
          let g = null, m = null;
          if (this.flowType === "pkce") {
            const b = Oe();
            yield _e(this.storage, `${this.storageKey}-code-verifier`, b), g = yield Ae(b), m = b === g ? "plain" : "s256";
          }
          i = yield R(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            redirectTo: p == null ? void 0 : p.emailRedirectTo,
            body: {
              email: h,
              password: f,
              data: (t = p == null ? void 0 : p.data) !== null && t !== void 0 ? t : {},
              gotrue_meta_security: { captcha_token: p == null ? void 0 : p.captchaToken },
              code_challenge: g,
              code_challenge_method: m
            },
            xform: ee
          });
        } else if ("phone" in e) {
          const { phone: h, password: f, options: p } = e;
          i = yield R(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            body: {
              phone: h,
              password: f,
              data: (n = p == null ? void 0 : p.data) !== null && n !== void 0 ? n : {},
              channel: (s = p == null ? void 0 : p.channel) !== null && s !== void 0 ? s : "sms",
              gotrue_meta_security: { captcha_token: p == null ? void 0 : p.captchaToken }
            },
            xform: ee
          });
        } else
          throw new Re("You must provide either an email or phone number and a password");
        const { data: o, error: c } = i;
        if (c || !o)
          return { data: { user: null, session: null }, error: c };
        const l = o.session, a = o.user;
        return o.session && (yield this._saveSession(o.session), this._notifyAllSubscribers("SIGNED_IN", l)), { data: { user: a, session: l }, error: null };
      } catch (i) {
        if (A(i))
          return { data: { user: null, session: null }, error: i };
        throw i;
      }
    });
  }
  /**
   * Log in an existing user with an email and password or phone and password.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or that the
   * email/phone and password combination is wrong or that the account can only
   * be accessed via social login.
   */
  signInWithPassword(e) {
    return E(this, void 0, void 0, function* () {
      try {
        yield this._removeSession();
        let t;
        if ("email" in e) {
          const { email: i, password: o, options: c } = e;
          t = yield R(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
            headers: this.headers,
            body: {
              email: i,
              password: o,
              gotrue_meta_security: { captcha_token: c == null ? void 0 : c.captchaToken }
            },
            xform: ee
          });
        } else if ("phone" in e) {
          const { phone: i, password: o, options: c } = e;
          t = yield R(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
            headers: this.headers,
            body: {
              phone: i,
              password: o,
              gotrue_meta_security: { captcha_token: c == null ? void 0 : c.captchaToken }
            },
            xform: ee
          });
        } else
          throw new Re("You must provide either an email or phone number and a password");
        const { data: n, error: s } = t;
        return s || !n ? { data: { user: null, session: null }, error: s } : (n.session && (yield this._saveSession(n.session), this._notifyAllSubscribers("SIGNED_IN", n.session)), { data: n, error: s });
      } catch (t) {
        if (A(t))
          return { data: { user: null, session: null }, error: t };
        throw t;
      }
    });
  }
  /**
   * Log in an existing user via a third-party provider.
   */
  signInWithOAuth(e) {
    var t, n, s, i;
    return E(this, void 0, void 0, function* () {
      return yield this._removeSession(), yield this._handleProviderSignIn(e.provider, {
        redirectTo: (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo,
        scopes: (n = e.options) === null || n === void 0 ? void 0 : n.scopes,
        queryParams: (s = e.options) === null || s === void 0 ? void 0 : s.queryParams,
        skipBrowserRedirect: (i = e.options) === null || i === void 0 ? void 0 : i.skipBrowserRedirect
      });
    });
  }
  /**
   * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
   */
  exchangeCodeForSession(e) {
    return E(this, void 0, void 0, function* () {
      const t = yield Se(this.storage, `${this.storageKey}-code-verifier`), { data: n, error: s } = yield R(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
        headers: this.headers,
        body: {
          auth_code: e,
          code_verifier: t
        },
        xform: ee
      });
      return yield Fe(this.storage, `${this.storageKey}-code-verifier`), s || !n ? { data: { user: null, session: null }, error: s } : (n.session && (yield this._saveSession(n.session), this._notifyAllSubscribers("SIGNED_IN", n.session)), { data: n, error: s });
    });
  }
  /**
   * Allows signing in with an ID token issued by certain supported providers.
   * The ID token is verified for validity and a new session is established.
   *
   * @experimental
   */
  signInWithIdToken(e) {
    return E(this, void 0, void 0, function* () {
      yield this._removeSession();
      try {
        const { options: t, provider: n, token: s, nonce: i } = e, o = yield R(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
          headers: this.headers,
          body: {
            provider: n,
            id_token: s,
            nonce: i,
            gotrue_meta_security: { captcha_token: t == null ? void 0 : t.captchaToken }
          },
          xform: ee
        }), { data: c, error: l } = o;
        return l || !c ? { data: { user: null, session: null }, error: l } : (c.session && (yield this._saveSession(c.session), this._notifyAllSubscribers("SIGNED_IN", c.session)), { data: c, error: l });
      } catch (t) {
        if (A(t))
          return { data: { user: null, session: null }, error: t };
        throw t;
      }
    });
  }
  /**
   * Log in a user using magiclink or a one-time password (OTP).
   *
   * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
   * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
   * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or, that the account
   * can only be accessed via social login.
   *
   * Do note that you will need to configure a Whatsapp sender on Twilio
   * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
   * channel is not supported on other providers
   * at this time.
   */
  signInWithOtp(e) {
    var t, n, s, i, o;
    return E(this, void 0, void 0, function* () {
      try {
        if (yield this._removeSession(), "email" in e) {
          const { email: c, options: l } = e;
          let a = null, h = null;
          if (this.flowType === "pkce") {
            const p = Oe();
            yield _e(this.storage, `${this.storageKey}-code-verifier`, p), a = yield Ae(p), h = p === a ? "plain" : "s256";
          }
          const { error: f } = yield R(this.fetch, "POST", `${this.url}/otp`, {
            headers: this.headers,
            body: {
              email: c,
              data: (t = l == null ? void 0 : l.data) !== null && t !== void 0 ? t : {},
              create_user: (n = l == null ? void 0 : l.shouldCreateUser) !== null && n !== void 0 ? n : !0,
              gotrue_meta_security: { captcha_token: l == null ? void 0 : l.captchaToken },
              code_challenge: a,
              code_challenge_method: h
            },
            redirectTo: l == null ? void 0 : l.emailRedirectTo
          });
          return { data: { user: null, session: null }, error: f };
        }
        if ("phone" in e) {
          const { phone: c, options: l } = e, { error: a } = yield R(this.fetch, "POST", `${this.url}/otp`, {
            headers: this.headers,
            body: {
              phone: c,
              data: (s = l == null ? void 0 : l.data) !== null && s !== void 0 ? s : {},
              create_user: (i = l == null ? void 0 : l.shouldCreateUser) !== null && i !== void 0 ? i : !0,
              gotrue_meta_security: { captcha_token: l == null ? void 0 : l.captchaToken },
              channel: (o = l == null ? void 0 : l.channel) !== null && o !== void 0 ? o : "sms"
            }
          });
          return { data: { user: null, session: null }, error: a };
        }
        throw new Re("You must provide either an email or phone number.");
      } catch (c) {
        if (A(c))
          return { data: { user: null, session: null }, error: c };
        throw c;
      }
    });
  }
  /**
   * Log in a user given a User supplied OTP received via mobile.
   */
  verifyOtp(e) {
    var t, n;
    return E(this, void 0, void 0, function* () {
      try {
        yield this._removeSession();
        const { data: s, error: i } = yield R(this.fetch, "POST", `${this.url}/verify`, {
          headers: this.headers,
          body: Object.assign(Object.assign({}, e), { gotrue_meta_security: { captcha_token: (t = e.options) === null || t === void 0 ? void 0 : t.captchaToken } }),
          redirectTo: (n = e.options) === null || n === void 0 ? void 0 : n.redirectTo,
          xform: ee
        });
        if (i)
          throw i;
        if (!s)
          throw new Error("An error occurred on token verification.");
        const o = s.session, c = s.user;
        return o != null && o.access_token && (yield this._saveSession(o), this._notifyAllSubscribers("SIGNED_IN", o)), { data: { user: c, session: o }, error: null };
      } catch (s) {
        if (A(s))
          return { data: { user: null, session: null }, error: s };
        throw s;
      }
    });
  }
  /**
   * Attempts a single-sign on using an enterprise Identity Provider. A
   * successful SSO attempt will redirect the current page to the identity
   * provider authorization page. The redirect URL is implementation and SSO
   * protocol specific.
   *
   * You can use it by providing a SSO domain. Typically you can extract this
   * domain by asking users for their email address. If this domain is
   * registered on the Auth instance the redirect will use that organization's
   * currently active SSO Identity Provider for the login.
   *
   * If you have built an organization-specific login page, you can use the
   * organization's SSO Identity Provider UUID directly instead.
   */
  signInWithSSO(e) {
    var t, n, s;
    return E(this, void 0, void 0, function* () {
      try {
        return yield this._removeSession(), yield R(this.fetch, "POST", `${this.url}/sso`, {
          body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in e ? { provider_id: e.providerId } : null), "domain" in e ? { domain: e.domain } : null), { redirect_to: (n = (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo) !== null && n !== void 0 ? n : void 0 }), !((s = e == null ? void 0 : e.options) === null || s === void 0) && s.captchaToken ? { gotrue_meta_security: { captcha_token: e.options.captchaToken } } : null), { skip_http_redirect: !0 }),
          headers: this.headers,
          xform: bi
        });
      } catch (i) {
        if (A(i))
          return { data: null, error: i };
        throw i;
      }
    });
  }
  /**
   * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
   */
  resend(e) {
    return E(this, void 0, void 0, function* () {
      try {
        yield this._removeSession();
        const t = `${this.url}/resend`;
        if ("email" in e) {
          const { email: n, type: s, options: i } = e, { error: o } = yield R(this.fetch, "POST", t, {
            headers: this.headers,
            body: {
              email: n,
              type: s,
              gotrue_meta_security: { captcha_token: i == null ? void 0 : i.captchaToken }
            }
          });
          return { data: { user: null, session: null }, error: o };
        } else if ("phone" in e) {
          const { phone: n, type: s, options: i } = e, { error: o } = yield R(this.fetch, "POST", t, {
            headers: this.headers,
            body: {
              phone: n,
              type: s,
              gotrue_meta_security: { captcha_token: i == null ? void 0 : i.captchaToken }
            }
          });
          return { data: { user: null, session: null }, error: o };
        }
        throw new Re("You must provide either an email or phone number and a type");
      } catch (t) {
        if (A(t))
          return { data: { user: null, session: null }, error: t };
        throw t;
      }
    });
  }
  /**
   * Returns the session, refreshing it if necessary.
   * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
   */
  getSession() {
    return E(this, void 0, void 0, function* () {
      yield this.initializePromise;
      let e = null;
      if (this.persistSession) {
        const i = yield Se(this.storage, this.storageKey);
        i !== null && (this._isValidSession(i) ? e = i : yield this._removeSession());
      } else
        e = this.inMemorySession;
      if (!e)
        return { data: { session: null }, error: null };
      if (!(e.expires_at ? e.expires_at <= Date.now() / 1e3 : !1))
        return { data: { session: e }, error: null };
      const { session: n, error: s } = yield this._callRefreshToken(e.refresh_token);
      return s ? { data: { session: null }, error: s } : { data: { session: n }, error: null };
    });
  }
  /**
   * Gets the current user details if there is an existing session.
   * @param jwt Takes in an optional access token jwt. If no jwt is provided, getUser() will attempt to get the jwt from the current session.
   */
  getUser(e) {
    var t, n;
    return E(this, void 0, void 0, function* () {
      try {
        if (!e) {
          const { data: s, error: i } = yield this.getSession();
          if (i)
            throw i;
          e = (n = (t = s.session) === null || t === void 0 ? void 0 : t.access_token) !== null && n !== void 0 ? n : void 0;
        }
        return yield R(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt: e,
          xform: oe
        });
      } catch (s) {
        if (A(s))
          return { data: { user: null }, error: s };
        throw s;
      }
    });
  }
  /**
   * Updates user data for a logged in user.
   */
  updateUser(e, t = {}) {
    return E(this, void 0, void 0, function* () {
      try {
        const { data: n, error: s } = yield this.getSession();
        if (s)
          throw s;
        if (!n.session)
          throw new me();
        const i = n.session, { data: o, error: c } = yield R(this.fetch, "PUT", `${this.url}/user`, {
          headers: this.headers,
          redirectTo: t == null ? void 0 : t.emailRedirectTo,
          body: e,
          jwt: i.access_token,
          xform: oe
        });
        if (c)
          throw c;
        return i.user = o.user, yield this._saveSession(i), this._notifyAllSubscribers("USER_UPDATED", i), { data: { user: i.user }, error: null };
      } catch (n) {
        if (A(n))
          return { data: { user: null }, error: n };
        throw n;
      }
    });
  }
  /**
   * Decodes a JWT (without performing any validation).
   */
  _decodeJWT(e) {
    return Rt(e);
  }
  /**
   * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
   * If the refresh token or access token in the current session is invalid, an error will be thrown.
   * @param currentSession The current session that minimally contains an access token and refresh token.
   */
  setSession(e) {
    return E(this, void 0, void 0, function* () {
      try {
        if (!e.access_token || !e.refresh_token)
          throw new me();
        const t = Date.now() / 1e3;
        let n = t, s = !0, i = null;
        const o = Rt(e.access_token);
        if (o.exp && (n = o.exp, s = n <= t), s) {
          const { session: c, error: l } = yield this._callRefreshToken(e.refresh_token);
          if (l)
            return { data: { user: null, session: null }, error: l };
          if (!c)
            return { data: { user: null, session: null }, error: null };
          i = c;
        } else {
          const { data: c, error: l } = yield this.getUser(e.access_token);
          if (l)
            throw l;
          i = {
            access_token: e.access_token,
            refresh_token: e.refresh_token,
            user: c.user,
            token_type: "bearer",
            expires_in: n - t,
            expires_at: n
          }, yield this._saveSession(i), this._notifyAllSubscribers("SIGNED_IN", i);
        }
        return { data: { user: i.user, session: i }, error: null };
      } catch (t) {
        if (A(t))
          return { data: { session: null, user: null }, error: t };
        throw t;
      }
    });
  }
  /**
   * Returns a new session, regardless of expiry status.
   * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
   * If the current session's refresh token is invalid, an error will be thrown.
   * @param currentSession The current session. If passed in, it must contain a refresh token.
   */
  refreshSession(e) {
    var t;
    return E(this, void 0, void 0, function* () {
      try {
        if (!e) {
          const { data: i, error: o } = yield this.getSession();
          if (o)
            throw o;
          e = (t = i.session) !== null && t !== void 0 ? t : void 0;
        }
        if (!(e != null && e.refresh_token))
          throw new me();
        const { session: n, error: s } = yield this._callRefreshToken(e.refresh_token);
        return s ? { data: { user: null, session: null }, error: s } : n ? { data: { user: n.user, session: n }, error: null } : { data: { user: null, session: null }, error: null };
      } catch (n) {
        if (A(n))
          return { data: { user: null, session: null }, error: n };
        throw n;
      }
    });
  }
  /**
   * Gets the session data from a URL string
   */
  _getSessionFromUrl(e) {
    return E(this, void 0, void 0, function* () {
      try {
        if (!te())
          throw new V("No browser detected.");
        if (this.flowType === "implicit" && !this._isImplicitGrantFlow())
          throw new V("Not a valid implicit grant flow url.");
        if (this.flowType == "pkce" && !e)
          throw new Ge("Not a valid PKCE flow url.");
        if (e) {
          const v = B("code");
          if (!v)
            throw new Ge("No code detected.");
          const { data: C, error: k } = yield this.exchangeCodeForSession(v);
          if (k)
            throw k;
          if (!C.session)
            throw new Ge("No session detected.");
          let H = new URL(window.location.href);
          return H.searchParams.delete("code"), window.history.replaceState(window.history.state, "", H.toString()), { data: { session: C.session, redirectType: null }, error: null };
        }
        const t = B("error_description");
        if (t) {
          const v = B("error_code");
          if (!v)
            throw new V("No error_code detected.");
          const C = B("error");
          throw C ? new V(t, { error: C, code: v }) : new V("No error detected.");
        }
        const n = B("provider_token"), s = B("provider_refresh_token"), i = B("access_token");
        if (!i)
          throw new V("No access_token detected.");
        const o = B("expires_in");
        if (!o)
          throw new V("No expires_in detected.");
        const c = B("refresh_token");
        if (!c)
          throw new V("No refresh_token detected.");
        const l = B("token_type");
        if (!l)
          throw new V("No token_type detected.");
        const h = Math.round(Date.now() / 1e3) + parseInt(o), { data: f, error: p } = yield this.getUser(i);
        if (p)
          throw p;
        const g = f.user, m = {
          provider_token: n,
          provider_refresh_token: s,
          access_token: i,
          expires_in: parseInt(o),
          expires_at: h,
          refresh_token: c,
          token_type: l,
          user: g
        }, b = B("type");
        return window.location.hash = "", { data: { session: m, redirectType: b }, error: null };
      } catch (t) {
        if (A(t))
          return { data: { session: null, redirectType: null }, error: t };
        throw t;
      }
    });
  }
  /**
   * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
   */
  _isImplicitGrantFlow() {
    return te() && (!!B("access_token") || !!B("error_description"));
  }
  /**
   * Checks if the current URL and backing storage contain parameters given by a PKCE flow
   */
  _isPKCEFlow() {
    return E(this, void 0, void 0, function* () {
      const e = yield Se(this.storage, `${this.storageKey}-code-verifier`);
      return te() && !!B("code") && !!e;
    });
  }
  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session
   * and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
   *
   * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
   * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
   */
  signOut() {
    var e;
    return E(this, void 0, void 0, function* () {
      const { data: t, error: n } = yield this.getSession();
      if (n)
        return { error: n };
      const s = (e = t.session) === null || e === void 0 ? void 0 : e.access_token;
      if (s) {
        const { error: i } = yield this.admin.signOut(s);
        if (i && !(_i(i) && (i.status === 404 || i.status === 401)))
          return { error: i };
      }
      return yield this._removeSession(), yield Fe(this.storage, `${this.storageKey}-code-verifier`), this._notifyAllSubscribers("SIGNED_OUT", null), { error: null };
    });
  }
  /**
   * Receive a notification every time an auth event happens.
   * @param callback A callback function to be invoked when an auth event happens.
   */
  onAuthStateChange(e) {
    const t = oi(), n = {
      id: t,
      callback: e,
      unsubscribe: () => {
        this.stateChangeEmitters.delete(t);
      }
    };
    return this.stateChangeEmitters.set(t, n), this.emitInitialSession(t), { data: { subscription: n } };
  }
  emitInitialSession(e) {
    var t, n;
    return E(this, void 0, void 0, function* () {
      try {
        const { data: { session: s }, error: i } = yield this.getSession();
        if (i)
          throw i;
        (t = this.stateChangeEmitters.get(e)) === null || t === void 0 || t.callback("INITIAL_SESSION", s);
      } catch (s) {
        (n = this.stateChangeEmitters.get(e)) === null || n === void 0 || n.callback("INITIAL_SESSION", null), console.error(s);
      }
    });
  }
  /**
   * Sends a password reset request to an email address.
   * @param email The email address of the user.
   * @param options.redirectTo The URL to send the user to after they click the password reset link.
   * @param options.captchaToken Verification token received when the user completes the captcha on the site.
   */
  resetPasswordForEmail(e, t = {}) {
    return E(this, void 0, void 0, function* () {
      let n = null, s = null;
      if (this.flowType === "pkce") {
        const i = Oe();
        yield _e(this.storage, `${this.storageKey}-code-verifier`, i), n = yield Ae(i), s = i === n ? "plain" : "s256";
      }
      try {
        return yield R(this.fetch, "POST", `${this.url}/recover`, {
          body: {
            email: e,
            code_challenge: n,
            code_challenge_method: s,
            gotrue_meta_security: { captcha_token: t.captchaToken }
          },
          headers: this.headers,
          redirectTo: t.redirectTo
        });
      } catch (i) {
        if (A(i))
          return { data: null, error: i };
        throw i;
      }
    });
  }
  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  _refreshAccessToken(e) {
    return E(this, void 0, void 0, function* () {
      try {
        const t = Date.now();
        return yield hi((n) => E(this, void 0, void 0, function* () {
          return yield li(n * 200), yield R(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
            body: { refresh_token: e },
            headers: this.headers,
            xform: ee
          });
        }), (n, s, i) => i && i.error && i.error instanceof rt && // retryable only if the request can be sent before the backoff overflows the tick duration
        Date.now() + (n + 1) * 200 - t < Ke);
      } catch (t) {
        if (A(t))
          return { data: { session: null, user: null }, error: t };
        throw t;
      }
    });
  }
  _isValidSession(e) {
    return typeof e == "object" && e !== null && "access_token" in e && "refresh_token" in e && "expires_at" in e;
  }
  _handleProviderSignIn(e, t) {
    return E(this, void 0, void 0, function* () {
      const n = yield this._getUrlForProvider(e, {
        redirectTo: t.redirectTo,
        scopes: t.scopes,
        queryParams: t.queryParams
      });
      return te() && !t.skipBrowserRedirect && window.location.assign(n), { data: { provider: e, url: n }, error: null };
    });
  }
  /**
   * Recovers the session from LocalStorage and refreshes
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  _recoverAndRefresh() {
    var e;
    return E(this, void 0, void 0, function* () {
      try {
        const t = yield Se(this.storage, this.storageKey);
        if (!this._isValidSession(t)) {
          t !== null && (yield this._removeSession());
          return;
        }
        const n = Math.round(Date.now() / 1e3);
        if (((e = t.expires_at) !== null && e !== void 0 ? e : 1 / 0) < n + Ii) {
          if (this.autoRefreshToken && t.refresh_token) {
            const { error: s } = yield this._callRefreshToken(t.refresh_token);
            s && (console.log(s.message), yield this._removeSession());
          }
        } else
          this.persistSession && (yield this._saveSession(t)), this._notifyAllSubscribers("SIGNED_IN", t);
      } catch (t) {
        console.error(t);
        return;
      }
    });
  }
  _callRefreshToken(e) {
    var t, n;
    return E(this, void 0, void 0, function* () {
      if (this.refreshingDeferred)
        return this.refreshingDeferred.promise;
      try {
        if (this.refreshingDeferred = new je(), !e)
          throw new me();
        const { data: s, error: i } = yield this._refreshAccessToken(e);
        if (i)
          throw i;
        if (!s.session)
          throw new me();
        yield this._saveSession(s.session), this._notifyAllSubscribers("TOKEN_REFRESHED", s.session);
        const o = { session: s.session, error: null };
        return this.refreshingDeferred.resolve(o), o;
      } catch (s) {
        if (A(s)) {
          const i = { session: null, error: s };
          return (t = this.refreshingDeferred) === null || t === void 0 || t.resolve(i), i;
        }
        throw (n = this.refreshingDeferred) === null || n === void 0 || n.reject(s), s;
      } finally {
        this.refreshingDeferred = null;
      }
    });
  }
  _notifyAllSubscribers(e, t, n = !0) {
    this.broadcastChannel && n && this.broadcastChannel.postMessage({ event: e, session: t }), this.stateChangeEmitters.forEach((s) => s.callback(e, t));
  }
  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  _saveSession(e) {
    return E(this, void 0, void 0, function* () {
      this.persistSession || (this.inMemorySession = e), this.persistSession && e.expires_at && (yield this._persistSession(e));
    });
  }
  _persistSession(e) {
    return _e(this.storage, this.storageKey, e);
  }
  _removeSession() {
    return E(this, void 0, void 0, function* () {
      this.persistSession ? yield Fe(this.storage, this.storageKey) : this.inMemorySession = null;
    });
  }
  /**
   * Removes any registered visibilitychange callback.
   *
   * {@see #startAutoRefresh}
   * {@see #stopAutoRefresh}
   */
  _removeVisibilityChangedCallback() {
    const e = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      e && te() && (window != null && window.removeEventListener) && window.removeEventListener("visibilitychange", e);
    } catch (t) {
      console.error("removing visibilitychange callback failed", t);
    }
  }
  /**
   * This is the private implementation of {@link #startAutoRefresh}. Use this
   * within the library.
   */
  _startAutoRefresh() {
    return E(this, void 0, void 0, function* () {
      yield this._stopAutoRefresh();
      const e = setInterval(() => this._autoRefreshTokenTick(), Ke);
      this.autoRefreshTicker = e, e && typeof e == "object" && typeof e.unref == "function" ? e.unref() : typeof Deno < "u" && typeof Deno.unrefTimer == "function" && Deno.unrefTimer(e), yield this._autoRefreshTokenTick();
    });
  }
  /**
   * This is the private implementation of {@link #stopAutoRefresh}. Use this
   * within the library.
   */
  _stopAutoRefresh() {
    return E(this, void 0, void 0, function* () {
      const e = this.autoRefreshTicker;
      this.autoRefreshTicker = null, e && clearInterval(e);
    });
  }
  /**
   * Starts an auto-refresh process in the background. The session is checked
   * every few seconds. Close to the time of expiration a process is started to
   * refresh the session. If refreshing fails it will be retried for as long as
   * necessary.
   *
   * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
   * to call this function, it will be called for you.
   *
   * On browsers the refresh process works only when the tab/window is in the
   * foreground to conserve resources as well as prevent race conditions and
   * flooding auth with requests. If you call this method any managed
   * visibility change callback will be removed and you must manage visibility
   * changes on your own.
   *
   * On non-browser platforms the refresh process works *continuously* in the
   * background, which may not be desireable. You should hook into your
   * platform's foreground indication mechanism and call these methods
   * appropriately to conserve resources.
   *
   * {@see #stopAutoRefresh}
   */
  startAutoRefresh() {
    return E(this, void 0, void 0, function* () {
      this._removeVisibilityChangedCallback(), yield this._startAutoRefresh();
    });
  }
  /**
   * Stops an active auto refresh process running in the background (if any).
   *
   * If you call this method any managed visibility change callback will be
   * removed and you must manage visibility changes on your own.
   *
   * See {@link #startAutoRefresh} for more details.
   */
  stopAutoRefresh() {
    return E(this, void 0, void 0, function* () {
      this._removeVisibilityChangedCallback(), yield this._stopAutoRefresh();
    });
  }
  /**
   * Runs the auto refresh token tick.
   */
  _autoRefreshTokenTick() {
    return E(this, void 0, void 0, function* () {
      const e = Date.now();
      try {
        const { data: { session: t } } = yield this.getSession();
        if (!t || !t.refresh_token || !t.expires_at)
          return;
        Math.floor((t.expires_at * 1e3 - e) / Ke) < ji && (yield this._callRefreshToken(t.refresh_token));
      } catch (t) {
        console.error("Auto refresh tick failed with error. This is likely a transient error.", t);
      }
    });
  }
  /**
   * Registers callbacks on the browser / platform, which in-turn run
   * algorithms when the browser window/tab are in foreground. On non-browser
   * platforms it assumes always foreground.
   */
  _handleVisibilityChange() {
    return E(this, void 0, void 0, function* () {
      if (!te() || !(window != null && window.addEventListener))
        return this.autoRefreshToken && this.startAutoRefresh(), !1;
      try {
        this.visibilityChangedCallback = () => E(this, void 0, void 0, function* () {
          return yield this._onVisibilityChanged(!1);
        }), window == null || window.addEventListener("visibilitychange", this.visibilityChangedCallback), yield this._onVisibilityChanged(!0);
      } catch (e) {
        console.error("_handleVisibilityChange", e);
      }
    });
  }
  /**
   * Callback registered with `window.addEventListener('visibilitychange')`.
   */
  _onVisibilityChanged(e) {
    return E(this, void 0, void 0, function* () {
      document.visibilityState === "visible" ? (e || (yield this.initializePromise, yield this._recoverAndRefresh()), this.autoRefreshToken && this._startAutoRefresh()) : document.visibilityState === "hidden" && this.autoRefreshToken && this._stopAutoRefresh();
    });
  }
  /**
   * Generates the relevant login URL for a third-party provider.
   * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param options.scopes A space-separated list of scopes granted to the OAuth application.
   * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
   */
  _getUrlForProvider(e, t) {
    return E(this, void 0, void 0, function* () {
      const n = [`provider=${encodeURIComponent(e)}`];
      if (t != null && t.redirectTo && n.push(`redirect_to=${encodeURIComponent(t.redirectTo)}`), t != null && t.scopes && n.push(`scopes=${encodeURIComponent(t.scopes)}`), this.flowType === "pkce") {
        const s = Oe();
        yield _e(this.storage, `${this.storageKey}-code-verifier`, s);
        const i = yield Ae(s), o = s === i ? "plain" : "s256", c = new URLSearchParams({
          code_challenge: `${encodeURIComponent(i)}`,
          code_challenge_method: `${encodeURIComponent(o)}`
        });
        n.push(c.toString());
      }
      if (t != null && t.queryParams) {
        const s = new URLSearchParams(t.queryParams);
        n.push(s.toString());
      }
      return `${this.url}/authorize?${n.join("&")}`;
    });
  }
  _unenroll(e) {
    var t;
    return E(this, void 0, void 0, function* () {
      try {
        const { data: n, error: s } = yield this.getSession();
        return s ? { data: null, error: s } : yield R(this.fetch, "DELETE", `${this.url}/factors/${e.factorId}`, {
          headers: this.headers,
          jwt: (t = n == null ? void 0 : n.session) === null || t === void 0 ? void 0 : t.access_token
        });
      } catch (n) {
        if (A(n))
          return { data: null, error: n };
        throw n;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#enroll}
   */
  _enroll(e) {
    var t, n;
    return E(this, void 0, void 0, function* () {
      try {
        const { data: s, error: i } = yield this.getSession();
        if (i)
          return { data: null, error: i };
        const { data: o, error: c } = yield R(this.fetch, "POST", `${this.url}/factors`, {
          body: {
            friendly_name: e.friendlyName,
            factor_type: e.factorType,
            issuer: e.issuer
          },
          headers: this.headers,
          jwt: (t = s == null ? void 0 : s.session) === null || t === void 0 ? void 0 : t.access_token
        });
        return c ? { data: null, error: c } : (!((n = o == null ? void 0 : o.totp) === null || n === void 0) && n.qr_code && (o.totp.qr_code = `data:image/svg+xml;utf-8,${o.totp.qr_code}`), { data: o, error: null });
      } catch (s) {
        if (A(s))
          return { data: null, error: s };
        throw s;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#verify}
   */
  _verify(e) {
    var t;
    return E(this, void 0, void 0, function* () {
      try {
        const { data: n, error: s } = yield this.getSession();
        if (s)
          return { data: null, error: s };
        const { data: i, error: o } = yield R(this.fetch, "POST", `${this.url}/factors/${e.factorId}/verify`, {
          body: { code: e.code, challenge_id: e.challengeId },
          headers: this.headers,
          jwt: (t = n == null ? void 0 : n.session) === null || t === void 0 ? void 0 : t.access_token
        });
        return o ? { data: null, error: o } : (yield this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + i.expires_in }, i)), this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", i), { data: i, error: o });
      } catch (n) {
        if (A(n))
          return { data: null, error: n };
        throw n;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challenge}
   */
  _challenge(e) {
    var t;
    return E(this, void 0, void 0, function* () {
      try {
        const { data: n, error: s } = yield this.getSession();
        return s ? { data: null, error: s } : yield R(this.fetch, "POST", `${this.url}/factors/${e.factorId}/challenge`, {
          headers: this.headers,
          jwt: (t = n == null ? void 0 : n.session) === null || t === void 0 ? void 0 : t.access_token
        });
      } catch (n) {
        if (A(n))
          return { data: null, error: n };
        throw n;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challengeAndVerify}
   */
  _challengeAndVerify(e) {
    return E(this, void 0, void 0, function* () {
      const { data: t, error: n } = yield this._challenge({
        factorId: e.factorId
      });
      return n ? { data: null, error: n } : yield this._verify({
        factorId: e.factorId,
        challengeId: t.id,
        code: e.code
      });
    });
  }
  /**
   * {@see GoTrueMFAApi#listFactors}
   */
  _listFactors() {
    return E(this, void 0, void 0, function* () {
      const { data: { user: e }, error: t } = yield this.getUser();
      if (t)
        return { data: null, error: t };
      const n = (e == null ? void 0 : e.factors) || [], s = n.filter((i) => i.factor_type === "totp" && i.status === "verified");
      return {
        data: {
          all: n,
          totp: s
        },
        error: null
      };
    });
  }
  /**
   * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
   */
  _getAuthenticatorAssuranceLevel() {
    var e, t;
    return E(this, void 0, void 0, function* () {
      const { data: { session: n }, error: s } = yield this.getSession();
      if (s)
        return { data: null, error: s };
      if (!n)
        return {
          data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
          error: null
        };
      const i = this._decodeJWT(n.access_token);
      let o = null;
      i.aal && (o = i.aal);
      let c = o;
      ((t = (e = n.user.factors) === null || e === void 0 ? void 0 : e.filter((h) => h.status === "verified")) !== null && t !== void 0 ? t : []).length > 0 && (c = "aal2");
      const a = i.amr || [];
      return { data: { currentLevel: o, nextLevel: c, currentAuthenticationMethods: a }, error: null };
    });
  }
}
class Di extends Ui {
  constructor(e) {
    super(e);
  }
}
var Li = globalThis && globalThis.__awaiter || function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function c(h) {
      try {
        a(n.next(h));
      } catch (f) {
        o(f);
      }
    }
    function l(h) {
      try {
        a(n.throw(h));
      } catch (f) {
        o(f);
      }
    }
    function a(h) {
      h.done ? i(h.value) : s(h.value).then(c, l);
    }
    a((n = n.apply(r, e || [])).next());
  });
};
const Mi = {
  headers: Qs
}, xi = {
  schema: "public"
}, Hi = {
  autoRefreshToken: !0,
  persistSession: !0,
  detectSessionInUrl: !0,
  flowType: "implicit"
}, Bi = {};
class Fi {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor(e, t, n) {
    var s, i, o, c, l, a, h, f;
    if (this.supabaseUrl = e, this.supabaseKey = t, !e)
      throw new Error("supabaseUrl is required.");
    if (!t)
      throw new Error("supabaseKey is required.");
    const p = ni(e);
    if (this.realtimeUrl = `${p}/realtime/v1`.replace(/^http/i, "ws"), this.authUrl = `${p}/auth/v1`, this.storageUrl = `${p}/storage/v1`, p.match(/(supabase\.co)|(supabase\.in)/)) {
      const C = p.split(".");
      this.functionsUrl = `${C[0]}.functions.${C[1]}.${C[2]}`;
    } else
      this.functionsUrl = `${p}/functions/v1`;
    const m = `sb-${new URL(this.authUrl).hostname.split(".")[0]}-auth-token`, b = {
      db: xi,
      realtime: Bi,
      auth: Object.assign(Object.assign({}, Hi), { storageKey: m }),
      global: Mi
    }, v = si(n ?? {}, b);
    this.storageKey = (i = (s = v.auth) === null || s === void 0 ? void 0 : s.storageKey) !== null && i !== void 0 ? i : "", this.headers = (c = (o = v.global) === null || o === void 0 ? void 0 : o.headers) !== null && c !== void 0 ? c : {}, this.auth = this._initSupabaseAuthClient((l = v.auth) !== null && l !== void 0 ? l : {}, this.headers, (a = v.global) === null || a === void 0 ? void 0 : a.fetch), this.fetch = ri(t, this._getAccessToken.bind(this), (h = v.global) === null || h === void 0 ? void 0 : h.fetch), this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers }, v.realtime)), this.rest = new ss(`${p}/rest/v1`, {
      headers: this.headers,
      schema: (f = v.db) === null || f === void 0 ? void 0 : f.schema,
      fetch: this.fetch
    }), this._listenForAuthEvents();
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new Vn(this.functionsUrl, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage() {
    return new Vs(this.storageUrl, this.headers, this.fetch);
  }
  from(e) {
    return this.rest.from(e);
  }
  /**
   * Perform a function call.
   *
   * @param fn  The function name to call.
   * @param args  The parameters to pass to the function call.
   * @param options.head   When set to true, no data will be returned.
   * @param options.count  Count algorithm to use to count rows in a table.
   *
   */
  rpc(e, t = {}, n) {
    return this.rest.rpc(e, t, n);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(e, t = { config: {} }) {
    return this.realtime.channel(e, t);
  }
  /**
   * Returns all Realtime channels.
   */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel(e) {
    return this.realtime.removeChannel(e);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var e, t;
    return Li(this, void 0, void 0, function* () {
      const { data: n } = yield this.auth.getSession();
      return (t = (e = n.session) === null || e === void 0 ? void 0 : e.access_token) !== null && t !== void 0 ? t : null;
    });
  }
  _initSupabaseAuthClient({ autoRefreshToken: e, persistSession: t, detectSessionInUrl: n, storage: s, storageKey: i, flowType: o }, c, l) {
    const a = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new Di({
      url: this.authUrl,
      headers: Object.assign(Object.assign({}, a), c),
      storageKey: i,
      autoRefreshToken: e,
      persistSession: t,
      detectSessionInUrl: n,
      storage: s,
      flowType: o,
      fetch: l
    });
  }
  _initRealtimeClient(e) {
    return new xs(this.realtimeUrl, Object.assign(Object.assign({}, e), { params: Object.assign({ apikey: this.supabaseKey }, e == null ? void 0 : e.params) }));
  }
  _listenForAuthEvents() {
    return this.auth.onAuthStateChange((t, n) => {
      this._handleTokenChanged(t, n == null ? void 0 : n.access_token, "CLIENT");
    });
  }
  _handleTokenChanged(e, t, n) {
    (e === "TOKEN_REFRESHED" || e === "SIGNED_IN") && this.changedAccessToken !== t ? (this.realtime.setAuth(t ?? null), this.changedAccessToken = t) : e === "SIGNED_OUT" && (this.realtime.setAuth(this.supabaseKey), n == "STORAGE" && this.auth.signOut(), this.changedAccessToken = void 0);
  }
}
const Gi = (r, e, t) => new Fi(r, e, t);
var Ki = Object.defineProperty, Ji = (r, e, t) => e in r ? Ki(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, Ct = (r, e, t) => (Ji(r, typeof e != "symbol" ? e + "" : e, t), t);
let Xi = class extends Hn {
  constructor(e, t) {
    super(e, t), Ct(this, "client"), Ct(this, "storageUrl"), this.client = Gi(this.config.url, this.config.anonKey), this.storageUrl = `${this.config.url}/storage/v1/object/public/${this.config.bucket}`;
  }
  async create(e) {
    if (!e && !this.data)
      throw new Error("ImageStorage error: No Storage Data");
    const t = e || this.data, { error: n } = await this.client.storage.from(this.config.bucket).upload(t.imgPath, t.imgData, {
      contentType: "image/svg+xml",
      cacheControl: "31536000",
      upsert: this.config.upsert || !0
    });
    if (n)
      throw n;
    return {
      url: `${this.storageUrl}/${t.imgPath}?v=starnexusogimage&t=${Date.now()}`
    };
  }
  async update(e) {
    if (!e && !this.data)
      throw new Error("ImageStorage error: No Storage Data");
    const t = e || this.data, { error: n } = await this.client.storage.from(this.config.bucket).update(t.imgPath, t.imgData, {
      contentType: "image/svg+xml",
      cacheControl: "31536000"
    });
    if (n)
      throw n;
    return {
      url: `${this.storageUrl}/${t.imgPath}?v=starnexusogimage&t=${Date.now()}`
    };
  }
  async query(e) {
    const t = `${this.storageUrl}/${e}`;
    return {
      url: await W(t).then((n) => t).catch((n) => "")
    };
  }
  getConfig() {
    return this.config;
  }
  getType() {
    return {
      type: "ImageStorage",
      name: "SupabaseImageStorage"
    };
  }
};
var zi = Object.defineProperty, Yi = (r, e, t) => e in r ? zi(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, ge = (r, e, t) => (Yi(r, typeof e != "symbol" ? e + "" : e, t), t);
let Wi = class {
  constructor(e) {
    ge(this, "apiUrl", "/api/webcard"), ge(this, "headers"), ge(this, "webData"), ge(this, "imgStorage"), ge(this, "localFn"), this.apiUrl = (e.starNexusHub || "") + this.apiUrl, this.webData = e.webData, this.headers = e.headers, this.localFn = e.localFn, this.imgStorage = e.imgStorage;
  }
  async call(e) {
    if (!e.webData && !this.webData)
      throw new Error("WebCard error: No WebInfo Data");
    const t = e.webData || this.webData;
    let n, s;
    if (this.localFn)
      n = await this.localFn(t), (await this.imgStorage.query(n.imgPath)).url ? s = await this.imgStorage.update(n) : s = await this.imgStorage.create(n), await e.dataStorage.updateOgImage(e.savedData, s.url);
    else {
      const i = this.imgStorage.getType(), o = this.imgStorage.getConfig(), c = e.dataStorage.getType(), l = e.dataStorage.getConfig();
      s = await W(this.apiUrl, {
        method: "POST",
        headers: this.headers,
        body: {
          webData: t,
          imgType: i,
          imgCfg: o,
          dataType: c,
          dataCfg: l,
          savedData: e.savedData
        }
      });
    }
    return s;
  }
};
var Vi = Object.defineProperty, qi = (r, e, t) => e in r ? Vi(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, Ne = (r, e, t) => (qi(r, typeof e != "symbol" ? e + "" : e, t), t);
let Qi = class {
  constructor(e) {
    Ne(this, "webUrl", ""), Ne(this, "apiUrl", "/api/webinfo"), Ne(this, "starNexusHub", ""), Ne(this, "headers"), this.webUrl = e.urls.webUrl, this.headers = e.headers, this.starNexusHub = e.starNexusHub || "";
  }
  async call() {
    if (!this.starNexusHub)
      throw new Error("StarNexus error: No StarNexusHub API.");
    return await W(
      this.starNexusHub + this.apiUrl,
      {
        method: "POST",
        headers: this.headers,
        body: {
          webUrl: this.webUrl
        }
      }
    );
  }
  getStarNuxesApi() {
    return this.starNexusHub;
  }
};
var Zi = Object.defineProperty, eo = (r, e, t) => e in r ? Zi(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, Je = (r, e, t) => (eo(r, typeof e != "symbol" ? e + "" : e, t), t), Qt = /* @__PURE__ */ ((r) => (r.ChatGPT = "chatgpt", r.GPT3 = "gpt3", r))(Qt || {});
function to(r = "", e) {
  const t = r ? r.replace(/&#39;/g, "'").replace(/(\r\n)+/g, `\r
`).replace(/(\s{2,})/g, " ").replace(/^(\s)+|(\s)$/g, "") : "";
  return so(t, e);
}
const Nt = 14e3, ro = 800, no = 1300;
function so(r, e) {
  let t = r;
  const n = oo(r).length;
  if (n > Nt) {
    const s = Nt / n;
    t = r.substring(0, Math.floor(r.length * s));
  }
  return io(t, e);
}
function io(r, e) {
  const t = e === "gpt3" ? no : ro;
  let n = We(r);
  if (n > t) {
    let s = r;
    for (; n > t; ) {
      const i = n - t;
      s = s.substring(0, s.length - (i / 2 < 10 ? 10 : i / 2)), n = We(s);
    }
    return s;
  }
  return r;
}
function oo(r) {
  return decodeURIComponent(encodeURIComponent(escape(r))).replace(/%([0-9A-F]{2})/gi, (e, t) => {
    const n = parseInt(t, 16);
    return String.fromCharCode(n);
  });
}
class ao {
  constructor(e) {
    Je(this, "apiKey"), Je(this, "webData"), Je(this, "lang"), this.apiKey = e.apiKey, this.webData = e.webData, this.lang = e.lang;
  }
  async call(e) {
    if (!e && !this.webData)
      throw new Error("SummarizeContent error: No WebInfo Data");
    const t = e || this.webData;
    return await co(this.apiKey, t, this.lang);
  }
}
async function co(r, e, t = "zh-CN") {
  let n = "", s = [], i = e.content;
  if (i = or(i), We(i) > 40) {
    i = to(i, Qt.GPT3);
    const c = {
      content: i,
      language: Dn[t],
      webprompts: e.meta.prompts || ""
    }, l = ar(Un, c), a = (await W(`${kn}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${r}`,
        "Content-Type": "application/json"
      },
      body: {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: jn
          },
          {
            role: "user",
            content: l
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      }
    })).choices[0].message.content, h = JSON.parse(a);
    n = h.summary, s = h.categories;
  } else
    n = i;
  const o = s && s.length ? s : ["Others"];
  return { summary: n, categories: o };
}
var lo = Object.defineProperty, ho = (r, e, t) => e in r ? lo(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, Ie = (r, e, t) => (ho(r, typeof e != "symbol" ? e + "" : e, t), t);
class uo {
  constructor(e) {
    Ie(this, "webInfo"), Ie(this, "webCard"), Ie(this, "summarizeContent"), Ie(this, "dataStorage"), this.webInfo = e.webInfo, this.webCard = e.webCard, this.summarizeContent = e.summarizeContent, this.dataStorage = e.dataStorage;
  }
  async call() {
    const e = await this.webInfo.call();
    let t = {
      summary: e.content,
      categories: ["Others"]
    };
    this.summarizeContent && (t = await this.summarizeContent.call(e));
    const n = await this.dataStorage.create({ ...e, ...t });
    return this.webCard && (this.webCard.localFn ? await this.webCard.call({ dataStorage: this.dataStorage, webData: e, savedData: n }) : this.webCard.call({ dataStorage: this.dataStorage, webData: e, savedData: n }).then((s) => console.log(s)).catch((s) => console.error(kt(s)))), n;
  }
}
async function fo(r) {
  const e = /(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*/g, t = r.match(e);
  if (t) {
    let n = 0, s = 0, i = 0;
    for (; n < t.length; ) {
      const o = d.NOTION_API_KEY, c = d.NOTION_DATABASE_ID, l = d.API_KEY, a = d.STAR_NEXUS_HUB_API, h = t[n], f = new Qi({
        urls: {
          webUrl: h
        },
        starNexusHub: a
      }), p = new Xi({
        url: d.SUPABASE_URL || "",
        anonKey: d.SUPABASE_ANON_KEY || "",
        bucket: d.SUPABASE_STORAGE_BUCKET || "",
        upsert: !0
      }), g = new Wi({ starNexusHub: a, imgStorage: p }), m = new ao({ apiKey: l }), b = new Bn(
        {
          apiKey: o,
          databaseId: c,
          defaultOgImage: "https://kiafhufrshqyrvlpsdqg.supabase.co/storage/v1/object/public/pics-bed/star-nexus.png?v=starnexusogimage"
        }
      ), C = await new uo({
        webInfo: f,
        webCard: g,
        summarizeContent: m,
        dataStorage: b
      }).call().then((k) => !0).catch((k) => !1);
      n++, C ? s++ : i++;
    }
    return `Success: ${s}${i ? ` Fail: ${i}` : ""}`;
  } else
    throw new Error("No Website Matched");
}
async function po(r, e) {
  try {
    await e.initContext(r);
  } catch (t) {
    return new Response(ae(t), { status: 200 });
  }
  return null;
}
async function _o(r, e) {
  if (d.DEBUG_MODE) {
    const t = `last_message:${e.SHARE_CONTEXT.chatHistoryKey}`;
    await $.put(t, JSON.stringify(r), { expirationTtl: 3600 });
  }
  return null;
}
async function mo(r, e) {
  return d.API_KEY ? $ ? null : w(e)("DATABASE Not Set") : w(e)("OpenAI API Key Not Set");
}
async function Xe(r, e) {
  return d.I_AM_A_GENEROUS_PERSON ? null : e.SHARE_CONTEXT.chatType === "private" ? d.CHAT_WHITE_LIST.includes(`${e.CURRENT_CHAT_CONTEXT.chat_id}`) ? null : w(e)(
    d.I18N.message.user_has_no_permission_to_use_the_bot(e.CURRENT_CHAT_CONTEXT.chat_id)
  ) : Q.GROUP_TYPES.includes(e.SHARE_CONTEXT.chatType) ? d.GROUP_CHAT_BOT_ENABLE ? d.CHAT_GROUP_WHITE_LIST.includes(`${e.CURRENT_CHAT_CONTEXT.chat_id}`) ? null : w(e)(
    d.I18N.message.group_has_no_permission_to_use_the_bot(e.CURRENT_CHAT_CONTEXT.chat_id)
  ) : new Response("Not support", { status: 401 }) : w(e)(
    d.I18N.message.not_supported_chat_type(e.SHARE_CONTEXT.chatType)
  );
}
async function go(r, e) {
  return r.text ? null : w(e)(d.I18N.message.not_supported_chat_type_message);
}
async function It(r, e) {
  if (!r.text)
    return new Response("Non text message", { status: 200 });
  const t = e.SHARE_CONTEXT.currentBotName;
  if (t) {
    let n = !1;
    if (r.reply_to_message && r.reply_to_message.from.username === t && (n = !0), r.entities) {
      let s = "", i = 0;
      r.entities.forEach((o) => {
        switch (o.type) {
          case "bot_command":
            if (!n) {
              const c = r.text.substring(
                o.offset,
                o.offset + o.length
              );
              c.endsWith(t) && (n = !0);
              const l = c.replaceAll(`@${t}`, "").replaceAll(t, "").trim();
              s += l, i = o.offset + o.length;
            }
            break;
          case "mention":
          case "text_mention":
            if (!n) {
              const c = r.text.substring(
                o.offset,
                o.offset + o.length
              );
              (c === t || c === `@${t}`) && (n = !0);
            }
            s += r.text.substring(i, o.offset), i = o.offset + o.length;
            break;
        }
      }), s += r.text.substring(i, r.text.length), r.text = s.trim();
    }
    return n ? null : new Response("No mentioned", { status: 200 });
  }
  return new Response("Not set bot name", { status: 200 });
}
async function ze(r, e) {
  return await xr(r, e);
}
async function Ye(r, e) {
  if (!r.text.startsWith("~"))
    return null;
  r.text = r.text.slice(1);
  const t = r.text.indexOf(" ");
  if (t === -1)
    return null;
  const n = r.text.slice(0, t), s = r.text.slice(t + 1).trim();
  if (e.USER_DEFINE.ROLE.hasOwnProperty(n)) {
    e.SHARE_CONTEXT.role = n, r.text = s;
    const i = e.USER_DEFINE.ROLE[n];
    for (const o in i)
      e.USER_CONFIG.hasOwnProperty(o) && typeof e.USER_CONFIG[o] == typeof i[o] && (e.USER_CONFIG[o] = i[o]);
  }
}
async function yo(r, e) {
  try {
    setTimeout(() => st(e)("typing").catch(console.error), 0);
    const t = await fo(r.text);
    return w(e)(`Saved to StarNexus 🎉.
${t}`);
  } catch (t) {
    const n = kt(t);
    return w(e)(`Error: ${n}`);
  }
}
async function vo(r, e) {
  const t = {
    private: [
      Xe,
      go,
      ze,
      Ye
    ],
    group: [
      It,
      Xe,
      ze,
      Ye
    ],
    supergroup: [
      It,
      Xe,
      ze,
      Ye
    ]
  };
  if (!t.hasOwnProperty(e.SHARE_CONTEXT.chatType))
    return w(e)(
      d.I18N.message.not_supported_chat_type(e.SHARE_CONTEXT.chatType)
    );
  const n = t[e.SHARE_CONTEXT.chatType];
  for (const s of n)
    try {
      const i = await s(r, e);
      if (i && i instanceof Response)
        return i;
    } catch (i) {
      return console.error(i), w(e)(
        d.I18N.message.handle_chat_type_message_error(e.SHARE_CONTEXT.chatType)
      );
    }
  return null;
}
async function bo(r, e) {
  const t = await r.json();
  if (d.DEV_MODE && setTimeout(() => {
    $.put(`log:${(/* @__PURE__ */ new Date()).toISOString()}`, JSON.stringify(t), { expirationTtl: 600 }).catch(console.error);
  }), t.edited_message)
    throw new Error("Ignore edited message");
  if (t.message)
    return t.message;
  throw new Error("Invalid message");
}
async function Eo(r) {
  const e = new ur();
  e.initTelegramContext(r);
  const t = await bo(r), n = [
    po,
    // 初始化聊天上下文: 生成chat_id, reply_to_message_id(群组消息), SHARE_CONTEXT
    _o,
    // 保存最后一条消息
    mo,
    // 检查环境是否准备好: API_KEY, DATABASE
    vo,
    // 根据类型对消息进一步处理
    yo
    // 与OpenAI聊天
  ];
  for (const s of n)
    try {
      const i = await s(t, e);
      if (i && i instanceof Response)
        return i;
    } catch (i) {
      return console.error(i), new Response(ae(i), { status: 500 });
    }
  return null;
}
const $t = "https://github.com/TBXark/ChatGPT-Telegram-Workers/blob/master/doc/DEPLOY.md", Pt = "https://github.com/TBXark/ChatGPT-Telegram-Workers/issues", To = "./init", dt = `
<br/>
<p>For more information, please visit <a href="${$t}">${$t}</a></p>
<p>If you have any questions, please visit <a href="${Pt}">${Pt}</a></p>
`;
function Zt(r) {
  return `<p style="color: red">Please set the <strong>${r}</strong> environment variable in Cloudflare Workers.</p> `;
}
async function wo(r) {
  const e = [], t = new URL(r.url).host, n = nt ? "safehook" : "webhook";
  for (const i of d.TELEGRAM_AVAILABLE_TOKENS) {
    const o = `https://${t}/telegram/${i.trim()}/${n}`, c = i.split(":")[0];
    e[c] = {
      webhook: await mr(i, o).catch((l) => ae(l)),
      command: await Hr(i).catch((l) => ae(l))
    };
  }
  const s = Ee(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <h2>${t}</h2>
    ${d.TELEGRAM_AVAILABLE_TOKENS.length === 0 ? Zt("TELEGRAM_AVAILABLE_TOKENS") : ""}
    ${Object.keys(e).map((i) => `
        <br/>
        <h4>Bot ID: ${i}</h4>
        <p style="color: ${e[i].webhook.ok ? "green" : "red"}">Webhook: ${JSON.stringify(e[i].webhook)}</p>
        <p style="color: ${e[i].command.ok ? "green" : "red"}">Command: ${JSON.stringify(e[i].command)}</p>
        `).join("")}
      ${dt}
    `);
  return new Response(s, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function So(r) {
  const e = await Tr(), { pathname: t } = new URL(r.url), n = t.match(/^\/telegram\/(.+)\/history/)[1];
  if (new URL(r.url).searchParams.get("password") !== e)
    return new Response("Password Error", { status: 401 });
  const o = JSON.parse(await $.get(n)), c = Ee(`
        <div id="history" style="width: 100%; height: 100%; overflow: auto; padding: 10px;">
            ${o.map((l) => `
                <div style="margin-bottom: 10px;">
                    <hp style="font-size: 16px; color: #999; margin-bottom: 5px;">${l.role}:</hp>
                    <p style="font-size: 12px; color: #333;">${l.content}</p>
                </div>
            `).join("")}
        </div>
  `);
  return new Response(c, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Oo(r) {
  try {
    return Dt(await Eo(r));
  } catch (e) {
    return console.error(e), new Response(ae(e), { status: 200 });
  }
}
async function Ao(r) {
  try {
    const e = new URL(r.url);
    return e.pathname = e.pathname.replace("/safehook", "/webhook"), r = new Request(e, r), Dt(nt.fetch(r));
  } catch (e) {
    return console.error(e), new Response(ae(e), { status: 200 });
  }
}
async function Ro() {
  const r = Ee(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Deployed Successfully!</p>
    <p> Version (ts:${d.BUILD_TIMESTAMP},sha:${d.BUILD_VERSION})</p>
    <br/>
    <p>You must <strong><a href="${To}"> >>>>> click here <<<<< </a></strong> to bind the webhook.</p>
    <br/>
    ${d.API_KEY ? "" : Zt("API_KEY")}
    <p>After binding the webhook, you can use the following commands to control the bot:</p>
    ${Br().map((e) => `<p><strong>${e.command}</strong> - ${e.description}</p>`).join("")}
    <br/>
    <p>You can get bot information by visiting the following URL:</p>
    <p><strong>/telegram/:token/bot</strong> - Get bot information</p>
    ${dt}
  `);
  return new Response(r, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Co(r) {
  const e = new URL(r.url).searchParams.get("text") || "Hello World", t = await jt(), n = Ee(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Token Counter:</p>
    <p>source text: ${e}</p>
    <p>token count: ${t(e)}</p>
    <br/>
    `);
  return new Response(n, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function No() {
  const r = [];
  for (const t of d.TELEGRAM_AVAILABLE_TOKENS) {
    const n = t.split(":")[0];
    r[n] = await br(t);
  }
  const e = Ee(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <h4>Environment About Bot</h4>
    <p><strong>GROUP_CHAT_BOT_ENABLE:</strong> ${d.GROUP_CHAT_BOT_ENABLE}</p>
    <p><strong>GROUP_CHAT_BOT_SHARE_MODE:</strong> ${d.GROUP_CHAT_BOT_SHARE_MODE}</p>
    <p><strong>TELEGRAM_BOT_NAME:</strong> ${d.TELEGRAM_BOT_NAME.join(",")}</p>
    ${Object.keys(r).map((t) => `
            <br/>
            <h4>Bot ID: ${t}</h4>
            <p style="color: ${r[t].ok ? "green" : "red"}">${JSON.stringify(r[t])}</p>
            `).join("")}
    ${dt}
  `);
  return new Response(e, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Io(r) {
  const { pathname: e } = new URL(r.url);
  if (e === "/")
    return Ro();
  if (e.startsWith("/init"))
    return wo(r);
  if (e.startsWith("/telegram") && e.endsWith("/webhook"))
    return Oo(r);
  if (e.startsWith("/telegram") && e.endsWith("/safehook"))
    return Ao(r);
  if (d.DEV_MODE || d.DEBUG_MODE) {
    if (e.startsWith("/telegram") && e.endsWith("/history"))
      return So(r);
    if (e.startsWith("/gpt3/tokens/test"))
      return Co(r);
    if (e.startsWith("/telegram") && e.endsWith("/bot"))
      return No();
  }
  return null;
}
const $o = {
  env: {
    system_init_message: "你是一个得力的助手"
  },
  utils: {
    not_supported_configuration: "不支持的配置项或数据类型错误"
  },
  message: {
    not_supported_chat_type: (r) => `暂不支持${r}类型的聊天`,
    not_supported_chat_type_message: "暂不支持非文本格式消息",
    handle_chat_type_message_error: (r) => `处理${r}类型的聊天消息出错`,
    user_has_no_permission_to_use_the_bot: (r) => `你没有权限使用这个bot, 请请联系管理员添加你的ID(${r})到白名单`,
    group_has_no_permission_to_use_the_bot: (r) => `该群未开启聊天权限, 请请联系管理员添加群ID(${r})到白名单`
  },
  command: {
    help: {
      summary: `当前支持以下命令:
`,
      help: "获取命令帮助",
      new: "发起新的对话",
      start: "获取你的ID, 并发起新的对话",
      img: "生成一张图片, 命令完整格式为 `/img 图片描述`, 例如`/img 月光下的沙滩`",
      version: "获取当前版本号, 判断是否需要更新",
      setenv: "设置用户配置，命令完整格式为 /setenv KEY=VALUE",
      delenv: "删除用户配置，命令完整格式为 /delenv KEY",
      usage: "获取当前机器人的用量统计",
      system: "查看当前一些系统信息",
      role: "设置预设的身份",
      redo: "重做上一次的对话, /redo 加修改过的内容 或者 直接 /redo",
      echo: "回显消息"
    },
    role: {
      not_defined_any_role: "还未定义任何角色",
      current_defined_role: (r) => `当前已定义的角色如下(${r}):
`,
      help: "格式错误: 命令完整格式为 `/role 操作`\n当前支持以下`操作`:\n `/role show` 显示当前定义的角色.\n `/role 角色名 del` 删除指定名称的角色.\n `/role 角色名 KEY=VALUE` 设置指定角色的配置.\n  目前以下设置项:\n   `SYSTEM_INIT_MESSAGE`:初始化消息\n   `OPENAI_API_EXTRA_PARAMS`:OpenAI API 额外参数，必须为JSON",
      delete_role_success: "删除角色成功",
      delete_role_error: (r) => `删除角色错误: \`${r.message}\``,
      update_role_success: "更新配置成功",
      update_role_error: (r) => `配置项格式错误: \`${r.message}\``
    },
    img: {
      help: "请输入图片描述。命令完整格式为 `/img 狸花猫`"
    },
    new: {
      new_chat_start: "新的对话已经开始",
      new_chat_start_private: (r) => `新的对话已经开始，你的ID(${r})`,
      new_chat_start_group: (r) => `新的对话已经开始，群组ID(${r})`
    },
    setenv: {
      help: "配置项格式错误: 命令完整格式为 /setenv KEY=VALUE",
      update_config_success: "更新配置成功",
      update_config_error: (r) => `配置项格式错误: ${r.message}`
    },
    version: {
      new_version_found: (r, e) => `发现新版本，当前版本: ${JSON.stringify(r)}，最新版本: ${JSON.stringify(e)}`,
      current_is_latest_version: (r) => `当前已经是最新版本, 当前版本: ${JSON.stringify(r)}`
    },
    usage: {
      usage_not_open: "当前机器人未开启用量统计",
      current_usage: `📊 当前机器人用量

Tokens:
`,
      total_usage: (r) => `- 总用量：${r || 0} tokens
- 各聊天用量：`,
      no_usage: "- 暂无用量"
    },
    permission: {
      not_authorized: "身份权限验证失败",
      not_enough_permission: (r, e) => `权限不足,需要${r.join(",")},当前:${e}`,
      role_error: (r) => `身份验证出错:${r.message}`,
      command_error: (r) => `命令执行错误: ${r.message}`
    }
  }
}, Po = {
  env: {
    system_init_message: "你是一個得力的助手"
  },
  utils: {
    not_supported_configuration: "不支持的配置或數據類型錯誤"
  },
  message: {
    not_supported_chat_type: (r) => `當前不支持${r}類型的聊天`,
    not_supported_chat_type_message: "當前不支持非文本格式消息",
    handle_chat_type_message_error: (r) => `處理${r}類型的聊天消息出錯`,
    user_has_no_permission_to_use_the_bot: (r) => `您沒有權限使用本機器人，請聯繫管理員將您的ID(${r})添加到白名單中`,
    group_has_no_permission_to_use_the_bot: (r) => `該群組未開啟聊天權限，請聯繫管理員將該群組ID(${r})添加到白名單中`
  },
  command: {
    help: {
      summary: `當前支持的命令如下：
`,
      help: "獲取命令幫助",
      new: "開始一個新對話",
      start: "獲取您的ID並開始一個新對話",
      img: "生成圖片，完整命令格式為`/img 圖片描述`，例如`/img 海灘月光`",
      version: "獲取當前版本號確認是否需要更新",
      setenv: "設置用戶配置，完整命令格式為/setenv KEY=VALUE",
      delenv: "刪除用戶配置，完整命令格式為/delenv KEY",
      usage: "獲取機器人當前的使用情況統計",
      system: "查看一些系統信息",
      role: "設置預設身份",
      redo: "重做上一次的對話 /redo 加修改過的內容 或者 直接 /redo",
      echo: "回显消息"
    },
    role: {
      not_defined_any_role: "尚未定義任何角色",
      current_defined_role: (r) => `當前已定義的角色如下(${r})：
`,
      help: "格式錯誤：完整命令格式為`/role 操作`\n當前支持的`操作`如下：\n `/role show` 查看當前已定義的角色。\n `/role 角色名 del` 刪除指定的角色。\n `/role 角色名 KEY=VALUE` 設置指定角色的配置。\n  當前支持的設置如下：\n   `SYSTEM_INIT_MESSAGE`：初始化消息\n   `OPENAI_API_EXTRA_PARAMS`：OpenAI API額外參數，必須為JSON",
      delete_role_success: "刪除角色成功",
      delete_role_error: (r) => `刪除角色出錯：\`${r.message}\``,
      update_role_success: "更新配置成功",
      update_role_error: (r) => `配置項格式錯誤：\`${r.message}\``
    },
    img: {
      help: "請輸入圖片描述。完整命令格式為`/img raccoon cat`"
    },
    new: {
      new_chat_start: "開始一個新對話",
      new_chat_start_private: (r) => `開始一個新對話，您的ID(${r})`,
      new_chat_start_group: (r) => `開始一個新對話，群組ID(${r})`
    },
    setenv: {
      help: "配置項格式錯誤：完整命令格式為/setenv KEY=VALUE",
      update_config_success: "更新配置成功",
      update_config_error: (r) => `配置項格式錯誤：\`${r.message}\``
    },
    version: {
      new_version_found: (r, e) => `發現新版本，當前版本：${JSON.stringify(r)}，最新版本：${JSON.stringify(e)}`,
      current_is_latest_version: (r) => `當前已是最新版本，當前版本：${JSON.stringify(r)}`
    },
    usage: {
      usage_not_open: "當前機器人未開啟使用情況統計",
      current_usage: `📊 當前機器人使用情況

使用情況：
`,
      total_usage: (r) => `- 總計：${r || 0} 次
- 每個群組使用情況： `,
      no_usage: "- 暫無使用情況"
    },
    permission: {
      not_authorized: "身份權限驗證失敗",
      not_enough_permission: (r, e) => `權限不足，需要${r.join(",")}，當前：${e}`,
      role_error: (r) => `身份驗證出錯：${r.message}`,
      command_error: (r) => `命令執行出錯：${r.message}`
    }
  }
}, ko = {
  env: {
    system_init_message: "You are a helpful assistant"
  },
  utils: {
    not_supported_configuration: "Not supported configuration or data type error"
  },
  message: {
    not_supported_chat_type: (r) => `Currently not supported ${r} type of chat`,
    not_supported_chat_type_message: "Currently not supported non-text format messages",
    handle_chat_type_message_error: (r) => `Error handling ${r} type of chat messages`,
    user_has_no_permission_to_use_the_bot: (r) => `You do not have permission to use this bot, please contact the administrator to add your ID (${r}) to the whitelist`,
    group_has_no_permission_to_use_the_bot: (r) => `The group has not enabled chat permissions, please contact the administrator to add the group ID (${r}) to the whitelist`
  },
  command: {
    help: {
      summary: `The following commands are currently supported:
`,
      help: "Get command help",
      new: "Start a new conversation",
      start: "Get your ID and start a new conversation",
      img: "Generate an image, the complete command format is `/img image description`, for example `/img beach at moonlight`",
      version: "Get the current version number to determine whether to update",
      setenv: "Set user configuration, the complete command format is /setenv KEY=VALUE",
      delenv: "Delete user configuration, the complete command format is /delenv KEY",
      usage: "Get the current usage statistics of the robot",
      system: "View some system information",
      role: "Set the preset identity",
      redo: "Redo the last conversation, /redo with modified content or directly /redo",
      echo: "Echo the message"
    },
    role: {
      not_defined_any_role: "No roles have been defined yet",
      current_defined_role: (r) => `The following roles are currently defined (${r}):
`,
      help: "Format error: the complete command format is `/role operation`\nThe following `operation` is currently supported:\n `/role show` Display the currently defined roles.\n `/role role name del` Delete the specified role.\n `/role role name KEY=VALUE` Set the configuration of the specified role.\n  The following settings are currently supported:\n   `SYSTEM_INIT_MESSAGE`: Initialization message\n   `OPENAI_API_EXTRA_PARAMS`: OpenAI API extra parameters, must be JSON",
      delete_role_success: "Delete role successfully",
      delete_role_error: (r) => `Delete role error: \`${r.message}\``,
      update_role_success: "Update configuration successfully",
      update_role_error: (r) => `Configuration item format error: \`${r.message}\``
    },
    img: {
      help: "Please enter the image description. The complete command format is `/img raccoon cat`"
    },
    new: {
      new_chat_start: "A new conversation has started",
      new_chat_start_private: (r) => `A new conversation has started, your ID (${r})`,
      new_chat_start_group: (r) => `A new conversation has started, group ID (${r})`
    },
    setenv: {
      help: "Configuration item format error: the complete command format is /setenv KEY=VALUE",
      update_config_success: "Update configuration successfully",
      update_config_error: (r) => `Configuration item format error: ${r.message}`
    },
    version: {
      new_version_found: (r, e) => `New version found, current version: ${JSON.stringify(r)}, latest version: ${JSON.stringify(e)}`,
      current_is_latest_version: (r) => `Current is the latest version, current version: ${JSON.stringify(r)}`
    },
    usage: {
      usage_not_open: "The current robot is not open for usage statistics",
      current_usage: `📊 Current robot usage

Tokens:
`,
      total_usage: (r) => `- Total: ${r || 0} tokens
- Per chat usage: `,
      no_usage: "- No usage"
    },
    permission: {
      not_authorized: "Identity permission verification failed",
      not_enough_permission: (r, e) => `Insufficient permissions, need ${r.join(",")}, current: ${e}`,
      role_error: (r) => `Identity verification error: ${r.message}`,
      command_error: (r) => `Command execution error: ${r.message}`
    }
  }
};
function jo(r) {
  switch (r.toLowerCase()) {
    case "cn":
    case "zh-cn":
    case "zh-hans":
      return $o;
    case "zh-tw":
    case "zh-hk":
    case "zh-mo":
    case "zh-hant":
      return Po;
    case "en":
    case "en-us":
      return ko;
  }
}
const Fo = {
  async fetch(r, e) {
    try {
      return sr(e, jo), await Io(r) || new Response("NOTFOUND", { status: 404 });
    } catch (t) {
      return console.error(t), new Response(ae(t), { status: 500 });
    }
  }
};
export {
  Fo as default
};
