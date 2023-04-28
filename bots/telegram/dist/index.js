var ce = Object.defineProperty;
var le = (e, t, n) => t in e ? ce(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var P = (e, t, n) => (le(e, typeof t != "symbol" ? t + "" : t, n), n);
const a = {
  // OpenAI API Key
  API_KEY: null,
  // OpenAI的模型名称
  CHAT_MODEL: "gpt-3.5-turbo",
  // Notion info
  NOTION_API_KEY: null,
  NOTION_DATABASE_ID: null,
  PICTURE_BED_URL: null,
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
  BUILD_TIMESTAMP: "1682653263",
  // 当前版本 commit id
  BUILD_VERSION: "775bd80",
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
let f = null, j = null;
const _e = {
  API_KEY: "string",
  NOTION_API_KEY: "string",
  NOTION_DATABASE_ID: "string",
  PICTURE_BED_URL: "string"
};
function ue(e, t) {
  f = e.DATABASE, j = e.API_GUARD;
  for (const n in a)
    if (e[n])
      switch (_e[n] || typeof a[n]) {
        case "number":
          a[n] = parseInt(e[n]) || a[n];
          break;
        case "boolean":
          a[n] = (e[n] || "false") === "true";
          break;
        case "string":
          a[n] = e[n];
          break;
        case "object":
          if (Array.isArray(a[n]))
            a[n] = e[n].split(",");
          else
            try {
              a[n] = JSON.parse(e[n]);
            } catch (r) {
              console.error(r);
            }
          break;
        default:
          a[n] = e[n];
          break;
      }
  e.TELEGRAM_TOKEN && !a.TELEGRAM_AVAILABLE_TOKENS.includes(e.TELEGRAM_TOKEN) && (e.BOT_NAME && a.TELEGRAM_AVAILABLE_TOKENS.length === a.TELEGRAM_BOT_NAME.length && a.TELEGRAM_BOT_NAME.push(e.BOT_NAME), a.TELEGRAM_AVAILABLE_TOKENS.push(e.TELEGRAM_TOKEN)), a.I18N = t((a.LANGUAGE || "cn").toLowerCase()), a.SYSTEM_INIT_MESSAGE = a.I18N.env.system_init_message;
}
class he {
  constructor() {
    // 用户配置
    P(this, "USER_CONFIG", {
      // 系统初始化消息
      SYSTEM_INIT_MESSAGE: a.SYSTEM_INIT_MESSAGE,
      // OpenAI API 额外参数
      OPENAI_API_EXTRA_PARAMS: {},
      // OenAI API Key
      OPENAI_API_KEY: null
    });
    P(this, "USER_DEFINE", {
      // 自定义角色
      ROLE: {}
    });
    // 当前聊天上下文
    P(this, "CURRENT_CHAT_CONTEXT", {
      chat_id: null,
      reply_to_message_id: null,
      // 如果是群组，这个值为消息ID，否则为null
      parse_mode: "Markdown"
    });
    // 共享上下文
    P(this, "SHARE_CONTEXT", {
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
  _initChatContext(t, n) {
    this.CURRENT_CHAT_CONTEXT.chat_id = t, this.CURRENT_CHAT_CONTEXT.reply_to_message_id = n, n && (this.CURRENT_CHAT_CONTEXT.allow_sending_without_reply = !0);
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
      const n = JSON.parse(await f.get(t));
      for (const r in n)
        r === "USER_DEFINE" && typeof this.USER_DEFINE == typeof n[r] ? this._initUserDefine(n[r]) : this.USER_CONFIG.hasOwnProperty(r) && typeof this.USER_CONFIG[r] == typeof n[r] && (this.USER_CONFIG[r] = n[r]);
    } catch (n) {
      console.error(n);
    }
  }
  /**
   * @inner
   * @param {object} userDefine
   */
  _initUserDefine(t) {
    for (const n in t)
      this.USER_DEFINE.hasOwnProperty(n) && typeof this.USER_DEFINE[n] == typeof t[n] && (this.USER_DEFINE[n] = t[n]);
  }
  /**
   * @param {Request} request
   */
  initTelegramContext(t) {
    const { pathname: n } = new URL(t.url), r = n.match(
      /^\/telegram\/(\d+:[A-Za-z0-9_-]{35})\/webhook/
    )[1], o = a.TELEGRAM_AVAILABLE_TOKENS.indexOf(r);
    if (o === -1)
      throw new Error("Token not allowed");
    this.SHARE_CONTEXT.currentBotToken = r, this.SHARE_CONTEXT.currentBotId = r.split(":")[0], a.TELEGRAM_BOT_NAME.length > o && (this.SHARE_CONTEXT.currentBotName = a.TELEGRAM_BOT_NAME[o]);
  }
  /**
   *
   * @inner
   * @param {TelegramMessage} message
   */
  async _initShareContext(t) {
    var l, c, _;
    this.SHARE_CONTEXT.usageKey = `usage:${this.SHARE_CONTEXT.currentBotId}`;
    const n = (l = t == null ? void 0 : t.chat) == null ? void 0 : l.id;
    if (n == null)
      throw new Error("Chat id not found");
    const r = this.SHARE_CONTEXT.currentBotId;
    let o = `history:${n}`, s = `user_config:${n}`, i = null;
    r && (o += `:${r}`, s += `:${r}`), R.GROUP_TYPES.includes((c = t.chat) == null ? void 0 : c.type) && (!a.GROUP_CHAT_BOT_SHARE_MODE && t.from.id && (o += `:${t.from.id}`, s += `:${t.from.id}`), i = `group_admin:${n}`), this.SHARE_CONTEXT.chatHistoryKey = o, this.SHARE_CONTEXT.configStoreKey = s, this.SHARE_CONTEXT.groupAdminKey = i, this.SHARE_CONTEXT.chatType = (_ = t.chat) == null ? void 0 : _.type, this.SHARE_CONTEXT.chatId = t.chat.id, this.SHARE_CONTEXT.speakerId = t.from.id || t.chat.id;
  }
  /**
   * @param {TelegramMessage} message
   * @return {Promise<void>}
   */
  async initContext(t) {
    var o, s;
    const n = (o = t == null ? void 0 : t.chat) == null ? void 0 : o.id, r = R.GROUP_TYPES.includes((s = t.chat) == null ? void 0 : s.type) ? t.message_id : null;
    this._initChatContext(n, r), await this._initShareContext(t), await this._initUserConfig(this.SHARE_CONTEXT.configStoreKey);
  }
}
async function z(e, t, n) {
  return await fetch(
    `${a.TELEGRAM_API_DOMAIN}/bot${t}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...n,
        text: e
      })
    }
  );
}
async function pe(e, t, n) {
  const r = n;
  if (e.length <= 4096) {
    const s = await z(e, t, r);
    if (s.status === 200)
      return s;
  }
  const o = 4e3;
  r.parse_mode = "HTML";
  for (let s = 0; s < e.length; s += o) {
    const i = e.slice(s, s + o);
    await z(`<pre>
${i}
</pre>`, t, r);
  }
  return new Response("Message batch send", { status: 200 });
}
function u(e) {
  return async (t) => pe(t, e.SHARE_CONTEXT.currentBotToken, e.CURRENT_CHAT_CONTEXT);
}
async function me(e, t, n) {
  return await fetch(
    `${a.TELEGRAM_API_DOMAIN}/bot${t}/sendPhoto`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...n,
        photo: e,
        parse_mode: null
      })
    }
  );
}
function de(e) {
  return (t) => me(t, e.SHARE_CONTEXT.currentBotToken, e.CURRENT_CHAT_CONTEXT);
}
async function Ee(e, t, n) {
  return await fetch(
    `${a.TELEGRAM_API_DOMAIN}/bot${t}/sendChatAction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: n,
        action: e
      })
    }
  ).then((r) => r.json());
}
function F(e) {
  return (t) => Ee(t, e.SHARE_CONTEXT.currentBotToken, e.CURRENT_CHAT_CONTEXT.chat_id);
}
async function fe(e, t) {
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
  ).then((n) => n.json());
}
async function Te(e, t, n, r) {
  let o;
  try {
    o = JSON.parse(await f.get(t));
  } catch (s) {
    return console.error(s), s.message;
  }
  if (!o || !Array.isArray(o) || o.length === 0) {
    const s = await Ae(n, r);
    if (s == null)
      return null;
    o = s, await f.put(
      t,
      JSON.stringify(o),
      { expiration: Date.now() / 1e3 + 120 }
    );
  }
  for (let s = 0; s < o.length; s++) {
    const i = o[s];
    if (i.user.id === e)
      return i.status;
  }
  return "member";
}
function ge(e) {
  return (t) => Te(t, e.SHARE_CONTEXT.groupAdminKey, e.CURRENT_CHAT_CONTEXT.chat_id, e.SHARE_CONTEXT.currentBotToken);
}
async function Ae(e, t) {
  try {
    const n = await fetch(
      `${a.TELEGRAM_API_DOMAIN}/bot${t}/getChatAdministrators`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chat_id: e })
      }
    ).then((r) => r.json());
    if (n.ok)
      return n.result;
  } catch (n) {
    return console.error(n), null;
  }
}
async function ye(e) {
  const t = await fetch(
    `${a.TELEGRAM_API_DOMAIN}/bot${e}/getMe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }
  ).then((n) => n.json());
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
async function Z(e, t) {
  try {
    const n = await f.get(e);
    if (n && n !== "")
      return n;
  } catch (n) {
    console.error(n);
  }
  try {
    const n = await fetch(t, {
      headers: {
        "User-Agent": R.USER_AGENT
      }
    }).then((r) => r.text());
    return await f.put(e, n), n;
  } catch (n) {
    console.error(n);
  }
  return null;
}
async function re() {
  const e = "https://raw.githubusercontent.com/tbxark-archive/GPT-3-Encoder/master", t = await Z("encoder_raw_file", `${e}/encoder.json`).then((p) => JSON.parse(p)), n = await Z("bpe_raw_file", `${e}/vocab.bpe`), r = (p, m) => Array.from(Array(m).keys()).slice(p), o = (p) => p.charCodeAt(0), s = (p) => String.fromCharCode(p), i = new TextEncoder("utf-8"), l = (p) => Array.from(i.encode(p)).map((m) => m.toString()), c = (p, m) => {
    const T = {};
    return p.forEach((A, d) => {
      T[p[d]] = m[d];
    }), T;
  };
  function _() {
    const p = r(o("!"), o("~") + 1).concat(r(o("¡"), o("¬") + 1), r(o("®"), o("ÿ") + 1));
    let m = p.slice(), T = 0;
    for (let d = 0; d < 2 ** 8; d++)
      p.includes(d) || (p.push(d), m.push(2 ** 8 + T), T = T + 1);
    m = m.map((d) => s(d));
    const A = {};
    return p.forEach((d, C) => {
      A[p[C]] = m[C];
    }), A;
  }
  function h(p) {
    const m = /* @__PURE__ */ new Set();
    let T = p[0];
    for (let A = 1; A < p.length; A++) {
      const d = p[A];
      m.add([T, d]), T = d;
    }
    return m;
  }
  const E = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu, g = {};
  Object.keys(t).forEach((p) => {
    g[t[p]] = p;
  });
  const N = n.split(`
`), S = N.slice(1, N.length - 1).map((p) => p.split(/(\s+)/).filter((m) => m.trim().length > 0)), w = _(), B = {};
  Object.keys(w).forEach((p) => {
    B[w[p]] = p;
  });
  const G = c(S, r(0, S.length)), H = /* @__PURE__ */ new Map();
  function ie(p) {
    if (H.has(p))
      return H.get(p);
    let m = p.split(""), T = h(m);
    if (!T)
      return p;
    for (; ; ) {
      const A = {};
      Array.from(T).forEach((b) => {
        const V = G[b];
        A[isNaN(V) ? 1e11 : V] = b;
      });
      const d = A[Math.min(...Object.keys(A).map(
        (b) => parseInt(b)
      ))];
      if (!(d in G))
        break;
      const C = d[0], U = d[1];
      let $ = [], y = 0;
      for (; y < m.length; ) {
        const b = m.indexOf(C, y);
        if (b === -1) {
          $ = $.concat(m.slice(y));
          break;
        }
        $ = $.concat(m.slice(y, b)), y = b, m[y] === C && y < m.length - 1 && m[y + 1] === U ? ($.push(C + U), y = y + 2) : ($.push(m[y]), y = y + 1);
      }
      if (m = $, m.length === 1)
        break;
      T = h(m);
    }
    return m = m.join(" "), H.set(p, m), m;
  }
  return function(m) {
    let T = 0;
    const A = Array.from(m.matchAll(E)).map((d) => d[0]);
    for (let d of A) {
      d = l(d).map((U) => w[U]).join("");
      const C = ie(d).split(" ").map((U) => t[U]);
      T += C.length;
    }
    return T;
  };
}
function Ne(e) {
  const t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let n = "";
  for (let r = e; r > 0; --r)
    n += t[Math.floor(Math.random() * t.length)];
  return n;
}
async function Oe() {
  let e = await f.get(R.PASSWORD_KEY);
  return e === null && (e = Ne(32), await f.put(R.PASSWORD_KEY, e)), e;
}
function k(e) {
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
function M(e) {
  return JSON.stringify({
    message: e.message,
    stack: e.stack
  });
}
function oe(e, t, n) {
  switch (typeof e[t]) {
    case "number":
      e[t] = Number(n);
      break;
    case "boolean":
      e[t] = n === "true";
      break;
    case "string":
      e[t] = n;
      break;
    case "object":
      const r = JSON.parse(n);
      if (typeof r == "object") {
        e[t] = r;
        break;
      }
      throw new Error(a.I18N.utils.not_supported_configuration);
    default:
      throw new Error(a.I18N.utils.not_supported_configuration);
  }
}
async function Se() {
  let e = (t) => Array.from(t).length;
  try {
    a.GPT3_TOKENS_COUNT && (e = await re());
  } catch (t) {
    console.error(t);
  }
  return (t) => {
    try {
      return e(t);
    } catch (n) {
      return console.error(n), Array.from(t).length;
    }
  };
}
function se(e) {
  return e === null ? new Response("NOT HANDLED", { status: 200 }) : e.status === 200 ? e : new Response(e.body, {
    status: 200,
    headers: {
      "Original-Status": e.status,
      ...e.headers
    }
  });
}
async function Ie(e, t, n) {
  var i;
  const r = n.USER_CONFIG.OPENAI_API_KEY || a.API_KEY, o = {
    model: a.CHAT_MODEL,
    ...n.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages: [...t || [], { role: "user", content: e }]
  }, s = await fetch(`${a.OPENAI_API_DOMAIN}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${r}`
    },
    body: JSON.stringify(o)
  }).then((l) => l.json());
  if ((i = s.error) != null && i.message)
    throw a.DEV_MODE || a.DEV_MODE ? new Error(`OpenAI API Error
> ${s.error.message}
Body: ${JSON.stringify(o)}`) : new Error(`OpenAI API Error
> ${s.error.message}`);
  return setTimeout(() => Ce(s.usage, n).catch(console.error), 0), s.choices[0].message.content;
}
async function Re(e, t) {
  var s;
  const n = t.USER_CONFIG.OPENAI_API_KEY || a.API_KEY, r = {
    prompt: e,
    n: 1,
    size: "512x512"
  }, o = await fetch(`${a.OPENAI_API_DOMAIN}/v1/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${n}`
    },
    body: JSON.stringify(r)
  }).then((i) => i.json());
  if ((s = o.error) != null && s.message)
    throw new Error(`OpenAI API Error
> ${o.error.message}`);
  return o.data[0].url;
}
async function we(e, t, n) {
  const r = a.AUTO_TRIM_HISTORY && a.MAX_HISTORY_LENGTH <= 0, o = t.SHARE_CONTEXT.chatHistoryKey;
  let s = await be(o, t);
  if (n) {
    const _ = n(s, e);
    s = _.history, e = _.text;
  }
  const { real: i, original: l } = s, c = await Ie(e, i, t);
  return r || (l.push({ role: "user", content: e || "", cosplay: t.SHARE_CONTEXT.role || "" }), l.push({ role: "assistant", content: c, cosplay: t.SHARE_CONTEXT.role || "" }), await f.put(o, JSON.stringify(l)).catch(console.error)), c;
}
async function Ce(e, t) {
  if (!a.ENABLE_USAGE_STATISTICS)
    return;
  let n = JSON.parse(await f.get(t.SHARE_CONTEXT.usageKey));
  n || (n = {
    tokens: {
      total: 0,
      chats: {}
    }
  }), n.tokens.total += e.total_tokens, n.tokens.chats[t.SHARE_CONTEXT.chatId] ? n.tokens.chats[t.SHARE_CONTEXT.chatId] += e.total_tokens : n.tokens.chats[t.SHARE_CONTEXT.chatId] = e.total_tokens, await f.put(t.SHARE_CONTEXT.usageKey, JSON.stringify(n));
}
async function be(e, t) {
  const n = { role: "system", content: t.USER_CONFIG.SYSTEM_INIT_MESSAGE };
  if (a.AUTO_TRIM_HISTORY && a.MAX_HISTORY_LENGTH <= 0)
    return n.role = a.SYSTEM_INIT_MESSAGE_ROLE, { real: [n], original: [n] };
  let o = [];
  try {
    o = JSON.parse(await f.get(e));
  } catch (c) {
    console.error(c);
  }
  (!o || !Array.isArray(o)) && (o = []);
  let s = JSON.parse(JSON.stringify(o));
  t.SHARE_CONTEXT.role && (o = o.filter((c) => t.SHARE_CONTEXT.role === c.cosplay)), o.forEach((c) => {
    delete c.cosplay;
  });
  const i = await Se(), l = (c, _, h, E) => {
    c.length > h && (c = c.splice(c.length - h));
    let g = _;
    for (let N = c.length - 1; N >= 0; N--) {
      const S = c[N];
      let w = 0;
      if (S.content ? w = i(S.content) : S.content = "", g += w, g > E) {
        c = c.splice(N + 1);
        break;
      }
    }
    return c;
  };
  if (a.AUTO_TRIM_HISTORY && a.MAX_HISTORY_LENGTH > 0) {
    const c = i(n.content), _ = Math.max(Object.keys(t.USER_DEFINE.ROLE).length, 1);
    o = l(o, c, a.MAX_HISTORY_LENGTH, a.MAX_TOKEN_LENGTH), s = l(s, c, a.MAX_HISTORY_LENGTH * _, a.MAX_TOKEN_LENGTH * _);
  }
  switch (o.length > 0 ? o[0].role : "") {
    case "assistant":
    case "system":
      o[0] = n;
      break;
    default:
      o.unshift(n);
  }
  return a.SYSTEM_INIT_MESSAGE_ROLE !== "system" && o.length > 0 && o[0].role === "system" && (o[0].role = a.SYSTEM_INIT_MESSAGE_ROLE), { real: o, original: s };
}
const O = {
  default(e) {
    return R.GROUP_TYPES.includes(e) ? ["administrator", "creator"] : !1;
  },
  shareModeGroup(e) {
    return R.GROUP_TYPES.includes(e) && a.GROUP_CHAT_BOT_SHARE_MODE ? ["administrator", "creator"] : !1;
  }
}, I = {
  "/help": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Ue
  },
  "/new": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: Q,
    needAuth: O.shareModeGroup
  },
  "/start": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Q,
    needAuth: O.default
  },
  "/img": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Me,
    needAuth: O.shareModeGroup
  },
  "/version": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Le,
    needAuth: O.default
  },
  "/setenv": {
    scopes: [],
    fn: He,
    needAuth: O.shareModeGroup
  },
  "/delenv": {
    scopes: [],
    fn: Pe,
    needAuth: O.shareModeGroup
  },
  "/usage": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: ke,
    needAuth: O.default
  },
  "/system": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Ge,
    needAuth: O.default
  },
  "/role": {
    scopes: ["all_private_chats"],
    fn: $e,
    needAuth: O.shareModeGroup
  },
  "/redo": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: De,
    needAuth: O.shareModeGroup
  }
};
async function $e(e, t, n, r) {
  if (n === "show") {
    const h = Object.getOwnPropertyNames(r.USER_DEFINE.ROLE).length;
    if (h === 0)
      return u(r)(a.I18N.command.role.not_defined_any_role);
    let E = a.I18N.command.role.current_defined_role(h);
    for (const g in r.USER_DEFINE.ROLE)
      r.USER_DEFINE.ROLE.hasOwnProperty(g) && (E += `~${g}:
<pre>`, E += `${JSON.stringify(r.USER_DEFINE.ROLE[g])}
`, E += "</pre>");
    return r.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", u(r)(E);
  }
  const o = n.indexOf(" ");
  if (o === -1)
    return u(r)(a.I18N.command.role.help);
  const s = n.slice(0, o), i = n.slice(o + 1).trim(), l = i.indexOf("=");
  if (l === -1) {
    if (i === "del")
      try {
        if (r.USER_DEFINE.ROLE[s])
          return delete r.USER_DEFINE.ROLE[s], await f.put(
            r.SHARE_CONTEXT.configStoreKey,
            JSON.stringify(Object.assign(r.USER_CONFIG, { USER_DEFINE: r.USER_DEFINE }))
          ), u(r)(a.I18N.command.role.delete_role_success);
      } catch (h) {
        return u(r)(a.I18N.command.role.delete_role_error(h));
      }
    return u(r)(a.I18N.command.role.help);
  }
  const c = i.slice(0, l), _ = i.slice(l + 1);
  r.USER_DEFINE.ROLE[s] || (r.USER_DEFINE.ROLE[s] = {
    // 系统初始化消息
    SYSTEM_INIT_MESSAGE: a.SYSTEM_INIT_MESSAGE,
    // OpenAI API 额外参数
    OPENAI_API_EXTRA_PARAMS: {}
  });
  try {
    return oe(r.USER_DEFINE.ROLE[s], c, _), await f.put(
      r.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(Object.assign(r.USER_CONFIG, { USER_DEFINE: r.USER_DEFINE }))
    ), u(r)(a.I18N.command.role.update_role_success);
  } catch (h) {
    return u(r)(a.I18N.command.role.update_role_error(h));
  }
}
async function Me(e, t, n, r) {
  if (n === "")
    return u(r)(a.I18N.command.img.help);
  try {
    setTimeout(() => F(r)("upload_photo").catch(console.error), 0);
    const o = await Re(n, r);
    try {
      return de(r)(o);
    } catch {
      return u(r)(`${o}`);
    }
  } catch (o) {
    return u(r)(`ERROR: ${o.message}`);
  }
}
async function Ue(e, t, n, r) {
  const o = a.I18N.command.help.summary + Object.keys(I).map((s) => `${s}：${a.I18N.command.help[s.substring(1)]}`).join(`
`);
  return u(r)(o);
}
async function Q(e, t, n, r) {
  try {
    return await f.delete(r.SHARE_CONTEXT.chatHistoryKey), t === "/new" ? u(r)(a.I18N.command.new.new_chat_start) : r.SHARE_CONTEXT.chatType === "private" ? u(r)(a.I18N.command.new.new_chat_start_private(r.CURRENT_CHAT_CONTEXT.chat_id)) : u(r)(a.I18N.command.new.new_chat_start_group(r.CURRENT_CHAT_CONTEXT.chat_id));
  } catch (o) {
    return u(r)(`ERROR: ${o.message}`);
  }
}
async function He(e, t, n, r) {
  const o = n.indexOf("=");
  if (o === -1)
    return u(r)(a.I18N.command.setenv.help);
  const s = n.slice(0, o), i = n.slice(o + 1);
  try {
    return oe(r.USER_CONFIG, s, i), await f.put(
      r.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(r.USER_CONFIG)
    ), u(r)(a.I18N.command.setenv.update_config_success);
  } catch (l) {
    return u(r)(a.I18N.command.setenv.update_config_error(l));
  }
}
async function Pe(e, t, n, r) {
  try {
    return r.USER_CONFIG[n] = null, await f.put(
      r.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(r.USER_CONFIG)
    ), u(r)(a.I18N.command.setenv.update_config_success);
  } catch (o) {
    return u(r)(a.I18N.command.setenv.update_config_error(o));
  }
}
async function Le(e, t, n, r) {
  const o = {
    headers: {
      "User-Agent": R.USER_AGENT
    }
  }, s = {
    ts: a.BUILD_TIMESTAMP,
    sha: a.BUILD_VERSION
  }, i = `https://raw.githubusercontent.com/LarchLiu/star-nexus/${a.UPDATE_BRANCH}`, l = `${i}/dist/timestamp`, c = `${i}/dist/buildinfo.json`;
  let _ = await fetch(c, o).then((h) => h.json()).catch(() => null);
  if (_ || (_ = await fetch(l, o).then((h) => h.text()).then((h) => ({ ts: Number(h.trim()), sha: "unknown" })).catch(() => ({ ts: 0, sha: "unknown" }))), s.ts < _.ts) {
    const h = a.I18N.command.version.new_version_found(s, _);
    return u(r)(h);
  } else {
    const h = a.I18N.command.version.current_is_latest_version(s);
    return u(r)(h);
  }
}
async function ke(e, t, n, r) {
  if (!a.ENABLE_USAGE_STATISTICS)
    return u(r)(a.I18N.command.usage.usage_not_open);
  const o = JSON.parse(await f.get(r.SHARE_CONTEXT.usageKey));
  let s = a.I18N.command.usage.current_usage;
  if (o != null && o.tokens) {
    const { tokens: i } = o, l = Object.keys(i.chats || {}).sort((c, _) => i.chats[_] - i.chats[c]);
    s += a.I18N.command.usage.total_usage(i.total);
    for (let c = 0; c < Math.min(l.length, 30); c++)
      s += `
  - ${l[c]}: ${i.chats[l[c]]} tokens`;
    l.length === 0 ? s += "0 tokens" : l.length > 30 && (s += `
  ...`);
  } else
    s += a.I18N.command.usage.no_usage;
  return u(r)(s);
}
async function Ge(e, t, n, r) {
  let o = `Current System Info:
`;
  if (o += `OpenAI Model:${a.CHAT_MODEL}
`, a.DEV_MODE) {
    const s = { ...r.SHARE_CONTEXT };
    s.currentBotToken = "******", r.USER_CONFIG.OPENAI_API_KEY = "******", o += "<pre>", o += `USER_CONFIG: 
${JSON.stringify(r.USER_CONFIG, null, 2)}
`, o += `CHAT_CONTEXT: 
${JSON.stringify(r.CURRENT_CHAT_CONTEXT, null, 2)}
`, o += `SHARE_CONTEXT: 
${JSON.stringify(s, null, 2)}
`, o += "</pre>";
  }
  return r.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", u(r)(o);
}
async function De(e, t, n, r) {
  setTimeout(() => F(r)("typing").catch(console.error), 0);
  const o = await we(n, r, (s, i) => {
    const { real: l, original: c } = s;
    let _ = i;
    for (; ; ) {
      const h = l.pop();
      if (c.pop(), h == null)
        break;
      if (h.role === "user") {
        (i === "" || i === void 0 || i === null) && (_ = h.content);
        break;
      }
    }
    return { history: { real: l, original: c }, text: _ };
  });
  return u(r)(o);
}
async function ve(e, t, n, r) {
  let o = "<pre>";
  return o += JSON.stringify({ message: e }, null, 2), o += "</pre>", r.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", u(r)(o);
}
async function Be(e, t) {
  a.DEV_MODE && (I["/echo"] = {
    help: "[DEBUG ONLY] echo message",
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: ve,
    needAuth: O.default
  });
  for (const n in I)
    if (e.text === n || e.text.startsWith(`${n} `)) {
      const r = I[n];
      try {
        if (r.needAuth) {
          const s = r.needAuth(t.SHARE_CONTEXT.chatType);
          if (s) {
            const i = await ge(t)(t.SHARE_CONTEXT.speakerId);
            if (i === null)
              return u(t)(a.I18N.command.permission.not_authorized);
            if (!s.includes(i)) {
              const l = a.I18N.command.permission.not_enough_permission(s, i);
              return u(t)(l);
            }
          }
        }
      } catch (s) {
        return u(t)(a.I18N.command.permission.role_error(s));
      }
      const o = e.text.substring(n.length).trim();
      try {
        return await r.fn(e, n, o, t);
      } catch (s) {
        return u(t)(a.I18N.command.permission.command_error(s));
      }
    }
  return null;
}
async function Xe(e) {
  const t = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: []
  };
  for (const r in I)
    if (!a.HIDE_COMMAND_BUTTONS.includes(r) && I.hasOwnProperty(r) && I[r].scopes)
      for (const o of I[r].scopes)
        t[o] || (t[o] = []), t[o].push(r);
  const n = {};
  for (const r in t)
    n[r] = await fetch(
      `https://api.telegram.org/bot${e}/setMyCommands`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commands: t[r].map((o) => ({
            command: o,
            description: a.I18N.command.help[o.substring(1)] || ""
          })),
          scope: {
            type: r
          }
        })
      }
    ).then((o) => o.json());
  return { ok: !0, result: n };
}
function Ke() {
  return Object.keys(I).map((e) => ({
    command: e,
    description: a.I18N.command.help[e.substring(1)]
  }));
}
async function D(e, t, n, r = !0) {
  var o;
  try {
    const s = {
      method: "GET",
      headers: t
    };
    n && Object.keys(n).length && (e += `?${new URLSearchParams(n).toString()}`);
    const i = await fetch(e, s);
    if (!i.ok) {
      let _ = i.statusText;
      const h = i.headers.get("content-type");
      if (h && h.includes("application/json")) {
        const E = await i.json();
        _ = ((o = E.error) == null ? void 0 : o.message) || E.message || i.statusText;
      } else
        h && h.includes("text/") && (_ = await i.text());
      if (!r)
        return { error: _ };
      throw new Error(_);
    }
    let l = i;
    const c = i.headers.get("content-type");
    return c && c.includes("application/json") ? l = await i.json() : c && c.includes("text/") && (l = await i.text()), l;
  } catch (s) {
    throw new Error(s.message);
  }
}
async function L(e, t, n, r, o = !0) {
  var s;
  try {
    const i = {
      method: r ? "PATCH" : "POST",
      headers: t,
      body: n ? JSON.stringify(n) : void 0
    }, l = await fetch(e, i);
    if (!l.ok) {
      let h = l.statusText;
      const E = l.headers.get("content-type");
      if (E && E.includes("application/json")) {
        const g = await l.json();
        h = ((s = g.error) == null ? void 0 : s.message) || g.message || l.statusText;
      } else
        E && E.includes("text/") && (h = await l.text());
      if (!o)
        return { error: h };
      throw new Error(h);
    }
    let c = l;
    const _ = l.headers.get("content-type");
    return _ && _.includes("application/json") ? c = await l.json() : _ && _.includes("text/") && (c = await l.text()), c;
  } catch (i) {
    throw new Error(i.message);
  }
}
function Ye(e) {
  const t = e.match(/https?:\/\/([^/]+)\/?/i);
  let n = "";
  return t && t[1] && (n = t[1]), n;
}
async function je(e, t, n = { "User-Agent": Ze }) {
  let r = "", o = "";
  const s = { domain: J, website: "Github" }, i = /https:\/\/github.com\/([^\/]*\/[^\/]*)/g.exec(e), l = i ? i[1] : "";
  try {
    if (l) {
      const c = await D(`${q}/${l}`, n), _ = await D(`${q}/${l}/languages`, n), h = await D(`${Je}/${l}/${c.default_branch}/README.md`, n, void 0, !1), E = h.error ? "" : h, g = c.description ? c.description.replace(/:\w+:/g, " ") : "";
      r = c.full_name + (g ? `: ${g}` : ""), e = c.html_url;
      const N = c.topics;
      N && N.length > 0 && (s.tags = N), _ && (s.languages = Object.keys(_));
      const S = t || We;
      if (S) {
        const w = c.owner.login, B = c.name, G = `${S}?username=${w}&reponame=${B}&stargazers_count=${c.stargazers_count}&language=${c.language}&issues=${c.open_issues_count}&forks=${c.forks_count}&description=${g}`, H = await D(G);
        s.socialPreview = H.url;
      }
      o = `${r}

${E}`, o.length > 1e3 && (o = o.substring(0, 1e3), o += "...");
    } else
      return { error: "Github error: Not supported website." };
    return { data: { title: r, url: e, content: o, meta: s } };
  } catch (c) {
    return { error: `Github error: ${c}` };
  }
}
const J = "github.com", Fe = {}.VITE_GITHUB_API_HOST || "https://api.github.com", q = `${Fe}/repos`, Je = {}.VITE_GITHUB_RAW_HOST || "https://raw.githubusercontent.com", We = {}.VITE_PICTURE_BED, v = {}.VITE_NOTION_API_URL || "https://api.notion.com/v1", Ve = {}.VITE_OPENAI_API_HOST || "https://api.openai.com/v1", ze = `Summarize this Document first and then Categorize it. The Document is the *Markdown* format. In summary within 200 words. Categories with less than 5 items. Category names should be divided by a comma. Return the summary first and then the categories like this:

Summary: my summary.

Categories: XXX, YYY

The Document is: 

`, Ze = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15", x = {
  [J]: {
    loader: je
  }
};
async function Qe(e, t, n) {
  let r = {};
  const o = Ye(e);
  return x[o] ? r = await x[o].loader(e, t, n) : r.error = "StarNexus error: Not supported website.", r;
}
async function qe(e, t) {
  try {
    let n = "", r = "", o = (await L(
      `${Ve}/chat/completions`,
      {
        Authorization: `Bearer ${e}`,
        "Content-Type": "application/json"
      },
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: ze
          },
          {
            role: "user",
            content: t.content
          }
        ],
        max_tokens: 400,
        temperature: 0.5
      }
    )).choices[0].message.content;
    o = o.replace(/\n/g, "");
    const s = /Summary:(.*)Categories:/g, i = /Categories:(.*)$/g, l = s.exec(o), c = i.exec(o);
    l && (n = l[1].trim()), c && (r = c[1].trim());
    const _ = (r || "Others").split(",");
    return { data: { summary: n, categories: _ } };
  } catch (n) {
    return { error: `Openai API error: ${n}` };
  }
}
async function xe(e, t) {
  try {
    let n = [{
      name: "Others"
    }];
    n = t.categories.map((_) => (_.endsWith(".") && (_ = _.slice(0, -1)), {
      name: _
    }));
    const r = {
      parent: {
        database_id: t.databaseId
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
    let o = "";
    if (t.meta && Object.keys(t.meta).length > 0 && t.meta.domain === J) {
      const _ = t.meta;
      if (r.properties = {
        ...r.properties,
        Website: {
          select: {
            name: t.meta.website
          }
        }
      }, _.languages) {
        const h = _.languages.map((E) => ({
          name: E
        }));
        r.properties = {
          ...r.properties,
          Languages: {
            multi_select: h
          }
        };
      }
      if (_.tags) {
        const h = _.tags.map((E) => ({
          name: E
        }));
        r.properties = {
          ...r.properties,
          Tags: {
            multi_select: h
          }
        };
      }
      _.socialPreview && (o = _.socialPreview);
    }
    const s = await L(
      `${v}/databases/${t.databaseId}/query`,
      {
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
        Authorization: `Bearer ${e}`
      },
      {
        filter: {
          property: "URL",
          rich_text: {
            contains: t.url
          }
        }
      }
    );
    let i = "", l = !1;
    if (s.results.length > 0 && (s.results[0].properties.Status.select.name === "Starred" && (l = !0), i = s.results[0].id), i)
      return r.properties = {
        ...r.properties,
        Status: {
          select: {
            name: l ? "Unstarred" : "Starred"
          }
        }
      }, await L(
        `${v}/pages/${i}`,
        {
          Authorization: `Bearer ${e}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        r,
        !0
      ), { data: { starred: !l, notionPageId: i } };
    if (i = (await L(
      `${v}/pages`,
      {
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
        Authorization: `Bearer ${e}`
      },
      r
    )).id, !o)
      return { data: { starred: !l, notionPageId: i } };
    const c = {
      object: "block",
      type: "image",
      image: {
        type: "external",
        external: {
          url: o
        }
      }
    };
    return await L(
      `${v}/blocks/${i}/children`,
      {
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
        Authorization: `Bearer ${e}`
      },
      {
        children: [c]
      },
      !0
    ), { data: { starred: !l, notionPageId: i } };
  } catch (n) {
    return { error: `Notion API error: ${n}` };
  }
}
async function et(e) {
  const t = /https?:\/\/(github.com|twitter.com|m.weibo.cn)\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/g, n = e.match(t), r = [];
  if (n)
    for (let o = 0; o < n.length; o++) {
      const s = n[o], i = await Qe(s, a.PICTURE_BED_URL);
      r.push(i);
    }
  return r;
}
async function tt(e) {
  let t = "", n = ["Others"];
  const r = a.NOTION_API_KEY, o = a.NOTION_DATABASE_ID, s = a.API_KEY;
  if (!r || !o)
    return { error: "Missing Notion API key or Database ID in settings." };
  if (s) {
    const { data: c, error: _ } = await qe(s, e);
    if (_)
      return { error: _ };
    t = c.summary, n = c.categories;
  } else
    t = e.content;
  const i = {
    databaseId: o,
    title: e.title,
    summary: t,
    url: e.url,
    categories: n,
    status: "Starred",
    meta: e.meta
  }, { error: l } = await xe(r, i);
  return l ? { error: l } : { message: "success" };
}
async function nt(e, t) {
  try {
    await t.initContext(e);
  } catch (n) {
    return new Response(M(n), { status: 200 });
  }
  return null;
}
async function rt(e, t) {
  if (a.DEBUG_MODE) {
    const n = `last_message:${t.SHARE_CONTEXT.chatHistoryKey}`;
    await f.put(n, JSON.stringify(e), { expirationTtl: 3600 });
  }
  return null;
}
async function ot(e, t) {
  return a.API_KEY ? f ? null : u(t)("DATABASE Not Set") : u(t)("OpenAI API Key Not Set");
}
async function X(e, t) {
  return a.I_AM_A_GENEROUS_PERSON ? null : t.SHARE_CONTEXT.chatType === "private" ? a.CHAT_WHITE_LIST.includes(`${t.CURRENT_CHAT_CONTEXT.chat_id}`) ? null : u(t)(
    a.I18N.message.user_has_no_permission_to_use_the_bot(t.CURRENT_CHAT_CONTEXT.chat_id)
  ) : R.GROUP_TYPES.includes(t.SHARE_CONTEXT.chatType) ? a.GROUP_CHAT_BOT_ENABLE ? a.CHAT_GROUP_WHITE_LIST.includes(`${t.CURRENT_CHAT_CONTEXT.chat_id}`) ? null : u(t)(
    a.I18N.message.group_has_no_permission_to_use_the_bot(t.CURRENT_CHAT_CONTEXT.chat_id)
  ) : new Response("Not support", { status: 401 }) : u(t)(
    a.I18N.message.not_supported_chat_type(t.SHARE_CONTEXT.chatType)
  );
}
async function st(e, t) {
  return e.text ? null : u(t)(a.I18N.message.not_supported_chat_type_message);
}
async function ee(e, t) {
  if (!e.text)
    return new Response("Non text message", { status: 200 });
  const n = t.SHARE_CONTEXT.currentBotName;
  if (n) {
    let r = !1;
    if (e.reply_to_message && e.reply_to_message.from.username === n && (r = !0), e.entities) {
      let o = "", s = 0;
      e.entities.forEach((i) => {
        switch (i.type) {
          case "bot_command":
            if (!r) {
              const l = e.text.substring(
                i.offset,
                i.offset + i.length
              );
              l.endsWith(n) && (r = !0);
              const c = l.replaceAll(`@${n}`, "").replaceAll(n, "").trim();
              o += c, s = i.offset + i.length;
            }
            break;
          case "mention":
          case "text_mention":
            if (!r) {
              const l = e.text.substring(
                i.offset,
                i.offset + i.length
              );
              (l === n || l === `@${n}`) && (r = !0);
            }
            o += e.text.substring(s, i.offset), s = i.offset + i.length;
            break;
        }
      }), o += e.text.substring(s, e.text.length), e.text = o.trim();
    }
    return r ? null : new Response("No mentioned", { status: 200 });
  }
  return new Response("Not set bot name", { status: 200 });
}
async function K(e, t) {
  return await Be(e, t);
}
async function Y(e, t) {
  if (!e.text.startsWith("~"))
    return null;
  e.text = e.text.slice(1);
  const n = e.text.indexOf(" ");
  if (n === -1)
    return null;
  const r = e.text.slice(0, n), o = e.text.slice(n + 1).trim();
  if (t.USER_DEFINE.ROLE.hasOwnProperty(r)) {
    t.SHARE_CONTEXT.role = r, e.text = o;
    const s = t.USER_DEFINE.ROLE[r];
    for (const i in s)
      t.USER_CONFIG.hasOwnProperty(i) && typeof t.USER_CONFIG[i] == typeof s[i] && (t.USER_CONFIG[i] = s[i]);
  }
}
async function at(e, t) {
  try {
    setTimeout(() => F(t)("typing").catch(console.error), 0);
    const n = await et(e.text);
    if (n.length === 0)
      return u(t)("No supported website.");
    for (let r = 0; r < n.length; r++) {
      const o = n[r];
      if (o.error)
        return u(t)(o.error);
      const s = await tt(o.data);
      if (s.error)
        return u(t)(s.error);
    }
    return u(t)("Saved to Notion 🎉");
  } catch (n) {
    return u(t)(`Error: ${n.message}`);
  }
}
async function it(e, t) {
  const n = {
    private: [
      X,
      st,
      K,
      Y
    ],
    group: [
      ee,
      X,
      K,
      Y
    ],
    supergroup: [
      ee,
      X,
      K,
      Y
    ]
  };
  if (!n.hasOwnProperty(t.SHARE_CONTEXT.chatType))
    return u(t)(
      a.I18N.message.not_supported_chat_type(t.SHARE_CONTEXT.chatType)
    );
  const r = n[t.SHARE_CONTEXT.chatType];
  for (const o of r)
    try {
      const s = await o(e, t);
      if (s && s instanceof Response)
        return s;
    } catch (s) {
      return console.error(s), u(t)(
        a.I18N.message.handle_chat_type_message_error(t.SHARE_CONTEXT.chatType)
      );
    }
  return null;
}
async function ct(e, t) {
  const n = await e.json();
  if (a.DEV_MODE && setTimeout(() => {
    f.put(`log:${(/* @__PURE__ */ new Date()).toISOString()}`, JSON.stringify(n), { expirationTtl: 600 }).catch(console.error);
  }), n.edited_message)
    throw new Error("Ignore edited message");
  if (n.message)
    return n.message;
  throw new Error("Invalid message");
}
async function lt(e) {
  const t = new he();
  t.initTelegramContext(e);
  const n = await ct(e), r = [
    nt,
    // 初始化聊天上下文: 生成chat_id, reply_to_message_id(群组消息), SHARE_CONTEXT
    rt,
    // 保存最后一条消息
    ot,
    // 检查环境是否准备好: API_KEY, DATABASE
    it,
    // 根据类型对消息进一步处理
    at
    // 与OpenAI聊天
  ];
  for (const o of r)
    try {
      const s = await o(n, t);
      if (s && s instanceof Response)
        return s;
    } catch (s) {
      return console.error(s), new Response(M(s), { status: 500 });
    }
  return null;
}
const te = "https://github.com/TBXark/ChatGPT-Telegram-Workers/blob/master/doc/DEPLOY.md", ne = "https://github.com/TBXark/ChatGPT-Telegram-Workers/issues", _t = "./init", W = `
<br/>
<p>For more information, please visit <a href="${te}">${te}</a></p>
<p>If you have any questions, please visit <a href="${ne}">${ne}</a></p>
`;
function ae(e) {
  return `<p style="color: red">Please set the <strong>${e}</strong> environment variable in Cloudflare Workers.</p> `;
}
async function ut(e) {
  const t = [], n = new URL(e.url).host, r = j ? "safehook" : "webhook";
  for (const s of a.TELEGRAM_AVAILABLE_TOKENS) {
    const i = `https://${n}/telegram/${s.trim()}/${r}`, l = s.split(":")[0];
    t[l] = {
      webhook: await fe(s, i).catch((c) => M(c)),
      command: await Xe(s).catch((c) => M(c))
    };
  }
  const o = k(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <h2>${n}</h2>
    ${a.TELEGRAM_AVAILABLE_TOKENS.length === 0 ? ae("TELEGRAM_AVAILABLE_TOKENS") : ""}
    ${Object.keys(t).map((s) => `
        <br/>
        <h4>Bot ID: ${s}</h4>
        <p style="color: ${t[s].webhook.ok ? "green" : "red"}">Webhook: ${JSON.stringify(t[s].webhook)}</p>
        <p style="color: ${t[s].command.ok ? "green" : "red"}">Command: ${JSON.stringify(t[s].command)}</p>
        `).join("")}
      ${W}
    `);
  return new Response(o, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function ht(e) {
  const t = await Oe(), { pathname: n } = new URL(e.url), r = n.match(/^\/telegram\/(.+)\/history/)[1];
  if (new URL(e.url).searchParams.get("password") !== t)
    return new Response("Password Error", { status: 401 });
  const i = JSON.parse(await f.get(r)), l = k(`
        <div id="history" style="width: 100%; height: 100%; overflow: auto; padding: 10px;">
            ${i.map((c) => `
                <div style="margin-bottom: 10px;">
                    <hp style="font-size: 16px; color: #999; margin-bottom: 5px;">${c.role}:</hp>
                    <p style="font-size: 12px; color: #333;">${c.content}</p>
                </div>
            `).join("")}
        </div>
  `);
  return new Response(l, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function pt(e) {
  try {
    return se(await lt(e));
  } catch (t) {
    return console.error(t), new Response(M(t), { status: 200 });
  }
}
async function mt(e) {
  try {
    const t = new URL(e.url);
    return t.pathname = t.pathname.replace("/safehook", "/webhook"), e = new Request(t, e), se(j.fetch(e));
  } catch (t) {
    return console.error(t), new Response(M(t), { status: 200 });
  }
}
async function dt() {
  const e = k(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Deployed Successfully!</p>
    <p> Version (ts:${a.BUILD_TIMESTAMP},sha:${a.BUILD_VERSION})</p>
    <br/>
    <p>You must <strong><a href="${_t}"> >>>>> click here <<<<< </a></strong> to bind the webhook.</p>
    <br/>
    ${a.API_KEY ? "" : ae("API_KEY")}
    <p>After binding the webhook, you can use the following commands to control the bot:</p>
    ${Ke().map((t) => `<p><strong>${t.command}</strong> - ${t.description}</p>`).join("")}
    <br/>
    <p>You can get bot information by visiting the following URL:</p>
    <p><strong>/telegram/:token/bot</strong> - Get bot information</p>
    ${W}
  `);
  return new Response(e, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Et(e) {
  const t = new URL(e.url).searchParams.get("text") || "Hello World", n = await re(), r = k(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Token Counter:</p>
    <p>source text: ${t}</p>
    <p>token count: ${n(t)}</p>
    <br/>
    `);
  return new Response(r, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function ft() {
  const e = [];
  for (const n of a.TELEGRAM_AVAILABLE_TOKENS) {
    const r = n.split(":")[0];
    e[r] = await ye(n);
  }
  const t = k(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <h4>Environment About Bot</h4>
    <p><strong>GROUP_CHAT_BOT_ENABLE:</strong> ${a.GROUP_CHAT_BOT_ENABLE}</p>
    <p><strong>GROUP_CHAT_BOT_SHARE_MODE:</strong> ${a.GROUP_CHAT_BOT_SHARE_MODE}</p>
    <p><strong>TELEGRAM_BOT_NAME:</strong> ${a.TELEGRAM_BOT_NAME.join(",")}</p>
    ${Object.keys(e).map((n) => `
            <br/>
            <h4>Bot ID: ${n}</h4>
            <p style="color: ${e[n].ok ? "green" : "red"}">${JSON.stringify(e[n])}</p>
            `).join("")}
    ${W}
  `);
  return new Response(t, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Tt(e) {
  const { pathname: t } = new URL(e.url);
  if (t === "/")
    return dt();
  if (t.startsWith("/init"))
    return ut(e);
  if (t.startsWith("/telegram") && t.endsWith("/webhook"))
    return pt(e);
  if (t.startsWith("/telegram") && t.endsWith("/safehook"))
    return mt(e);
  if (a.DEV_MODE || a.DEBUG_MODE) {
    if (t.startsWith("/telegram") && t.endsWith("/history"))
      return ht(e);
    if (t.startsWith("/gpt3/tokens/test"))
      return Et(e);
    if (t.startsWith("/telegram") && t.endsWith("/bot"))
      return ft();
  }
  return null;
}
const gt = {
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
}, At = {
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
}, yt = {
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
function Nt(e) {
  switch (e.toLowerCase()) {
    case "cn":
    case "zh-cn":
    case "zh-hans":
      return gt;
    case "zh-tw":
    case "zh-hk":
    case "zh-mo":
    case "zh-hant":
      return At;
    case "en":
    case "en-us":
      return yt;
  }
}
const St = {
  async fetch(e, t) {
    try {
      return ue(t, Nt), await Tt(e) || new Response("NOTFOUND", { status: 404 });
    } catch (n) {
      return console.error(n), new Response(M(n), { status: 500 });
    }
  }
};
export {
  St as default
};
