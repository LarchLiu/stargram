var Ie = Object.defineProperty;
var Re = (e, t, r) => t in e ? Ie(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var D = (e, t, r) => (Re(e, typeof t != "symbol" ? t + "" : t, r), r);
const a = {
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
  STARGRAM_HUB_API: null,
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
  BUILD_TIMESTAMP: "1685956841",
  // 当前版本 commit id
  BUILD_VERSION: "1fef12f",
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
}, R = {
  PASSWORD_KEY: "chat_history_password",
  GROUP_TYPES: ["group", "supergroup"],
  USER_AGENT: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15"
};
let g = null, Z = null;
const we = {
  API_KEY: "string",
  NOTION_API_KEY: "string",
  NOTION_DATABASE_ID: "string",
  STARGRAM_HUB_API: "string"
};
function be(e, t) {
  g = e.DATABASE, Z = e.API_GUARD;
  for (const r in a)
    if (e[r])
      switch (we[r] || typeof a[r]) {
        case "number":
          a[r] = Number.parseInt(e[r]) || a[r];
          break;
        case "boolean":
          a[r] = (e[r] || "false") === "true";
          break;
        case "string":
          a[r] = e[r];
          break;
        case "object":
          if (Array.isArray(a[r]))
            a[r] = e[r].split(",");
          else
            try {
              a[r] = JSON.parse(e[r]);
            } catch (n) {
              console.error(n);
            }
          break;
        default:
          a[r] = e[r];
          break;
      }
  e.TELEGRAM_TOKEN && !a.TELEGRAM_AVAILABLE_TOKENS.includes(e.TELEGRAM_TOKEN) && (e.BOT_NAME && a.TELEGRAM_AVAILABLE_TOKENS.length === a.TELEGRAM_BOT_NAME.length && a.TELEGRAM_BOT_NAME.push(e.BOT_NAME), a.TELEGRAM_AVAILABLE_TOKENS.push(e.TELEGRAM_TOKEN)), a.I18N = t((a.LANGUAGE || "cn").toLowerCase()), a.SYSTEM_INIT_MESSAGE = a.I18N.env.system_init_message;
}
const Ce = /[a-zA-Z0-9_\u0392-\u03C9\u00C0-\u00FF\u0600-\u06FF\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g;
function W(e) {
  const t = e.match(Ce);
  let r = 0;
  if (!t)
    return 0;
  for (let n = 0; n < t.length; n++)
    t[n].charCodeAt(0) >= 19968 ? r += t[n].length * 2 : r += 1;
  return r;
}
function $e(e) {
  e = e.replace(/,+,/g, ", ");
  const t = /<img src="(.+)" \/>/g;
  e = e.replace(t, "![$1]($1)");
  const r = /<a href="(.+)">(.+)<\/a>/g;
  return e = e.replace(r, "[$2]($1)"), e = e.replace(/!\[.+?\]\(.+?\)/g, ""), e = e.replace(/<(?:.|\n)*?>/gm, ""), e = e.replace(/<\/(?:.|\n)*?>/gm, ""), e = e.replace(/#+\s/g, ""), e = e.replace(/\s+/g, " "), e = e.replace(/\n{2,}/g, `
`), e = e.trim(), e = He(e), e;
}
function Pe(e, t) {
  let r = e;
  if (e && Object.keys(t).length)
    for (const n in t)
      r = r.replaceAll(`{${n}}`, t[n]);
  return r;
}
const Ue = {
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
function Me(e) {
  return e.replace(/(&amp;|&lt;|&#60;|&gt;|&#62;|&le;|&#8804;|&ge;|&#8805;|&quot;|&#34;|&trade;|&#8482;|&asymp;|&#8776;|&ndash;|&#8211;|&mdash;|&#8212;|&copy;|&#169;|&reg;|&#174;|&ne;|&#8800;|&pound;|&#163;|&euro;|&#8364;|&deg;|&#176;|&#39;|&apos;|&nbsp;|&#160;|&quot;|&#34;|&trade;|&#8482;|&asymp;|&#8776;|&ndash;|&#8211;|&mdash;|&#8212;|&copy;|&#169;|&reg;|&#174;|&ne;|&#8800;|&pound;|&#163;|&euro;|&#8364;|&deg;|&#176;|&#39;|&apos;|&nbsp;|&#160;)/g, (t) => Ue[t] || t);
}
function He(e) {
  return Me(e);
}
function q(e) {
  let t = e.message || "";
  return e.data && (t += JSON.stringify(e.data)), t;
}
class Le {
  constructor() {
    // 用户配置
    D(this, "USER_CONFIG", {
      // 系统初始化消息
      SYSTEM_INIT_MESSAGE: a.SYSTEM_INIT_MESSAGE,
      // OpenAI API 额外参数
      OPENAI_API_EXTRA_PARAMS: {},
      // OenAI API Key
      OPENAI_API_KEY: null
    });
    D(this, "USER_DEFINE", {
      // 自定义角色
      ROLE: {}
    });
    // 当前聊天上下文
    D(this, "CURRENT_CHAT_CONTEXT", {
      chat_id: null,
      reply_to_message_id: null,
      // 如果是群组，这个值为消息ID，否则为null
      parse_mode: "Markdown"
    });
    // 共享上下文
    D(this, "SHARE_CONTEXT", {
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
  _initChatContext(t, r) {
    this.CURRENT_CHAT_CONTEXT.chat_id = t, this.CURRENT_CHAT_CONTEXT.reply_to_message_id = r, r && (this.CURRENT_CHAT_CONTEXT.allow_sending_without_reply = !0);
  }
  //
  /**
   * 初始化用户配置
   *
   * @inner
   * @param {string} storeKey
   */
  async _initUserConfig(t) {
    try {
      const r = JSON.parse(await g.get(t));
      for (const n in r)
        n === "USER_DEFINE" && typeof this.USER_DEFINE == typeof r[n] ? this._initUserDefine(r[n]) : this.USER_CONFIG.hasOwnProperty(n) && typeof this.USER_CONFIG[n] == typeof r[n] && (this.USER_CONFIG[n] = r[n]);
    } catch (r) {
      console.error(r);
    }
  }
  /**
   * @inner
   * @param {object} userDefine
   */
  _initUserDefine(t) {
    for (const r in t)
      this.USER_DEFINE.hasOwnProperty(r) && typeof this.USER_DEFINE[r] == typeof t[r] && (this.USER_DEFINE[r] = t[r]);
  }
  /**
   * @param {Request} request
   */
  initTelegramContext(t) {
    const { pathname: r } = new URL(t.url), n = r.match(
      /^\/telegram\/(\d+:[A-Za-z0-9_-]{35})\/webhook/
    )[1], o = a.TELEGRAM_AVAILABLE_TOKENS.indexOf(n);
    if (o === -1)
      throw new Error("Token not allowed");
    this.SHARE_CONTEXT.currentBotToken = n, this.SHARE_CONTEXT.currentBotId = n.split(":")[0], a.TELEGRAM_BOT_NAME.length > o && (this.SHARE_CONTEXT.currentBotName = a.TELEGRAM_BOT_NAME[o]);
  }
  /**
   *
   * @inner
   * @param {TelegramMessage} message
   */
  async _initShareContext(t) {
    var l, u, i;
    this.SHARE_CONTEXT.usageKey = `usage:${this.SHARE_CONTEXT.currentBotId}`;
    const r = (l = t == null ? void 0 : t.chat) == null ? void 0 : l.id;
    if (r == null)
      throw new Error("Chat id not found");
    const n = this.SHARE_CONTEXT.currentBotId;
    let o = `history:${r}`, s = `user_config:${r}`, c = null;
    n && (o += `:${n}`, s += `:${n}`), R.GROUP_TYPES.includes((u = t.chat) == null ? void 0 : u.type) && (!a.GROUP_CHAT_BOT_SHARE_MODE && t.from.id && (o += `:${t.from.id}`, s += `:${t.from.id}`), c = `group_admin:${r}`), this.SHARE_CONTEXT.chatHistoryKey = o, this.SHARE_CONTEXT.configStoreKey = s, this.SHARE_CONTEXT.groupAdminKey = c, this.SHARE_CONTEXT.chatType = (i = t.chat) == null ? void 0 : i.type, this.SHARE_CONTEXT.chatId = t.chat.id, this.SHARE_CONTEXT.speakerId = t.from.id || t.chat.id;
  }
  /**
   * @param {TelegramMessage} message
   * @return {Promise<void>}
   */
  async initContext(t) {
    var o, s;
    const r = (o = t == null ? void 0 : t.chat) == null ? void 0 : o.id, n = R.GROUP_TYPES.includes((s = t.chat) == null ? void 0 : s.type) ? t.message_id : null;
    this._initChatContext(r, n), await this._initShareContext(t), await this._initUserConfig(this.SHARE_CONTEXT.configStoreKey);
  }
}
async function re(e, t, r) {
  return await fetch(
    `${a.TELEGRAM_API_DOMAIN}/bot${t}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...r,
        text: e
      })
    }
  );
}
async function De(e, t, r) {
  const n = r;
  if (e.length <= 4096) {
    const s = await re(e, t, n);
    if (s.status === 200)
      return s;
  }
  const o = 4e3;
  n.parse_mode = "HTML";
  for (let s = 0; s < e.length; s += o) {
    const c = e.slice(s, s + o);
    await re(`<pre>
${c}
</pre>`, t, n);
  }
  return new Response("Message batch send", { status: 200 });
}
function _(e) {
  return async (t) => De(t, e.SHARE_CONTEXT.currentBotToken, e.CURRENT_CHAT_CONTEXT);
}
async function Ge(e, t, r) {
  return await fetch(
    `${a.TELEGRAM_API_DOMAIN}/bot${t}/sendPhoto`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...r,
        photo: e,
        parse_mode: null
      })
    }
  );
}
function ke(e) {
  return (t) => Ge(t, e.SHARE_CONTEXT.currentBotToken, e.CURRENT_CHAT_CONTEXT);
}
async function ve(e, t, r) {
  return await fetch(
    `${a.TELEGRAM_API_DOMAIN}/bot${t}/sendChatAction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: r,
        action: e
      })
    }
  ).then((n) => n.json());
}
function Q(e) {
  return (t) => ve(t, e.SHARE_CONTEXT.currentBotToken, e.CURRENT_CHAT_CONTEXT.chat_id);
}
async function Be(e, t) {
  return await fetch(
    `${a.TELEGRAM_API_DOMAIN}/bot${e}/setWebhook`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: t
      })
    }
  ).then((r) => r.json());
}
async function je(e, t, r, n) {
  let o;
  try {
    o = JSON.parse(await g.get(t));
  } catch (s) {
    return console.error(s), s.message;
  }
  if (!o || !Array.isArray(o) || o.length === 0) {
    const s = await Xe(r, n);
    if (s == null)
      return null;
    o = s, await g.put(
      t,
      JSON.stringify(o),
      { expiration: Date.now() / 1e3 + 120 }
    );
  }
  for (let s = 0; s < o.length; s++) {
    const c = o[s];
    if (c.user.id === e)
      return c.status;
  }
  return "member";
}
function Ke(e) {
  return (t) => je(t, e.SHARE_CONTEXT.groupAdminKey, e.CURRENT_CHAT_CONTEXT.chat_id, e.SHARE_CONTEXT.currentBotToken);
}
async function Xe(e, t) {
  try {
    const r = await fetch(
      `${a.TELEGRAM_API_DOMAIN}/bot${t}/getChatAdministrators`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chat_id: e })
      }
    ).then((n) => n.json());
    if (r.ok)
      return r.result;
  } catch (r) {
    return console.error(r), null;
  }
}
async function Fe(e) {
  const t = await fetch(
    `${a.TELEGRAM_API_DOMAIN}/bot${e}/getMe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }
  ).then((r) => r.json());
  return t.ok ? {
    ok: !0,
    info: {
      name: t.result.first_name,
      bot_name: t.result.username,
      can_join_groups: t.result.can_join_groups,
      can_read_all_group_messages: t.result.can_read_all_group_messages
    }
  } : t;
}
async function ne(e, t) {
  try {
    const r = await g.get(e);
    if (r && r !== "")
      return r;
  } catch (r) {
    console.error(r);
  }
  try {
    const r = await fetch(t, {
      headers: {
        "User-Agent": R.USER_AGENT
      }
    }).then((n) => n.text());
    return await g.put(e, r), r;
  } catch (r) {
    console.error(r);
  }
  return null;
}
async function pe() {
  const e = "https://raw.githubusercontent.com/tbxark-archive/GPT-3-Encoder/master", t = await ne("encoder_raw_file", `${e}/encoder.json`).then((p) => JSON.parse(p)), r = await ne("bpe_raw_file", `${e}/vocab.bpe`), n = (p, f) => Array.from(Array(f).keys()).slice(p), o = (p) => p.charCodeAt(0), s = (p) => String.fromCharCode(p), c = new TextEncoder("utf-8"), l = (p) => Array.from(c.encode(p)).map((f) => f.toString()), u = (p, f) => {
    const T = {};
    return p.forEach((y, m) => {
      T[p[m]] = f[m];
    }), T;
  };
  function i() {
    const p = n(o("!"), o("~") + 1).concat(n(o("¡"), o("¬") + 1), n(o("®"), o("ÿ") + 1));
    let f = p.slice(), T = 0;
    for (let m = 0; m < 2 ** 8; m++)
      p.includes(m) || (p.push(m), f.push(2 ** 8 + T), T = T + 1);
    f = f.map((m) => s(m));
    const y = {};
    return p.forEach((m, C) => {
      y[p[C]] = f[C];
    }), y;
  }
  function h(p) {
    const f = /* @__PURE__ */ new Set();
    let T = p[0];
    for (let y = 1; y < p.length; y++) {
      const m = p[y];
      f.add([T, m]), T = m;
    }
    return f;
  }
  const d = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu, E = {};
  Object.keys(t).forEach((p) => {
    E[t[p]] = p;
  });
  const N = r.split(`
`), w = N.slice(1, N.length - 1).map((p) => p.split(/(\s+)/).filter((f) => f.trim().length > 0)), b = i(), ee = {};
  Object.keys(b).forEach((p) => {
    ee[b[p]] = p;
  });
  const k = u(w, n(0, w.length)), M = /* @__PURE__ */ new Map();
  function Oe(p) {
    if (M.has(p))
      return M.get(p);
    let f = p.split(""), T = h(f);
    if (!T)
      return p;
    for (; ; ) {
      const y = {};
      Array.from(T).forEach(($) => {
        const te = k[$];
        y[Number.isNaN(te) ? 1e11 : te] = $;
      });
      const m = y[Math.min(...Object.keys(y).map(
        ($) => Number.parseInt($)
      ))];
      if (!(m in k))
        break;
      const C = m[0], H = m[1];
      let P = [], A = 0;
      for (; A < f.length; ) {
        const $ = f.indexOf(C, A);
        if ($ === -1) {
          P = P.concat(f.slice(A));
          break;
        }
        P = P.concat(f.slice(A, $)), A = $, f[A] === C && A < f.length - 1 && f[A + 1] === H ? (P.push(C + H), A = A + 2) : (P.push(f[A]), A = A + 1);
      }
      if (f = P, f.length === 1)
        break;
      T = h(f);
    }
    return f = f.join(" "), M.set(p, f), f;
  }
  return function(f) {
    let T = 0;
    const y = Array.from(f.matchAll(d)).map((m) => m[0]);
    for (let m of y) {
      m = l(m).map((H) => b[H]).join("");
      const C = Oe(m).split(" ").map((H) => t[H]);
      T += C.length;
    }
    return T;
  };
}
function Ye(e) {
  const t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let r = "";
  for (let n = e; n > 0; --n)
    r += t[Math.floor(Math.random() * t.length)];
  return r;
}
async function Je() {
  let e = await g.get(R.PASSWORD_KEY);
  return e === null && (e = Ye(32), await g.put(R.PASSWORD_KEY, e)), e;
}
function G(e) {
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
    ${e}
  </body>
</html>
  `;
}
function U(e) {
  return JSON.stringify({
    message: e.message,
    stack: e.stack
  });
}
function fe(e, t, r) {
  switch (typeof e[t]) {
    case "number":
      e[t] = Number(r);
      break;
    case "boolean":
      e[t] = r === "true";
      break;
    case "string":
      e[t] = r;
      break;
    case "object":
      const n = JSON.parse(r);
      if (typeof n == "object") {
        e[t] = n;
        break;
      }
      throw new Error(a.I18N.utils.not_supported_configuration);
    default:
      throw new Error(a.I18N.utils.not_supported_configuration);
  }
}
async function We() {
  let e = (t) => Array.from(t).length;
  try {
    a.GPT3_TOKENS_COUNT && (e = await pe());
  } catch (t) {
    console.error(t);
  }
  return (t) => {
    try {
      return e(t);
    } catch (r) {
      return console.error(r), Array.from(t).length;
    }
  };
}
function me(e) {
  return e === null ? new Response("NOT HANDLED", { status: 200 }) : e.status === 200 ? e : new Response(e.body, {
    status: 200,
    headers: {
      "Original-Status": e.status,
      ...e.headers
    }
  });
}
async function ze(e, t, r) {
  var c;
  const n = r.USER_CONFIG.OPENAI_API_KEY || a.API_KEY, o = {
    model: a.CHAT_MODEL,
    ...r.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages: [...t || [], { role: "user", content: e }]
  }, s = await fetch(`${a.OPENAI_API_DOMAIN}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${n}`
    },
    body: JSON.stringify(o)
  }).then((l) => l.json());
  if ((c = s.error) != null && c.message)
    throw a.DEV_MODE || a.DEV_MODE ? new Error(`OpenAI API Error
> ${s.error.message}
Body: ${JSON.stringify(o)}`) : new Error(`OpenAI API Error
> ${s.error.message}`);
  return setTimeout(() => qe(s.usage, r).catch(console.error), 0), s.choices[0].message.content;
}
async function Ve(e, t) {
  var s;
  const r = t.USER_CONFIG.OPENAI_API_KEY || a.API_KEY, n = {
    prompt: e,
    n: 1,
    size: "512x512"
  }, o = await fetch(`${a.OPENAI_API_DOMAIN}/v1/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${r}`
    },
    body: JSON.stringify(n)
  }).then((c) => c.json());
  if ((s = o.error) != null && s.message)
    throw new Error(`OpenAI API Error
> ${o.error.message}`);
  return o.data[0].url;
}
async function Ze(e, t, r) {
  const n = a.AUTO_TRIM_HISTORY && a.MAX_HISTORY_LENGTH <= 0, o = t.SHARE_CONTEXT.chatHistoryKey;
  let s = await Qe(o, t);
  if (r) {
    const i = r(s, e);
    s = i.history, e = i.text;
  }
  const { real: c, original: l } = s, u = await ze(e, c, t);
  return n || (l.push({ role: "user", content: e || "", cosplay: t.SHARE_CONTEXT.role || "" }), l.push({ role: "assistant", content: u, cosplay: t.SHARE_CONTEXT.role || "" }), await g.put(o, JSON.stringify(l)).catch(console.error)), u;
}
async function qe(e, t) {
  if (!a.ENABLE_USAGE_STATISTICS)
    return;
  let r = JSON.parse(await g.get(t.SHARE_CONTEXT.usageKey));
  r || (r = {
    tokens: {
      total: 0,
      chats: {}
    }
  }), r.tokens.total += e.total_tokens, r.tokens.chats[t.SHARE_CONTEXT.chatId] ? r.tokens.chats[t.SHARE_CONTEXT.chatId] += e.total_tokens : r.tokens.chats[t.SHARE_CONTEXT.chatId] = e.total_tokens, await g.put(t.SHARE_CONTEXT.usageKey, JSON.stringify(r));
}
async function Qe(e, t) {
  const r = { role: "system", content: t.USER_CONFIG.SYSTEM_INIT_MESSAGE };
  if (a.AUTO_TRIM_HISTORY && a.MAX_HISTORY_LENGTH <= 0)
    return r.role = a.SYSTEM_INIT_MESSAGE_ROLE, { real: [r], original: [r] };
  let o = [];
  try {
    o = JSON.parse(await g.get(e));
  } catch (u) {
    console.error(u);
  }
  (!o || !Array.isArray(o)) && (o = []);
  let s = JSON.parse(JSON.stringify(o));
  t.SHARE_CONTEXT.role && (o = o.filter((u) => t.SHARE_CONTEXT.role === u.cosplay)), o.forEach((u) => {
    delete u.cosplay;
  });
  const c = await We(), l = (u, i, h, d) => {
    u.length > h && (u = u.splice(u.length - h));
    let E = i;
    for (let N = u.length - 1; N >= 0; N--) {
      const w = u[N];
      let b = 0;
      if (w.content ? b = c(w.content) : w.content = "", E += b, E > d) {
        u = u.splice(N + 1);
        break;
      }
    }
    return u;
  };
  if (a.AUTO_TRIM_HISTORY && a.MAX_HISTORY_LENGTH > 0) {
    const u = c(r.content), i = Math.max(Object.keys(t.USER_DEFINE.ROLE).length, 1);
    o = l(o, u, a.MAX_HISTORY_LENGTH, a.MAX_TOKEN_LENGTH), s = l(s, u, a.MAX_HISTORY_LENGTH * i, a.MAX_TOKEN_LENGTH * i);
  }
  switch (o.length > 0 ? o[0].role : "") {
    case "assistant":
    case "system":
      o[0] = r;
      break;
    default:
      o.unshift(r);
  }
  return a.SYSTEM_INIT_MESSAGE_ROLE !== "system" && o.length > 0 && o[0].role === "system" && (o[0].role = a.SYSTEM_INIT_MESSAGE_ROLE), { real: o, original: s };
}
const S = {
  default(e) {
    return R.GROUP_TYPES.includes(e) ? ["administrator", "creator"] : !1;
  },
  shareModeGroup(e) {
    return R.GROUP_TYPES.includes(e) && a.GROUP_CHAT_BOT_SHARE_MODE ? ["administrator", "creator"] : !1;
  }
}, O = {
  "/help": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: tt
  },
  "/new": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: oe,
    needAuth: S.shareModeGroup
  },
  "/start": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: oe,
    needAuth: S.default
  },
  "/img": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: et,
    needAuth: S.shareModeGroup
  },
  "/version": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: ot,
    needAuth: S.default
  },
  "/setenv": {
    scopes: [],
    fn: rt,
    needAuth: S.shareModeGroup
  },
  "/delenv": {
    scopes: [],
    fn: nt,
    needAuth: S.shareModeGroup
  },
  "/usage": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: st,
    needAuth: S.default
  },
  "/system": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: at,
    needAuth: S.default
  },
  "/role": {
    scopes: ["all_private_chats"],
    fn: xe,
    needAuth: S.shareModeGroup
  },
  "/redo": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: it,
    needAuth: S.shareModeGroup
  }
};
async function xe(e, t, r, n) {
  if (r === "show") {
    const h = Object.getOwnPropertyNames(n.USER_DEFINE.ROLE).length;
    if (h === 0)
      return _(n)(a.I18N.command.role.not_defined_any_role);
    let d = a.I18N.command.role.current_defined_role(h);
    for (const E in n.USER_DEFINE.ROLE)
      n.USER_DEFINE.ROLE.hasOwnProperty(E) && (d += `~${E}:
<pre>`, d += `${JSON.stringify(n.USER_DEFINE.ROLE[E])}
`, d += "</pre>");
    return n.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", _(n)(d);
  }
  const o = r.indexOf(" ");
  if (o === -1)
    return _(n)(a.I18N.command.role.help);
  const s = r.slice(0, o), c = r.slice(o + 1).trim(), l = c.indexOf("=");
  if (l === -1) {
    if (c === "del")
      try {
        if (n.USER_DEFINE.ROLE[s])
          return delete n.USER_DEFINE.ROLE[s], await g.put(
            n.SHARE_CONTEXT.configStoreKey,
            JSON.stringify(Object.assign(n.USER_CONFIG, { USER_DEFINE: n.USER_DEFINE }))
          ), _(n)(a.I18N.command.role.delete_role_success);
      } catch (h) {
        return _(n)(a.I18N.command.role.delete_role_error(h));
      }
    return _(n)(a.I18N.command.role.help);
  }
  const u = c.slice(0, l), i = c.slice(l + 1);
  n.USER_DEFINE.ROLE[s] || (n.USER_DEFINE.ROLE[s] = {
    // 系统初始化消息
    SYSTEM_INIT_MESSAGE: a.SYSTEM_INIT_MESSAGE,
    // OpenAI API 额外参数
    OPENAI_API_EXTRA_PARAMS: {}
  });
  try {
    return fe(n.USER_DEFINE.ROLE[s], u, i), await g.put(
      n.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(Object.assign(n.USER_CONFIG, { USER_DEFINE: n.USER_DEFINE }))
    ), _(n)(a.I18N.command.role.update_role_success);
  } catch (h) {
    return _(n)(a.I18N.command.role.update_role_error(h));
  }
}
async function et(e, t, r, n) {
  if (r === "")
    return _(n)(a.I18N.command.img.help);
  try {
    setTimeout(() => Q(n)("upload_photo").catch(console.error), 0);
    const o = await Ve(r, n);
    try {
      return ke(n)(o);
    } catch {
      return _(n)(`${o}`);
    }
  } catch (o) {
    return _(n)(`ERROR: ${o.message}`);
  }
}
async function tt(e, t, r, n) {
  const o = a.I18N.command.help.summary + Object.keys(O).map((s) => `${s}：${a.I18N.command.help[s.substring(1)]}`).join(`
`);
  return _(n)(o);
}
async function oe(e, t, r, n) {
  try {
    return await g.delete(n.SHARE_CONTEXT.chatHistoryKey), t === "/new" ? _(n)(a.I18N.command.new.new_chat_start) : n.SHARE_CONTEXT.chatType === "private" ? _(n)(a.I18N.command.new.new_chat_start_private(n.CURRENT_CHAT_CONTEXT.chat_id)) : _(n)(a.I18N.command.new.new_chat_start_group(n.CURRENT_CHAT_CONTEXT.chat_id));
  } catch (o) {
    return _(n)(`ERROR: ${o.message}`);
  }
}
async function rt(e, t, r, n) {
  const o = r.indexOf("=");
  if (o === -1)
    return _(n)(a.I18N.command.setenv.help);
  const s = r.slice(0, o), c = r.slice(o + 1);
  try {
    return fe(n.USER_CONFIG, s, c), await g.put(
      n.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(n.USER_CONFIG)
    ), _(n)(a.I18N.command.setenv.update_config_success);
  } catch (l) {
    return _(n)(a.I18N.command.setenv.update_config_error(l));
  }
}
async function nt(e, t, r, n) {
  try {
    return n.USER_CONFIG[r] = null, await g.put(
      n.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(n.USER_CONFIG)
    ), _(n)(a.I18N.command.setenv.update_config_success);
  } catch (o) {
    return _(n)(a.I18N.command.setenv.update_config_error(o));
  }
}
async function ot(e, t, r, n) {
  const o = {
    headers: {
      "User-Agent": R.USER_AGENT
    }
  }, s = {
    ts: a.BUILD_TIMESTAMP,
    sha: a.BUILD_VERSION
  }, c = `https://raw.githubusercontent.com/LarchLiu/stargram/${a.UPDATE_BRANCH}`, l = `${c}/dist/timestamp`, u = `${c}/dist/buildinfo.json`;
  let i = await fetch(u, o).then((h) => h.json()).catch(() => null);
  if (i || (i = await fetch(l, o).then((h) => h.text()).then((h) => ({ ts: Number(h.trim()), sha: "unknown" })).catch(() => ({ ts: 0, sha: "unknown" }))), s.ts < i.ts) {
    const h = a.I18N.command.version.new_version_found(s, i);
    return _(n)(h);
  } else {
    const h = a.I18N.command.version.current_is_latest_version(s);
    return _(n)(h);
  }
}
async function st(e, t, r, n) {
  if (!a.ENABLE_USAGE_STATISTICS)
    return _(n)(a.I18N.command.usage.usage_not_open);
  const o = JSON.parse(await g.get(n.SHARE_CONTEXT.usageKey));
  let s = a.I18N.command.usage.current_usage;
  if (o != null && o.tokens) {
    const { tokens: c } = o, l = Object.keys(c.chats || {}).sort((u, i) => c.chats[i] - c.chats[u]);
    s += a.I18N.command.usage.total_usage(c.total);
    for (let u = 0; u < Math.min(l.length, 30); u++)
      s += `
  - ${l[u]}: ${c.chats[l[u]]} tokens`;
    l.length === 0 ? s += "0 tokens" : l.length > 30 && (s += `
  ...`);
  } else
    s += a.I18N.command.usage.no_usage;
  return _(n)(s);
}
async function at(e, t, r, n) {
  let o = `Current System Info:
`;
  if (o += `OpenAI Model:${a.CHAT_MODEL}
`, a.DEV_MODE) {
    const s = { ...n.SHARE_CONTEXT };
    s.currentBotToken = "******", n.USER_CONFIG.OPENAI_API_KEY = "******", o += "<pre>", o += `USER_CONFIG: 
${JSON.stringify(n.USER_CONFIG, null, 2)}
`, o += `CHAT_CONTEXT: 
${JSON.stringify(n.CURRENT_CHAT_CONTEXT, null, 2)}
`, o += `SHARE_CONTEXT: 
${JSON.stringify(s, null, 2)}
`, o += "</pre>";
  }
  return n.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", _(n)(o);
}
async function it(e, t, r, n) {
  setTimeout(() => Q(n)("typing").catch(console.error), 0);
  const o = await Ze(r, n, (s, c) => {
    const { real: l, original: u } = s;
    let i = c;
    for (; ; ) {
      const h = l.pop();
      if (u.pop(), h == null)
        break;
      if (h.role === "user") {
        (c === "" || c === void 0 || c === null) && (i = h.content);
        break;
      }
    }
    return { history: { real: l, original: u }, text: i };
  });
  return _(n)(o);
}
async function ct(e, t, r, n) {
  let o = "<pre>";
  return o += JSON.stringify({ message: e }, null, 2), o += "</pre>", n.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", _(n)(o);
}
async function lt(e, t) {
  a.DEV_MODE && (O["/echo"] = {
    help: "[DEBUG ONLY] echo message",
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: ct,
    needAuth: S.default
  });
  for (const r in O)
    if (e.text === r || e.text.startsWith(`${r} `)) {
      const n = O[r];
      try {
        if (n.needAuth) {
          const s = n.needAuth(t.SHARE_CONTEXT.chatType);
          if (s) {
            const c = await Ke(t)(t.SHARE_CONTEXT.speakerId);
            if (c === null)
              return _(t)(a.I18N.command.permission.not_authorized);
            if (!s.includes(c)) {
              const l = a.I18N.command.permission.not_enough_permission(s, c);
              return _(t)(l);
            }
          }
        }
      } catch (s) {
        return _(t)(a.I18N.command.permission.role_error(s));
      }
      const o = e.text.substring(r.length).trim();
      try {
        return await n.fn(e, r, o, t);
      } catch (s) {
        return _(t)(a.I18N.command.permission.command_error(s));
      }
    }
  return null;
}
async function ut(e) {
  const t = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: []
  };
  for (const n in O)
    if (!a.HIDE_COMMAND_BUTTONS.includes(n) && O.hasOwnProperty(n) && O[n].scopes)
      for (const o of O[n].scopes)
        t[o] || (t[o] = []), t[o].push(n);
  const r = {};
  for (const n in t)
    r[n] = await fetch(
      `https://api.telegram.org/bot${e}/setMyCommands`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commands: t[n].map((o) => ({
            command: o,
            description: a.I18N.command.help[o.substring(1)] || ""
          })),
          scope: {
            type: n
          }
        })
      }
    ).then((o) => o.json());
  return { ok: !0, result: r };
}
function ht() {
  return Object.keys(O).map((e) => ({
    command: e,
    description: a.I18N.command.help[e.substring(1)]
  }));
}
const _t = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/, pt = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/, ft = /^\s*["[{]|^\s*-?\d[\d.]{0,14}\s*$/;
function mt(e, t) {
  if (e !== "__proto__" && !(e === "constructor" && t && typeof t == "object" && "prototype" in t))
    return t;
}
function dt(e, t = {}) {
  if (typeof e != "string")
    return e;
  const r = e.toLowerCase().trim();
  if (r === "true")
    return !0;
  if (r === "false")
    return !1;
  if (r === "null")
    return null;
  if (r === "nan")
    return Number.NaN;
  if (r === "infinity")
    return Number.POSITIVE_INFINITY;
  if (r !== "undefined") {
    if (!ft.test(e)) {
      if (t.strict)
        throw new SyntaxError("Invalid JSON");
      return e;
    }
    try {
      return _t.test(e) || pt.test(e) ? JSON.parse(e, mt) : JSON.parse(e);
    } catch (n) {
      if (t.strict)
        throw n;
      return e;
    }
  }
}
const gt = /#/g, Et = /&/g, Tt = /=/g, de = /\+/g, yt = /%5e/gi, At = /%60/gi, Nt = /%7c/gi, St = /%20/gi;
function Ot(e) {
  return encodeURI("" + e).replace(Nt, "|");
}
function z(e) {
  return Ot(typeof e == "string" ? e : JSON.stringify(e)).replace(de, "%2B").replace(St, "+").replace(gt, "%23").replace(Et, "%26").replace(At, "`").replace(yt, "^");
}
function X(e) {
  return z(e).replace(Tt, "%3D");
}
function ge(e = "") {
  try {
    return decodeURIComponent("" + e);
  } catch {
    return "" + e;
  }
}
function It(e) {
  return ge(e.replace(de, " "));
}
function Rt(e = "") {
  const t = {};
  e[0] === "?" && (e = e.slice(1));
  for (const r of e.split("&")) {
    const n = r.match(/([^=]+)=?(.*)/) || [];
    if (n.length < 2)
      continue;
    const o = ge(n[1]);
    if (o === "__proto__" || o === "constructor")
      continue;
    const s = It(n[2] || "");
    typeof t[o] < "u" ? Array.isArray(t[o]) ? t[o].push(s) : t[o] = [t[o], s] : t[o] = s;
  }
  return t;
}
function wt(e, t) {
  return (typeof t == "number" || typeof t == "boolean") && (t = String(t)), t ? Array.isArray(t) ? t.map((r) => `${X(e)}=${z(r)}`).join("&") : `${X(e)}=${z(t)}` : X(e);
}
function bt(e) {
  return Object.keys(e).filter((t) => e[t] !== void 0).map((t) => wt(t, e[t])).join("&");
}
const Ct = /^\w{2,}:([/\\]{1,2})/, $t = /^\w{2,}:([/\\]{2})?/, Pt = /^([/\\]\s*){2,}[^/\\]/;
function Ee(e, t = {}) {
  return typeof t == "boolean" && (t = { acceptRelative: t }), t.strict ? Ct.test(e) : $t.test(e) || (t.acceptRelative ? Pt.test(e) : !1);
}
const Ut = /\/$|\/\?/;
function V(e = "", t = !1) {
  return t ? Ut.test(e) : e.endsWith("/");
}
function Mt(e = "", t = !1) {
  if (!t)
    return (V(e) ? e.slice(0, -1) : e) || "/";
  if (!V(e, !0))
    return e || "/";
  const [r, ...n] = e.split("?");
  return (r.slice(0, -1) || "/") + (n.length > 0 ? `?${n.join("?")}` : "");
}
function Ht(e = "", t = !1) {
  if (!t)
    return e.endsWith("/") ? e : e + "/";
  if (V(e, !0))
    return e || "/";
  const [r, ...n] = e.split("?");
  return r + "/" + (n.length > 0 ? `?${n.join("?")}` : "");
}
function Lt(e = "") {
  return e.startsWith("/");
}
function Dt(e = "") {
  return (Lt(e) ? e.slice(1) : e) || "/";
}
function Gt(e, t) {
  if (vt(t) || Ee(e))
    return e;
  const r = Mt(t);
  return e.startsWith(r) ? e : jt(r, e);
}
function kt(e, t) {
  const r = Te(e), n = { ...Rt(r.search), ...t };
  return r.search = bt(n), Kt(r);
}
function vt(e) {
  return !e || e === "/";
}
function Bt(e) {
  return e && e !== "/";
}
function jt(e, ...t) {
  let r = e || "";
  for (const n of t.filter((o) => Bt(o)))
    r = r ? Ht(r) + Dt(n) : n;
  return r;
}
function Te(e = "", t) {
  if (!Ee(e, { acceptRelative: !0 }))
    return t ? Te(t + e) : se(e);
  const [r = "", n, o = ""] = (e.replace(/\\/g, "/").match(/([^/:]+:)?\/\/([^/@]+@)?(.*)/) || []).splice(1), [s = "", c = ""] = (o.match(/([^#/?]*)(.*)?/) || []).splice(1), { pathname: l, search: u, hash: i } = se(
    c.replace(/\/(?=[A-Za-z]:)/, "")
  );
  return {
    protocol: r,
    auth: n ? n.slice(0, Math.max(0, n.length - 1)) : "",
    host: s,
    pathname: l,
    search: u,
    hash: i
  };
}
function se(e = "") {
  const [t = "", r = "", n = ""] = (e.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname: t,
    search: r,
    hash: n
  };
}
function Kt(e) {
  const t = e.pathname + (e.search ? (e.search.startsWith("?") ? "" : "?") + e.search : "") + e.hash;
  return e.protocol ? e.protocol + "//" + (e.auth ? e.auth + "@" : "") + e.host + t : t;
}
class Xt extends Error {
  constructor() {
    super(...arguments), this.name = "FetchError";
  }
}
function Ft(e, t, r) {
  let n = "";
  t && (n = t.message), e && r ? n = `${n} (${r.status} ${r.statusText} (${e.toString()}))` : e && (n = `${n} (${e.toString()})`);
  const o = new Xt(n);
  return Object.defineProperty(o, "request", {
    get() {
      return e;
    }
  }), Object.defineProperty(o, "response", {
    get() {
      return r;
    }
  }), Object.defineProperty(o, "data", {
    get() {
      return r && r._data;
    }
  }), Object.defineProperty(o, "status", {
    get() {
      return r && r.status;
    }
  }), Object.defineProperty(o, "statusText", {
    get() {
      return r && r.statusText;
    }
  }), Object.defineProperty(o, "statusCode", {
    get() {
      return r && r.status;
    }
  }), Object.defineProperty(o, "statusMessage", {
    get() {
      return r && r.statusText;
    }
  }), o;
}
const Yt = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function ae(e = "GET") {
  return Yt.has(e.toUpperCase());
}
function Jt(e) {
  if (e === void 0)
    return !1;
  const t = typeof e;
  return t === "string" || t === "number" || t === "boolean" || t === null ? !0 : t !== "object" ? !1 : Array.isArray(e) ? !0 : e.constructor && e.constructor.name === "Object" || typeof e.toJSON == "function";
}
const Wt = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]), zt = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function Vt(e = "") {
  if (!e)
    return "json";
  const t = e.split(";").shift() || "";
  return zt.test(t) ? "json" : Wt.has(t) || t.startsWith("text/") ? "text" : "blob";
}
const Zt = /* @__PURE__ */ new Set([
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
function ye(e) {
  const { fetch: t, Headers: r } = e;
  function n(c) {
    const l = c.error && c.error.name === "AbortError" || !1;
    if (c.options.retry !== !1 && !l) {
      let i;
      typeof c.options.retry == "number" ? i = c.options.retry : i = ae(c.options.method) ? 0 : 1;
      const h = c.response && c.response.status || 500;
      if (i > 0 && Zt.has(h))
        return o(c.request, {
          ...c.options,
          retry: i - 1
        });
    }
    const u = Ft(
      c.request,
      c.error,
      c.response
    );
    throw Error.captureStackTrace && Error.captureStackTrace(u, o), u;
  }
  const o = async function(l, u = {}) {
    const i = {
      request: l,
      options: { ...e.defaults, ...u },
      response: void 0,
      error: void 0
    };
    i.options.onRequest && await i.options.onRequest(i), typeof i.request == "string" && (i.options.baseURL && (i.request = Gt(i.request, i.options.baseURL)), (i.options.query || i.options.params) && (i.request = kt(i.request, {
      ...i.options.params,
      ...i.options.query
    })), i.options.body && ae(i.options.method) && Jt(i.options.body) && (i.options.body = typeof i.options.body == "string" ? i.options.body : JSON.stringify(i.options.body), i.options.headers = new r(i.options.headers), i.options.headers.has("content-type") || i.options.headers.set("content-type", "application/json"), i.options.headers.has("accept") || i.options.headers.set("accept", "application/json"))), i.response = await t(
      i.request,
      i.options
    ).catch(async (d) => (i.error = d, i.options.onRequestError && await i.options.onRequestError(i), n(i)));
    const h = (i.options.parseResponse ? "json" : i.options.responseType) || Vt(i.response.headers.get("content-type") || "");
    if (h === "json") {
      const d = await i.response.text(), E = i.options.parseResponse || dt;
      i.response._data = E(d);
    } else
      h === "stream" ? i.response._data = i.response.body : i.response._data = await i.response[h]();
    return i.options.onResponse && await i.options.onResponse(i), i.response.status >= 400 && i.response.status < 600 ? (i.options.onResponseError && await i.options.onResponseError(i), n(i)) : i.response;
  }, s = function(l, u) {
    return o(l, u).then((i) => i._data);
  };
  return s.raw = o, s.native = t, s.create = (c = {}) => ye({
    ...e,
    defaults: {
      ...e.defaults,
      ...c
    }
  }), s;
}
const Ae = function() {
  if (typeof globalThis < "u")
    return globalThis;
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("unable to locate global object");
}(), qt = Ae.fetch || (() => Promise.reject(new Error("[ofetch] global.fetch is not supported!"))), Qt = Ae.Headers, xt = ye({ fetch: qt, Headers: Qt }), I = xt, er = "github.com", tr = "twitter.com", L = "https://api.notion.com/v1", ie = "https://api.openai.com", rr = `Please summarize content and then classify it to 1-5 types of classification. Classification names should be short and no explanation or description is needed.
You only speak JSON. Do not write text that isn't JSON. The JSON keys must be English word of "summary" and "categories".
Classification names used with array data.
The JSON format must be:
{
  "summary": "This is the summary content."
  "categories": ["XXX","YYY","ZZZ"]
}
`, nr = `Please answer in {language}. The Content is {webprompts}:
=====
{content}
=====
Please answer in {language}.`, or = {
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
var sr = Object.defineProperty, ar = (e, t, r) => t in e ? sr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, ce = (e, t, r) => (ar(e, typeof t != "symbol" ? t + "" : t, r), r);
let ir = class {
  constructor(t, r) {
    ce(this, "config"), ce(this, "data"), this.config = t, this.data = r;
  }
};
class cr extends ir {
  constructor(t, r) {
    super(t, r);
  }
  async create(t) {
    if (!t && !this.data)
      throw new Error("DataStorage error: No Storage Data");
    const r = t || this.data, n = {
      title: r.title,
      summary: r.summary,
      url: r.url,
      categories: r.categories,
      status: "Starred",
      meta: r.meta
    };
    return await lr(this.config, n);
  }
  async updateOgImage(t, r) {
    return await ur(this.config, t.storageId, r);
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
}
async function lr(e, t) {
  const r = e.apiKey;
  let n = [{
    name: "Others"
  }];
  n = t.categories.map((i) => (i = i.trim(), i.endsWith(".") && (i = i.slice(0, -1)), {
    name: i
  }));
  const o = {
    parent: {
      database_id: e.databaseId
    },
    properties: {
      Title: {
        title: [
          {
            text: {
              content: t.title
            }
          }
        ]
      },
      Summary: {
        rich_text: [
          {
            text: {
              content: t.summary
            }
          }
        ]
      },
      URL: {
        url: t.url
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
  let s = e.defaultOgImage;
  if (t.meta && Object.keys(t.meta).length > 0) {
    const i = t.meta;
    if (i.ogImage && (s = i.ogImage), o.properties = {
      ...o.properties,
      OgImage: {
        url: s
      }
    }, o.properties = {
      ...o.properties,
      Website: {
        select: {
          name: i.siteName
        }
      }
    }, t.meta.domain === er) {
      const h = i;
      if (h.languages) {
        const d = h.languages.map((E) => ({
          name: E
        }));
        o.properties = {
          ...o.properties,
          Languages: {
            multi_select: d
          }
        };
      }
      if (h.tags) {
        const d = h.tags.map((E) => ({
          name: E
        }));
        o.properties = {
          ...o.properties,
          Tags: {
            multi_select: d
          }
        };
      }
    } else if (t.meta.domain === tr) {
      const h = i;
      if (h.tags) {
        const d = h.tags.map((E) => ({
          name: E
        }));
        o.properties = {
          ...o.properties,
          Tags: {
            multi_select: d
          }
        };
      }
    }
  }
  const c = await I(`${L}/databases/${e.databaseId}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      Authorization: `Bearer ${r}`
    },
    body: {
      filter: {
        property: "URL",
        rich_text: {
          contains: t.url
        }
      }
    }
  });
  let l = "", u = !1;
  if (c.results.length > 0 && (c.results[0].properties.Status.select.name === "Starred" && (u = !0), l = c.results[0].id), l)
    return o.properties = {
      ...o.properties,
      Status: {
        select: {
          name: u ? "Unstarred" : "Starred"
        }
      }
    }, await I(`${L}/pages/${l}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${r}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: o
    }), { starred: !u, storageId: l };
  if (s) {
    const i = {
      object: "block",
      image: {
        external: {
          url: s
        }
      }
    };
    o.children = [i];
  }
  return l = (await I(`${L}/pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      Authorization: `Bearer ${r}`
    },
    body: o
  })).id, { starred: !u, storageId: l };
}
async function ur(e, t, r) {
  const n = await I(`${L}/blocks/${t}/children`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      Authorization: `Bearer ${e.apiKey}`
    }
  });
  let o = "";
  if (n.results.length > 0) {
    const s = n.results, c = s.length;
    for (let l = 0; l < c; l++)
      if (s[l].type === "image" && s[l].image.type === "external" && s[l].image.external.url.includes("stargramogimage")) {
        o = s[l].id;
        break;
      }
  }
  return await I(`${L}/pages/${t}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${e.apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: {
      properties: {
        OgImage: {
          url: r
        }
      }
    }
  }), o && await I(`${L}/blocks/${o}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${e.apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: {
      image: {
        external: {
          url: r
        }
      }
    }
  }), {
    url: r
  };
}
var hr = Object.defineProperty, _r = (e, t, r) => t in e ? hr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, v = (e, t, r) => (_r(e, typeof t != "symbol" ? t + "" : t, r), r);
let pr = class {
  constructor(t) {
    v(this, "apiUrl", "/api/webcard"), v(this, "headers"), v(this, "webData"), v(this, "localFn"), this.apiUrl = (t.stargramHub || "") + this.apiUrl, this.webData = t.webData, this.headers = t.headers, this.localFn = void 0;
  }
  async call(t) {
    if (!t.webData && !this.webData)
      throw new Error("WebCard error: No WebInfo Data");
    const r = t.webData || this.webData, n = t.dataStorage.getType(), o = t.dataStorage.getConfig();
    return await I(this.apiUrl, {
      method: "POST",
      headers: this.headers,
      body: {
        webData: r,
        dataType: n,
        dataCfg: o,
        savedData: t.savedData,
        byApi: !0
      }
    });
  }
};
var fr = Object.defineProperty, mr = (e, t, r) => t in e ? fr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, B = (e, t, r) => (mr(e, typeof t != "symbol" ? t + "" : t, r), r);
let dr = class {
  constructor(t) {
    B(this, "webUrl", ""), B(this, "apiUrl", "/api/webinfo"), B(this, "stargramHub", ""), B(this, "headers"), this.webUrl = t.urls.webUrl, this.headers = t.headers, this.stargramHub = t.stargramHub || "";
  }
  async call() {
    if (!this.stargramHub)
      throw new Error("Stargram error: No StargramHub API.");
    return await I(
      this.stargramHub + this.apiUrl,
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
    return this.stargramHub;
  }
};
var gr = Object.defineProperty, Er = (e, t, r) => t in e ? gr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, j = (e, t, r) => (Er(e, typeof t != "symbol" ? t + "" : t, r), r), Ne = /* @__PURE__ */ ((e) => (e.ChatGPT = "chatgpt", e.GPT3 = "gpt3", e))(Ne || {});
function Tr(e = "", t) {
  const r = e ? e.replace(/&#39;/g, "'").replace(/(\r\n)+/g, `\r
`).replace(/(\s{2,})/g, " ").replace(/^(\s)+|(\s)$/g, "") : "";
  return Nr(r, t);
}
const le = 14e3, yr = 800, Ar = 1300;
function Nr(e, t) {
  let r = e;
  const n = Or(e).length;
  if (n > le) {
    const o = le / n;
    r = e.substring(0, Math.floor(e.length * o));
  }
  return Sr(r, t);
}
function Sr(e, t) {
  const r = t === "gpt3" ? Ar : yr;
  let n = W(e);
  if (n > r) {
    let o = e;
    for (; n > r; ) {
      const s = n - r;
      o = o.substring(0, o.length - (s / 2 < 10 ? 10 : s / 2)), n = W(o);
    }
    return o;
  }
  return e;
}
function Or(e) {
  return decodeURIComponent(encodeURIComponent(escape(e))).replace(/%([0-9A-F]{2})/gi, (t, r) => {
    const n = Number.parseInt(r, 16);
    return String.fromCharCode(n);
  });
}
class Ir {
  constructor(t) {
    j(this, "apiKey"), j(this, "webData"), j(this, "lang"), j(this, "apiHost"), this.apiKey = t.apiKey, this.webData = t.webData, this.lang = t.lang, this.apiHost = t.apiHost;
  }
  async call(t) {
    if (!t && !this.webData)
      throw new Error("OpenaiSummarizeContent error: No WebInfo Data");
    const r = t || this.webData;
    return await Rr(this.apiKey, r, this.lang, this.apiHost);
  }
}
async function Rr(e, t, r = "zh-CN", n = ie) {
  let o = "", s = [], c = t.content;
  c = $e(c);
  const l = W(c), u = n === ie ? `${n}/v1` : n;
  if (l > 40) {
    c = Tr(c, Ne.GPT3);
    const h = {
      content: c,
      language: or[r],
      webprompts: t.meta.prompts || ""
    }, d = Pe(nr, h), E = (await I(`${u}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${e}`,
        "Content-Type": "application/json"
      },
      body: {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: rr
          },
          {
            role: "user",
            content: d
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      }
    })).choices[0].message.content, N = JSON.parse(E);
    o = N.summary, s = N.categories;
  } else
    o = c;
  const i = s && s.length ? s : ["Others"];
  return { summary: o, categories: i };
}
var wr = Object.defineProperty, br = (e, t, r) => t in e ? wr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, K = (e, t, r) => (br(e, typeof t != "symbol" ? t + "" : t, r), r);
class Cr {
  constructor(t) {
    K(this, "webInfo"), K(this, "webCard"), K(this, "summarizeContent"), K(this, "dataStorage"), this.webInfo = t.webInfo, this.webCard = t.webCard, this.summarizeContent = t.summarizeContent, this.dataStorage = t.dataStorage;
  }
  async call() {
    const t = await this.webInfo.call();
    let r = {
      summary: t.content,
      categories: ["Others"]
    };
    this.summarizeContent && (r = await this.summarizeContent.call(t));
    const n = await this.dataStorage.create({ ...t, ...r });
    return this.webCard && (this.webCard.localFn ? await this.webCard.call({ dataStorage: this.dataStorage, webData: t, savedData: n }) : this.webCard.call({ dataStorage: this.dataStorage, webData: t, savedData: n }).then((o) => console.log(o)).catch((o) => console.error(q(o)))), n;
  }
}
async function $r(e) {
  const t = /(http(s)?:\/\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?[-a-zA-Z0-9()@:%_\\\+\.~#?&//=]*/g, r = e.match(t);
  if (r) {
    let n = 0, o = 0, s = 0, c = "";
    for (; n < r.length; ) {
      const l = a.NOTION_API_KEY, u = a.NOTION_DATABASE_ID, i = a.API_KEY, h = a.STARGRAM_HUB_API, d = r[n], E = new dr({
        urls: {
          webUrl: d
        },
        stargramHub: h
      }), N = new pr({ stargramHub: h }), w = new Ir({ apiKey: i }), b = new cr(
        {
          apiKey: l,
          databaseId: u,
          defaultOgImage: "https://kiafhufrshqyrvlpsdqg.supabase.co/storage/v1/object/public/pics-bed/stargram.png?v=stargramogimage"
        }
      ), k = await new Cr({
        webInfo: E,
        webCard: N,
        summarizeContent: w,
        dataStorage: b
      }).call().then((M) => !0).catch((M) => (c += `${q(M)}
`, !1));
      n++, k ? o++ : s++;
    }
    return `Success: ${o}${s ? ` Fail: ${s}
${c}` : ""}`;
  } else
    throw new Error("No Website Matched");
}
async function Pr(e, t) {
  try {
    await t.initContext(e);
  } catch (r) {
    return new Response(U(r), { status: 200 });
  }
  return null;
}
async function Ur(e, t) {
  if (a.DEBUG_MODE) {
    const r = `last_message:${t.SHARE_CONTEXT.chatHistoryKey}`;
    await g.put(r, JSON.stringify(e), { expirationTtl: 3600 });
  }
  return null;
}
async function Mr(e, t) {
  return a.API_KEY ? g ? null : _(t)("DATABASE Not Set") : _(t)("OpenAI API Key Not Set");
}
async function F(e, t) {
  return a.I_AM_A_GENEROUS_PERSON ? null : t.SHARE_CONTEXT.chatType === "private" ? a.CHAT_WHITE_LIST.includes(`${t.CURRENT_CHAT_CONTEXT.chat_id}`) ? null : _(t)(
    a.I18N.message.user_has_no_permission_to_use_the_bot(t.CURRENT_CHAT_CONTEXT.chat_id)
  ) : R.GROUP_TYPES.includes(t.SHARE_CONTEXT.chatType) ? a.GROUP_CHAT_BOT_ENABLE ? a.CHAT_GROUP_WHITE_LIST.includes(`${t.CURRENT_CHAT_CONTEXT.chat_id}`) ? null : _(t)(
    a.I18N.message.group_has_no_permission_to_use_the_bot(t.CURRENT_CHAT_CONTEXT.chat_id)
  ) : new Response("Not support", { status: 401 }) : _(t)(
    a.I18N.message.not_supported_chat_type(t.SHARE_CONTEXT.chatType)
  );
}
async function Hr(e, t) {
  return e.text ? null : _(t)(a.I18N.message.not_supported_chat_type_message);
}
async function ue(e, t) {
  if (!e.text)
    return new Response("Non text message", { status: 200 });
  const r = t.SHARE_CONTEXT.currentBotName;
  if (r) {
    let n = !1;
    if (e.reply_to_message && e.reply_to_message.from.username === r && (n = !0), e.entities) {
      let o = "", s = 0;
      e.entities.forEach((c) => {
        switch (c.type) {
          case "bot_command":
            if (!n) {
              const l = e.text.substring(
                c.offset,
                c.offset + c.length
              );
              l.endsWith(r) && (n = !0);
              const u = l.replaceAll(`@${r}`, "").replaceAll(r, "").trim();
              o += u, s = c.offset + c.length;
            }
            break;
          case "mention":
          case "text_mention":
            if (!n) {
              const l = e.text.substring(
                c.offset,
                c.offset + c.length
              );
              (l === r || l === `@${r}`) && (n = !0);
            }
            o += e.text.substring(s, c.offset), s = c.offset + c.length;
            break;
        }
      }), o += e.text.substring(s, e.text.length), e.text = o.trim();
    }
    return n ? null : new Response("No mentioned", { status: 200 });
  }
  return new Response("Not set bot name", { status: 200 });
}
async function Y(e, t) {
  return await lt(e, t);
}
async function J(e, t) {
  if (!e.text.startsWith("~"))
    return null;
  e.text = e.text.slice(1);
  const r = e.text.indexOf(" ");
  if (r === -1)
    return null;
  const n = e.text.slice(0, r), o = e.text.slice(r + 1).trim();
  if (t.USER_DEFINE.ROLE.hasOwnProperty(n)) {
    t.SHARE_CONTEXT.role = n, e.text = o;
    const s = t.USER_DEFINE.ROLE[n];
    for (const c in s)
      t.USER_CONFIG.hasOwnProperty(c) && typeof t.USER_CONFIG[c] == typeof s[c] && (t.USER_CONFIG[c] = s[c]);
  }
}
async function Lr(e, t) {
  try {
    setTimeout(() => Q(t)("typing").catch(console.error), 0);
    const r = await $r(e.text);
    return _(t)(`Saved to Stargram 🎉.
${r}`);
  } catch (r) {
    const n = q(r);
    return _(t)(`Error: ${n}`);
  }
}
async function Dr(e, t) {
  const r = {
    private: [
      F,
      Hr,
      Y,
      J
    ],
    group: [
      ue,
      F,
      Y,
      J
    ],
    supergroup: [
      ue,
      F,
      Y,
      J
    ]
  };
  if (!r.hasOwnProperty(t.SHARE_CONTEXT.chatType))
    return _(t)(
      a.I18N.message.not_supported_chat_type(t.SHARE_CONTEXT.chatType)
    );
  const n = r[t.SHARE_CONTEXT.chatType];
  for (const o of n)
    try {
      const s = await o(e, t);
      if (s && s instanceof Response)
        return s;
    } catch (s) {
      return console.error(s), _(t)(
        a.I18N.message.handle_chat_type_message_error(t.SHARE_CONTEXT.chatType)
      );
    }
  return null;
}
async function Gr(e, t) {
  const r = await e.json();
  if (a.DEV_MODE && setTimeout(() => {
    g.put(`log:${(/* @__PURE__ */ new Date()).toISOString()}`, JSON.stringify(r), { expirationTtl: 600 }).catch(console.error);
  }), r.edited_message)
    throw new Error("Ignore edited message");
  if (r.message)
    return r.message;
  throw new Error("Invalid message");
}
async function kr(e) {
  const t = new Le();
  t.initTelegramContext(e);
  const r = await Gr(e), n = [
    Pr,
    // 初始化聊天上下文: 生成chat_id, reply_to_message_id(群组消息), SHARE_CONTEXT
    Ur,
    // 保存最后一条消息
    Mr,
    // 检查环境是否准备好: API_KEY, DATABASE
    Dr,
    // 根据类型对消息进一步处理
    Lr
    // 与OpenAI聊天
  ];
  for (const o of n)
    try {
      const s = await o(r, t);
      if (s && s instanceof Response)
        return s;
    } catch (s) {
      return console.error(s), new Response(U(s), { status: 500 });
    }
  return null;
}
const he = "https://github.com/TBXark/ChatGPT-Telegram-Workers/blob/master/doc/DEPLOY.md", _e = "https://github.com/TBXark/ChatGPT-Telegram-Workers/issues", vr = "./init", x = `
<br/>
<p>For more information, please visit <a href="${he}">${he}</a></p>
<p>If you have any questions, please visit <a href="${_e}">${_e}</a></p>
`;
function Se(e) {
  return `<p style="color: red">Please set the <strong>${e}</strong> environment variable in Cloudflare Workers.</p> `;
}
async function Br(e) {
  const t = [], r = new URL(e.url).host, n = Z ? "safehook" : "webhook";
  for (const s of a.TELEGRAM_AVAILABLE_TOKENS) {
    const c = `https://${r}/telegram/${s.trim()}/${n}`, l = s.split(":")[0];
    t[l] = {
      webhook: await Be(s, c).catch((u) => U(u)),
      command: await ut(s).catch((u) => U(u))
    };
  }
  const o = G(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <h2>${r}</h2>
    ${a.TELEGRAM_AVAILABLE_TOKENS.length === 0 ? Se("TELEGRAM_AVAILABLE_TOKENS") : ""}
    ${Object.keys(t).map((s) => `
        <br/>
        <h4>Bot ID: ${s}</h4>
        <p style="color: ${t[s].webhook.ok ? "green" : "red"}">Webhook: ${JSON.stringify(t[s].webhook)}</p>
        <p style="color: ${t[s].command.ok ? "green" : "red"}">Command: ${JSON.stringify(t[s].command)}</p>
        `).join("")}
      ${x}
    `);
  return new Response(o, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function jr(e) {
  const t = await Je(), { pathname: r } = new URL(e.url), n = r.match(/^\/telegram\/(.+)\/history/)[1];
  if (new URL(e.url).searchParams.get("password") !== t)
    return new Response("Password Error", { status: 401 });
  const c = JSON.parse(await g.get(n)), l = G(`
        <div id="history" style="width: 100%; height: 100%; overflow: auto; padding: 10px;">
            ${c.map((u) => `
                <div style="margin-bottom: 10px;">
                    <hp style="font-size: 16px; color: #999; margin-bottom: 5px;">${u.role}:</hp>
                    <p style="font-size: 12px; color: #333;">${u.content}</p>
                </div>
            `).join("")}
        </div>
  `);
  return new Response(l, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Kr(e) {
  try {
    return me(await kr(e));
  } catch (t) {
    return console.error(t), new Response(U(t), { status: 200 });
  }
}
async function Xr(e) {
  try {
    const t = new URL(e.url);
    return t.pathname = t.pathname.replace("/safehook", "/webhook"), e = new Request(t, e), me(Z.fetch(e));
  } catch (t) {
    return console.error(t), new Response(U(t), { status: 200 });
  }
}
async function Fr() {
  const e = G(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Deployed Successfully!</p>
    <p> Version (ts:${a.BUILD_TIMESTAMP},sha:${a.BUILD_VERSION})</p>
    <br/>
    <p>You must <strong><a href="${vr}"> >>>>> click here <<<<< </a></strong> to bind the webhook.</p>
    <br/>
    ${a.API_KEY ? "" : Se("API_KEY")}
    <p>After binding the webhook, you can use the following commands to control the bot:</p>
    ${ht().map((t) => `<p><strong>${t.command}</strong> - ${t.description}</p>`).join("")}
    <br/>
    <p>You can get bot information by visiting the following URL:</p>
    <p><strong>/telegram/:token/bot</strong> - Get bot information</p>
    ${x}
  `);
  return new Response(e, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Yr(e) {
  const t = new URL(e.url).searchParams.get("text") || "Hello World", r = await pe(), n = G(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Token Counter:</p>
    <p>source text: ${t}</p>
    <p>token count: ${r(t)}</p>
    <br/>
    `);
  return new Response(n, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Jr() {
  const e = [];
  for (const r of a.TELEGRAM_AVAILABLE_TOKENS) {
    const n = r.split(":")[0];
    e[n] = await Fe(r);
  }
  const t = G(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <h4>Environment About Bot</h4>
    <p><strong>GROUP_CHAT_BOT_ENABLE:</strong> ${a.GROUP_CHAT_BOT_ENABLE}</p>
    <p><strong>GROUP_CHAT_BOT_SHARE_MODE:</strong> ${a.GROUP_CHAT_BOT_SHARE_MODE}</p>
    <p><strong>TELEGRAM_BOT_NAME:</strong> ${a.TELEGRAM_BOT_NAME.join(",")}</p>
    ${Object.keys(e).map((r) => `
            <br/>
            <h4>Bot ID: ${r}</h4>
            <p style="color: ${e[r].ok ? "green" : "red"}">${JSON.stringify(e[r])}</p>
            `).join("")}
    ${x}
  `);
  return new Response(t, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Wr(e) {
  const { pathname: t } = new URL(e.url);
  if (t === "/")
    return Fr();
  if (t.startsWith("/init"))
    return Br(e);
  if (t.startsWith("/telegram") && t.endsWith("/webhook"))
    return Kr(e);
  if (t.startsWith("/telegram") && t.endsWith("/safehook"))
    return Xr(e);
  if (a.DEV_MODE || a.DEBUG_MODE) {
    if (t.startsWith("/telegram") && t.endsWith("/history"))
      return jr(e);
    if (t.startsWith("/gpt3/tokens/test"))
      return Yr(e);
    if (t.startsWith("/telegram") && t.endsWith("/bot"))
      return Jr();
  }
  return null;
}
const zr = {
  env: {
    system_init_message: "你是一个得力的助手"
  },
  utils: {
    not_supported_configuration: "不支持的配置项或数据类型错误"
  },
  message: {
    not_supported_chat_type: (e) => `暂不支持${e}类型的聊天`,
    not_supported_chat_type_message: "暂不支持非文本格式消息",
    handle_chat_type_message_error: (e) => `处理${e}类型的聊天消息出错`,
    user_has_no_permission_to_use_the_bot: (e) => `你没有权限使用这个bot, 请请联系管理员添加你的ID(${e})到白名单`,
    group_has_no_permission_to_use_the_bot: (e) => `该群未开启聊天权限, 请请联系管理员添加群ID(${e})到白名单`
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
      current_defined_role: (e) => `当前已定义的角色如下(${e}):
`,
      help: "格式错误: 命令完整格式为 `/role 操作`\n当前支持以下`操作`:\n `/role show` 显示当前定义的角色.\n `/role 角色名 del` 删除指定名称的角色.\n `/role 角色名 KEY=VALUE` 设置指定角色的配置.\n  目前以下设置项:\n   `SYSTEM_INIT_MESSAGE`:初始化消息\n   `OPENAI_API_EXTRA_PARAMS`:OpenAI API 额外参数，必须为JSON",
      delete_role_success: "删除角色成功",
      delete_role_error: (e) => `删除角色错误: \`${e.message}\``,
      update_role_success: "更新配置成功",
      update_role_error: (e) => `配置项格式错误: \`${e.message}\``
    },
    img: {
      help: "请输入图片描述。命令完整格式为 `/img 狸花猫`"
    },
    new: {
      new_chat_start: "新的对话已经开始",
      new_chat_start_private: (e) => `新的对话已经开始，你的ID(${e})`,
      new_chat_start_group: (e) => `新的对话已经开始，群组ID(${e})`
    },
    setenv: {
      help: "配置项格式错误: 命令完整格式为 /setenv KEY=VALUE",
      update_config_success: "更新配置成功",
      update_config_error: (e) => `配置项格式错误: ${e.message}`
    },
    version: {
      new_version_found: (e, t) => `发现新版本，当前版本: ${JSON.stringify(e)}，最新版本: ${JSON.stringify(t)}`,
      current_is_latest_version: (e) => `当前已经是最新版本, 当前版本: ${JSON.stringify(e)}`
    },
    usage: {
      usage_not_open: "当前机器人未开启用量统计",
      current_usage: `📊 当前机器人用量

Tokens:
`,
      total_usage: (e) => `- 总用量：${e || 0} tokens
- 各聊天用量：`,
      no_usage: "- 暂无用量"
    },
    permission: {
      not_authorized: "身份权限验证失败",
      not_enough_permission: (e, t) => `权限不足,需要${e.join(",")},当前:${t}`,
      role_error: (e) => `身份验证出错:${e.message}`,
      command_error: (e) => `命令执行错误: ${e.message}`
    }
  }
}, Vr = {
  env: {
    system_init_message: "你是一個得力的助手"
  },
  utils: {
    not_supported_configuration: "不支持的配置或數據類型錯誤"
  },
  message: {
    not_supported_chat_type: (e) => `當前不支持${e}類型的聊天`,
    not_supported_chat_type_message: "當前不支持非文本格式消息",
    handle_chat_type_message_error: (e) => `處理${e}類型的聊天消息出錯`,
    user_has_no_permission_to_use_the_bot: (e) => `您沒有權限使用本機器人，請聯繫管理員將您的ID(${e})添加到白名單中`,
    group_has_no_permission_to_use_the_bot: (e) => `該群組未開啟聊天權限，請聯繫管理員將該群組ID(${e})添加到白名單中`
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
      current_defined_role: (e) => `當前已定義的角色如下(${e})：
`,
      help: "格式錯誤：完整命令格式為`/role 操作`\n當前支持的`操作`如下：\n `/role show` 查看當前已定義的角色。\n `/role 角色名 del` 刪除指定的角色。\n `/role 角色名 KEY=VALUE` 設置指定角色的配置。\n  當前支持的設置如下：\n   `SYSTEM_INIT_MESSAGE`：初始化消息\n   `OPENAI_API_EXTRA_PARAMS`：OpenAI API額外參數，必須為JSON",
      delete_role_success: "刪除角色成功",
      delete_role_error: (e) => `刪除角色出錯：\`${e.message}\``,
      update_role_success: "更新配置成功",
      update_role_error: (e) => `配置項格式錯誤：\`${e.message}\``
    },
    img: {
      help: "請輸入圖片描述。完整命令格式為`/img raccoon cat`"
    },
    new: {
      new_chat_start: "開始一個新對話",
      new_chat_start_private: (e) => `開始一個新對話，您的ID(${e})`,
      new_chat_start_group: (e) => `開始一個新對話，群組ID(${e})`
    },
    setenv: {
      help: "配置項格式錯誤：完整命令格式為/setenv KEY=VALUE",
      update_config_success: "更新配置成功",
      update_config_error: (e) => `配置項格式錯誤：\`${e.message}\``
    },
    version: {
      new_version_found: (e, t) => `發現新版本，當前版本：${JSON.stringify(e)}，最新版本：${JSON.stringify(t)}`,
      current_is_latest_version: (e) => `當前已是最新版本，當前版本：${JSON.stringify(e)}`
    },
    usage: {
      usage_not_open: "當前機器人未開啟使用情況統計",
      current_usage: `📊 當前機器人使用情況

使用情況：
`,
      total_usage: (e) => `- 總計：${e || 0} 次
- 每個群組使用情況： `,
      no_usage: "- 暫無使用情況"
    },
    permission: {
      not_authorized: "身份權限驗證失敗",
      not_enough_permission: (e, t) => `權限不足，需要${e.join(",")}，當前：${t}`,
      role_error: (e) => `身份驗證出錯：${e.message}`,
      command_error: (e) => `命令執行出錯：${e.message}`
    }
  }
}, Zr = {
  env: {
    system_init_message: "You are a helpful assistant"
  },
  utils: {
    not_supported_configuration: "Not supported configuration or data type error"
  },
  message: {
    not_supported_chat_type: (e) => `Currently not supported ${e} type of chat`,
    not_supported_chat_type_message: "Currently not supported non-text format messages",
    handle_chat_type_message_error: (e) => `Error handling ${e} type of chat messages`,
    user_has_no_permission_to_use_the_bot: (e) => `You do not have permission to use this bot, please contact the administrator to add your ID (${e}) to the whitelist`,
    group_has_no_permission_to_use_the_bot: (e) => `The group has not enabled chat permissions, please contact the administrator to add the group ID (${e}) to the whitelist`
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
      current_defined_role: (e) => `The following roles are currently defined (${e}):
`,
      help: "Format error: the complete command format is `/role operation`\nThe following `operation` is currently supported:\n `/role show` Display the currently defined roles.\n `/role role name del` Delete the specified role.\n `/role role name KEY=VALUE` Set the configuration of the specified role.\n  The following settings are currently supported:\n   `SYSTEM_INIT_MESSAGE`: Initialization message\n   `OPENAI_API_EXTRA_PARAMS`: OpenAI API extra parameters, must be JSON",
      delete_role_success: "Delete role successfully",
      delete_role_error: (e) => `Delete role error: \`${e.message}\``,
      update_role_success: "Update configuration successfully",
      update_role_error: (e) => `Configuration item format error: \`${e.message}\``
    },
    img: {
      help: "Please enter the image description. The complete command format is `/img raccoon cat`"
    },
    new: {
      new_chat_start: "A new conversation has started",
      new_chat_start_private: (e) => `A new conversation has started, your ID (${e})`,
      new_chat_start_group: (e) => `A new conversation has started, group ID (${e})`
    },
    setenv: {
      help: "Configuration item format error: the complete command format is /setenv KEY=VALUE",
      update_config_success: "Update configuration successfully",
      update_config_error: (e) => `Configuration item format error: ${e.message}`
    },
    version: {
      new_version_found: (e, t) => `New version found, current version: ${JSON.stringify(e)}, latest version: ${JSON.stringify(t)}`,
      current_is_latest_version: (e) => `Current is the latest version, current version: ${JSON.stringify(e)}`
    },
    usage: {
      usage_not_open: "The current robot is not open for usage statistics",
      current_usage: `📊 Current robot usage

Tokens:
`,
      total_usage: (e) => `- Total: ${e || 0} tokens
- Per chat usage: `,
      no_usage: "- No usage"
    },
    permission: {
      not_authorized: "Identity permission verification failed",
      not_enough_permission: (e, t) => `Insufficient permissions, need ${e.join(",")}, current: ${t}`,
      role_error: (e) => `Identity verification error: ${e.message}`,
      command_error: (e) => `Command execution error: ${e.message}`
    }
  }
};
function qr(e) {
  switch (e.toLowerCase()) {
    case "cn":
    case "zh-cn":
    case "zh-hans":
      return zr;
    case "zh-tw":
    case "zh-hk":
    case "zh-mo":
    case "zh-hant":
      return Vr;
    case "en":
    case "en-us":
      return Zr;
  }
}
const rn = {
  async fetch(e, t) {
    try {
      return be(t, qr), await Wr(e) || new Response("NOTFOUND", { status: 404 });
    } catch (r) {
      return console.error(r), new Response(U(r), { status: 500 });
    }
  }
};
export {
  rn as default
};
