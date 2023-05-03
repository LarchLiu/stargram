var pe = Object.defineProperty;
var me = (e, t, n) => t in e ? pe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var D = (e, t, n) => (me(e, typeof t != "symbol" ? t + "" : t, n), n);
const a = {
  // OpenAI API Key
  API_KEY: null,
  // OpenAI的模型名称
  CHAT_MODEL: "gpt-3.5-turbo",
  // Notion info
  NOTION_API_KEY: null,
  NOTION_DATABASE_ID: null,
  PICTURE_BED_URL: null,
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
  BUILD_TIMESTAMP: "1683130528",
  // 当前版本 commit id
  BUILD_VERSION: "b54223a",
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
}, $ = {
  PASSWORD_KEY: "chat_history_password",
  GROUP_TYPES: ["group", "supergroup"],
  USER_AGENT: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15"
};
let g = null, Y = null;
const de = {
  API_KEY: "string",
  NOTION_API_KEY: "string",
  NOTION_DATABASE_ID: "string",
  PICTURE_BED_URL: "string",
  STAR_NEXUS_HUB_API: "string"
};
function Ee(e, t) {
  g = e.DATABASE, Y = e.API_GUARD;
  for (const n in a)
    if (e[n])
      switch (de[n] || typeof a[n]) {
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
class fe {
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
      const n = JSON.parse(await g.get(t));
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
    var l, c, u;
    this.SHARE_CONTEXT.usageKey = `usage:${this.SHARE_CONTEXT.currentBotId}`;
    const n = (l = t == null ? void 0 : t.chat) == null ? void 0 : l.id;
    if (n == null)
      throw new Error("Chat id not found");
    const r = this.SHARE_CONTEXT.currentBotId;
    let o = `history:${n}`, s = `user_config:${n}`, i = null;
    r && (o += `:${r}`, s += `:${r}`), $.GROUP_TYPES.includes((c = t.chat) == null ? void 0 : c.type) && (!a.GROUP_CHAT_BOT_SHARE_MODE && t.from.id && (o += `:${t.from.id}`, s += `:${t.from.id}`), i = `group_admin:${n}`), this.SHARE_CONTEXT.chatHistoryKey = o, this.SHARE_CONTEXT.configStoreKey = s, this.SHARE_CONTEXT.groupAdminKey = i, this.SHARE_CONTEXT.chatType = (u = t.chat) == null ? void 0 : u.type, this.SHARE_CONTEXT.chatId = t.chat.id, this.SHARE_CONTEXT.speakerId = t.from.id || t.chat.id;
  }
  /**
   * @param {TelegramMessage} message
   * @return {Promise<void>}
   */
  async initContext(t) {
    var o, s;
    const n = (o = t == null ? void 0 : t.chat) == null ? void 0 : o.id, r = $.GROUP_TYPES.includes((s = t.chat) == null ? void 0 : s.type) ? t.message_id : null;
    this._initChatContext(n, r), await this._initShareContext(t), await this._initUserConfig(this.SHARE_CONTEXT.configStoreKey);
  }
}
async function x(e, t, n) {
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
async function Te(e, t, n) {
  const r = n;
  if (e.length <= 4096) {
    const s = await x(e, t, r);
    if (s.status === 200)
      return s;
  }
  const o = 4e3;
  r.parse_mode = "HTML";
  for (let s = 0; s < e.length; s += o) {
    const i = e.slice(s, s + o);
    await x(`<pre>
${i}
</pre>`, t, r);
  }
  return new Response("Message batch send", { status: 200 });
}
function h(e) {
  return async (t) => Te(t, e.SHARE_CONTEXT.currentBotToken, e.CURRENT_CHAT_CONTEXT);
}
async function ge(e, t, n) {
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
function Ae(e) {
  return (t) => ge(t, e.SHARE_CONTEXT.currentBotToken, e.CURRENT_CHAT_CONTEXT);
}
async function ye(e, t, n) {
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
function J(e) {
  return (t) => ye(t, e.SHARE_CONTEXT.currentBotToken, e.CURRENT_CHAT_CONTEXT.chat_id);
}
async function Ne(e, t) {
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
async function Oe(e, t, n, r) {
  let o;
  try {
    o = JSON.parse(await g.get(t));
  } catch (s) {
    return console.error(s), s.message;
  }
  if (!o || !Array.isArray(o) || o.length === 0) {
    const s = await Ie(n, r);
    if (s == null)
      return null;
    o = s, await g.put(
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
function Se(e) {
  return (t) => Oe(t, e.SHARE_CONTEXT.groupAdminKey, e.CURRENT_CHAT_CONTEXT.chat_id, e.SHARE_CONTEXT.currentBotToken);
}
async function Ie(e, t) {
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
async function Re(e) {
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
async function q(e, t) {
  try {
    const n = await g.get(e);
    if (n && n !== "")
      return n;
  } catch (n) {
    console.error(n);
  }
  try {
    const n = await fetch(t, {
      headers: {
        "User-Agent": $.USER_AGENT
      }
    }).then((r) => r.text());
    return await g.put(e, n), n;
  } catch (n) {
    console.error(n);
  }
  return null;
}
async function ie() {
  const e = "https://raw.githubusercontent.com/tbxark-archive/GPT-3-Encoder/master", t = await q("encoder_raw_file", `${e}/encoder.json`).then((p) => JSON.parse(p)), n = await q("bpe_raw_file", `${e}/vocab.bpe`), r = (p, m) => Array.from(Array(m).keys()).slice(p), o = (p) => p.charCodeAt(0), s = (p) => String.fromCharCode(p), i = new TextEncoder("utf-8"), l = (p) => Array.from(i.encode(p)).map((m) => m.toString()), c = (p, m) => {
    const A = {};
    return p.forEach((I, T) => {
      A[p[T]] = m[T];
    }), A;
  };
  function u() {
    const p = r(o("!"), o("~") + 1).concat(r(o("¡"), o("¬") + 1), r(o("®"), o("ÿ") + 1));
    let m = p.slice(), A = 0;
    for (let T = 0; T < 2 ** 8; T++)
      p.includes(T) || (p.push(T), m.push(2 ** 8 + A), A = A + 1);
    m = m.map((T) => s(T));
    const I = {};
    return p.forEach((T, M) => {
      I[p[M]] = m[M];
    }), I;
  }
  function _(p) {
    const m = /* @__PURE__ */ new Set();
    let A = p[0];
    for (let I = 1; I < p.length; I++) {
      const T = p[I];
      m.add([A, T]), A = T;
    }
    return m;
  }
  const E = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu, f = {};
  Object.keys(t).forEach((p) => {
    f[t[p]] = p;
  });
  const d = n.split(`
`), y = d.slice(1, d.length - 1).map((p) => p.split(/(\s+)/).filter((m) => m.trim().length > 0)), N = u(), O = {};
  Object.keys(N).forEach((p) => {
    O[N[p]] = p;
  });
  const S = c(y, r(0, y.length)), w = /* @__PURE__ */ new Map();
  function G(p) {
    if (w.has(p))
      return w.get(p);
    let m = p.split(""), A = _(m);
    if (!A)
      return p;
    for (; ; ) {
      const I = {};
      Array.from(A).forEach((U) => {
        const Z = S[U];
        I[isNaN(Z) ? 1e11 : Z] = U;
      });
      const T = I[Math.min(...Object.keys(I).map(
        (U) => parseInt(U)
      ))];
      if (!(T in S))
        break;
      const M = T[0], L = T[1];
      let H = [], R = 0;
      for (; R < m.length; ) {
        const U = m.indexOf(M, R);
        if (U === -1) {
          H = H.concat(m.slice(R));
          break;
        }
        H = H.concat(m.slice(R, U)), R = U, m[R] === M && R < m.length - 1 && m[R + 1] === L ? (H.push(M + L), R = R + 2) : (H.push(m[R]), R = R + 1);
      }
      if (m = H, m.length === 1)
        break;
      A = _(m);
    }
    return m = m.join(" "), w.set(p, m), m;
  }
  return function(m) {
    let A = 0;
    const I = Array.from(m.matchAll(E)).map((T) => T[0]);
    for (let T of I) {
      T = l(T).map((L) => N[L]).join("");
      const M = G(T).split(" ").map((L) => t[L]);
      A += M.length;
    }
    return A;
  };
}
function we(e) {
  const t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let n = "";
  for (let r = e; r > 0; --r)
    n += t[Math.floor(Math.random() * t.length)];
  return n;
}
async function Ce() {
  let e = await g.get($.PASSWORD_KEY);
  return e === null && (e = we(32), await g.put($.PASSWORD_KEY, e)), e;
}
function v(e) {
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
function P(e) {
  return JSON.stringify({
    message: e.message,
    stack: e.stack
  });
}
function ce(e, t, n) {
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
async function be() {
  let e = (t) => Array.from(t).length;
  try {
    a.GPT3_TOKENS_COUNT && (e = await ie());
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
function le(e) {
  return e === null ? new Response("NOT HANDLED", { status: 200 }) : e.status === 200 ? e : new Response(e.body, {
    status: 200,
    headers: {
      "Original-Status": e.status,
      ...e.headers
    }
  });
}
async function $e(e, t, n) {
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
  return setTimeout(() => He(s.usage, n).catch(console.error), 0), s.choices[0].message.content;
}
async function Me(e, t) {
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
async function Ue(e, t, n) {
  const r = a.AUTO_TRIM_HISTORY && a.MAX_HISTORY_LENGTH <= 0, o = t.SHARE_CONTEXT.chatHistoryKey;
  let s = await Pe(o, t);
  if (n) {
    const u = n(s, e);
    s = u.history, e = u.text;
  }
  const { real: i, original: l } = s, c = await $e(e, i, t);
  return r || (l.push({ role: "user", content: e || "", cosplay: t.SHARE_CONTEXT.role || "" }), l.push({ role: "assistant", content: c, cosplay: t.SHARE_CONTEXT.role || "" }), await g.put(o, JSON.stringify(l)).catch(console.error)), c;
}
async function He(e, t) {
  if (!a.ENABLE_USAGE_STATISTICS)
    return;
  let n = JSON.parse(await g.get(t.SHARE_CONTEXT.usageKey));
  n || (n = {
    tokens: {
      total: 0,
      chats: {}
    }
  }), n.tokens.total += e.total_tokens, n.tokens.chats[t.SHARE_CONTEXT.chatId] ? n.tokens.chats[t.SHARE_CONTEXT.chatId] += e.total_tokens : n.tokens.chats[t.SHARE_CONTEXT.chatId] = e.total_tokens, await g.put(t.SHARE_CONTEXT.usageKey, JSON.stringify(n));
}
async function Pe(e, t) {
  const n = { role: "system", content: t.USER_CONFIG.SYSTEM_INIT_MESSAGE };
  if (a.AUTO_TRIM_HISTORY && a.MAX_HISTORY_LENGTH <= 0)
    return n.role = a.SYSTEM_INIT_MESSAGE_ROLE, { real: [n], original: [n] };
  let o = [];
  try {
    o = JSON.parse(await g.get(e));
  } catch (c) {
    console.error(c);
  }
  (!o || !Array.isArray(o)) && (o = []);
  let s = JSON.parse(JSON.stringify(o));
  t.SHARE_CONTEXT.role && (o = o.filter((c) => t.SHARE_CONTEXT.role === c.cosplay)), o.forEach((c) => {
    delete c.cosplay;
  });
  const i = await be(), l = (c, u, _, E) => {
    c.length > _ && (c = c.splice(c.length - _));
    let f = u;
    for (let d = c.length - 1; d >= 0; d--) {
      const y = c[d];
      let N = 0;
      if (y.content ? N = i(y.content) : y.content = "", f += N, f > E) {
        c = c.splice(d + 1);
        break;
      }
    }
    return c;
  };
  if (a.AUTO_TRIM_HISTORY && a.MAX_HISTORY_LENGTH > 0) {
    const c = i(n.content), u = Math.max(Object.keys(t.USER_DEFINE.ROLE).length, 1);
    o = l(o, c, a.MAX_HISTORY_LENGTH, a.MAX_TOKEN_LENGTH), s = l(s, c, a.MAX_HISTORY_LENGTH * u, a.MAX_TOKEN_LENGTH * u);
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
const C = {
  default(e) {
    return $.GROUP_TYPES.includes(e) ? ["administrator", "creator"] : !1;
  },
  shareModeGroup(e) {
    return $.GROUP_TYPES.includes(e) && a.GROUP_CHAT_BOT_SHARE_MODE ? ["administrator", "creator"] : !1;
  }
}, b = {
  "/help": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Ge
  },
  "/new": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: Q,
    needAuth: C.shareModeGroup
  },
  "/start": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Q,
    needAuth: C.default
  },
  "/img": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: ke,
    needAuth: C.shareModeGroup
  },
  "/version": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Be,
    needAuth: C.default
  },
  "/setenv": {
    scopes: [],
    fn: De,
    needAuth: C.shareModeGroup
  },
  "/delenv": {
    scopes: [],
    fn: ve,
    needAuth: C.shareModeGroup
  },
  "/usage": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Xe,
    needAuth: C.default
  },
  "/system": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Ke,
    needAuth: C.default
  },
  "/role": {
    scopes: ["all_private_chats"],
    fn: Le,
    needAuth: C.shareModeGroup
  },
  "/redo": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: je,
    needAuth: C.shareModeGroup
  }
};
async function Le(e, t, n, r) {
  if (n === "show") {
    const _ = Object.getOwnPropertyNames(r.USER_DEFINE.ROLE).length;
    if (_ === 0)
      return h(r)(a.I18N.command.role.not_defined_any_role);
    let E = a.I18N.command.role.current_defined_role(_);
    for (const f in r.USER_DEFINE.ROLE)
      r.USER_DEFINE.ROLE.hasOwnProperty(f) && (E += `~${f}:
<pre>`, E += `${JSON.stringify(r.USER_DEFINE.ROLE[f])}
`, E += "</pre>");
    return r.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", h(r)(E);
  }
  const o = n.indexOf(" ");
  if (o === -1)
    return h(r)(a.I18N.command.role.help);
  const s = n.slice(0, o), i = n.slice(o + 1).trim(), l = i.indexOf("=");
  if (l === -1) {
    if (i === "del")
      try {
        if (r.USER_DEFINE.ROLE[s])
          return delete r.USER_DEFINE.ROLE[s], await g.put(
            r.SHARE_CONTEXT.configStoreKey,
            JSON.stringify(Object.assign(r.USER_CONFIG, { USER_DEFINE: r.USER_DEFINE }))
          ), h(r)(a.I18N.command.role.delete_role_success);
      } catch (_) {
        return h(r)(a.I18N.command.role.delete_role_error(_));
      }
    return h(r)(a.I18N.command.role.help);
  }
  const c = i.slice(0, l), u = i.slice(l + 1);
  r.USER_DEFINE.ROLE[s] || (r.USER_DEFINE.ROLE[s] = {
    // 系统初始化消息
    SYSTEM_INIT_MESSAGE: a.SYSTEM_INIT_MESSAGE,
    // OpenAI API 额外参数
    OPENAI_API_EXTRA_PARAMS: {}
  });
  try {
    return ce(r.USER_DEFINE.ROLE[s], c, u), await g.put(
      r.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(Object.assign(r.USER_CONFIG, { USER_DEFINE: r.USER_DEFINE }))
    ), h(r)(a.I18N.command.role.update_role_success);
  } catch (_) {
    return h(r)(a.I18N.command.role.update_role_error(_));
  }
}
async function ke(e, t, n, r) {
  if (n === "")
    return h(r)(a.I18N.command.img.help);
  try {
    setTimeout(() => J(r)("upload_photo").catch(console.error), 0);
    const o = await Me(n, r);
    try {
      return Ae(r)(o);
    } catch {
      return h(r)(`${o}`);
    }
  } catch (o) {
    return h(r)(`ERROR: ${o.message}`);
  }
}
async function Ge(e, t, n, r) {
  const o = a.I18N.command.help.summary + Object.keys(b).map((s) => `${s}：${a.I18N.command.help[s.substring(1)]}`).join(`
`);
  return h(r)(o);
}
async function Q(e, t, n, r) {
  try {
    return await g.delete(r.SHARE_CONTEXT.chatHistoryKey), t === "/new" ? h(r)(a.I18N.command.new.new_chat_start) : r.SHARE_CONTEXT.chatType === "private" ? h(r)(a.I18N.command.new.new_chat_start_private(r.CURRENT_CHAT_CONTEXT.chat_id)) : h(r)(a.I18N.command.new.new_chat_start_group(r.CURRENT_CHAT_CONTEXT.chat_id));
  } catch (o) {
    return h(r)(`ERROR: ${o.message}`);
  }
}
async function De(e, t, n, r) {
  const o = n.indexOf("=");
  if (o === -1)
    return h(r)(a.I18N.command.setenv.help);
  const s = n.slice(0, o), i = n.slice(o + 1);
  try {
    return ce(r.USER_CONFIG, s, i), await g.put(
      r.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(r.USER_CONFIG)
    ), h(r)(a.I18N.command.setenv.update_config_success);
  } catch (l) {
    return h(r)(a.I18N.command.setenv.update_config_error(l));
  }
}
async function ve(e, t, n, r) {
  try {
    return r.USER_CONFIG[n] = null, await g.put(
      r.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(r.USER_CONFIG)
    ), h(r)(a.I18N.command.setenv.update_config_success);
  } catch (o) {
    return h(r)(a.I18N.command.setenv.update_config_error(o));
  }
}
async function Be(e, t, n, r) {
  const o = {
    headers: {
      "User-Agent": $.USER_AGENT
    }
  }, s = {
    ts: a.BUILD_TIMESTAMP,
    sha: a.BUILD_VERSION
  }, i = `https://raw.githubusercontent.com/LarchLiu/star-nexus/${a.UPDATE_BRANCH}`, l = `${i}/dist/timestamp`, c = `${i}/dist/buildinfo.json`;
  let u = await fetch(c, o).then((_) => _.json()).catch(() => null);
  if (u || (u = await fetch(l, o).then((_) => _.text()).then((_) => ({ ts: Number(_.trim()), sha: "unknown" })).catch(() => ({ ts: 0, sha: "unknown" }))), s.ts < u.ts) {
    const _ = a.I18N.command.version.new_version_found(s, u);
    return h(r)(_);
  } else {
    const _ = a.I18N.command.version.current_is_latest_version(s);
    return h(r)(_);
  }
}
async function Xe(e, t, n, r) {
  if (!a.ENABLE_USAGE_STATISTICS)
    return h(r)(a.I18N.command.usage.usage_not_open);
  const o = JSON.parse(await g.get(r.SHARE_CONTEXT.usageKey));
  let s = a.I18N.command.usage.current_usage;
  if (o != null && o.tokens) {
    const { tokens: i } = o, l = Object.keys(i.chats || {}).sort((c, u) => i.chats[u] - i.chats[c]);
    s += a.I18N.command.usage.total_usage(i.total);
    for (let c = 0; c < Math.min(l.length, 30); c++)
      s += `
  - ${l[c]}: ${i.chats[l[c]]} tokens`;
    l.length === 0 ? s += "0 tokens" : l.length > 30 && (s += `
  ...`);
  } else
    s += a.I18N.command.usage.no_usage;
  return h(r)(s);
}
async function Ke(e, t, n, r) {
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
  return r.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", h(r)(o);
}
async function je(e, t, n, r) {
  setTimeout(() => J(r)("typing").catch(console.error), 0);
  const o = await Ue(n, r, (s, i) => {
    const { real: l, original: c } = s;
    let u = i;
    for (; ; ) {
      const _ = l.pop();
      if (c.pop(), _ == null)
        break;
      if (_.role === "user") {
        (i === "" || i === void 0 || i === null) && (u = _.content);
        break;
      }
    }
    return { history: { real: l, original: c }, text: u };
  });
  return h(r)(o);
}
async function Fe(e, t, n, r) {
  let o = "<pre>";
  return o += JSON.stringify({ message: e }, null, 2), o += "</pre>", r.CURRENT_CHAT_CONTEXT.parse_mode = "HTML", h(r)(o);
}
async function Ye(e, t) {
  a.DEV_MODE && (b["/echo"] = {
    help: "[DEBUG ONLY] echo message",
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: Fe,
    needAuth: C.default
  });
  for (const n in b)
    if (e.text === n || e.text.startsWith(`${n} `)) {
      const r = b[n];
      try {
        if (r.needAuth) {
          const s = r.needAuth(t.SHARE_CONTEXT.chatType);
          if (s) {
            const i = await Se(t)(t.SHARE_CONTEXT.speakerId);
            if (i === null)
              return h(t)(a.I18N.command.permission.not_authorized);
            if (!s.includes(i)) {
              const l = a.I18N.command.permission.not_enough_permission(s, i);
              return h(t)(l);
            }
          }
        }
      } catch (s) {
        return h(t)(a.I18N.command.permission.role_error(s));
      }
      const o = e.text.substring(n.length).trim();
      try {
        return await r.fn(e, n, o, t);
      } catch (s) {
        return h(t)(a.I18N.command.permission.command_error(s));
      }
    }
  return null;
}
async function Je(e) {
  const t = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: []
  };
  for (const r in b)
    if (!a.HIDE_COMMAND_BUTTONS.includes(r) && b.hasOwnProperty(r) && b[r].scopes)
      for (const o of b[r].scopes)
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
function We() {
  return Object.keys(b).map((e) => ({
    command: e,
    description: a.I18N.command.help[e.substring(1)]
  }));
}
async function B(e, t, n, r = !0) {
  var o;
  try {
    const s = {
      method: "GET",
      headers: t
    };
    n && Object.keys(n).length && (e += `?${new URLSearchParams(n).toString()}`);
    const i = await fetch(e, s);
    if (!i.ok) {
      let u = i.statusText;
      const _ = i.headers.get("content-type");
      if (_ && _.includes("application/json")) {
        const E = await i.json();
        u = ((o = E.error) == null ? void 0 : o.message) || E.message || i.statusText;
      } else
        _ && _.includes("text/") && (u = await i.text());
      if (!r)
        return { error: u };
      throw new Error(u);
    }
    let l = i;
    const c = i.headers.get("content-type");
    return c && c.includes("application/json") ? l = await i.json() : c && c.includes("text/") && (l = await i.text()), l;
  } catch (s) {
    throw new Error(s.message);
  }
}
async function k(e, t, n, r, o = !0) {
  var s;
  try {
    const i = {
      method: r ? "PATCH" : "POST",
      headers: t,
      body: n ? JSON.stringify(n) : void 0
    }, l = await fetch(e, i);
    if (!l.ok) {
      let _ = l.statusText;
      const E = l.headers.get("content-type");
      if (E && E.includes("application/json")) {
        const f = await l.json();
        _ = ((s = f.error) == null ? void 0 : s.message) || f.message || l.statusText;
      } else
        E && E.includes("text/") && (_ = await l.text());
      if (!o)
        return { error: _ };
      throw new Error(_);
    }
    let c = l;
    const u = l.headers.get("content-type");
    return u && u.includes("application/json") ? c = await l.json() : u && u.includes("text/") && (c = await l.text()), c;
  } catch (i) {
    throw new Error(i.message);
  }
}
function Ve(e) {
  const t = e.match(/https?:\/\/([^/]+)\/?/i);
  let n = "";
  return t && t[1] && (n = t[1]), n;
}
const ze = /[a-zA-Z0-9_\u0392-\u03C9\u00C0-\u00FF\u0600-\u06FF\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g;
function ee(e) {
  const t = e.match(ze);
  let n = 0;
  if (!t)
    return 0;
  for (let r = 0; r < t.length; r++)
    t[r].charCodeAt(0) >= 19968 ? n += t[r].length : n += 1;
  return n;
}
function Ze(e) {
  e = e.replace(/,+,/g, ", ");
  const t = /<img src="(.+)" \/>/g;
  e = e.replace(t, "![$1]($1)");
  const n = /<a href="(.+)">(.+)<\/a>/g;
  return e = e.replace(n, "[$2]($1)"), e = e.replace(/!\[.+?\]\(.+?\)/g, ""), e = e.replace(/<(?:.|\n)*?>/gm, ""), e = e.replace(/<\/(?:.|\n)*?>/gm, ""), e = e.replace(/#+\s/g, ""), e = e.replace(/\s+/g, " "), e = e.replace(/\n{2,}/g, `
`), e = e.trim(), e;
}
function xe(e, t) {
  let n = e;
  if (e && Object.keys(t).length)
    for (const r in t)
      n = n.replace(`{${r}}`, t[r]);
  return n;
}
async function qe(e, t = { "User-Agent": _e }) {
  let n = "", r = "", o = e.webUrl;
  const s = { domain: W, website: "Github" }, i = /https:\/\/github.com\/([^\/]*\/[^\/]*)/g.exec(o), l = i ? i[1] : "";
  try {
    if (l) {
      const c = await B(`${te}/${l}`, t), u = await B(`${te}/${l}/languages`, t), _ = await B(`${nt}/${l}/${c.default_branch}/README.md`, t, void 0, !1), E = _.error ? "" : _, f = c.description ? c.description.replace(/:\w+:/g, " ") : "";
      n = c.full_name + (f ? `: ${f}` : ""), o = c.html_url;
      const d = c.topics;
      d && d.length > 0 && (s.tags = d), u && (s.languages = Object.keys(u));
      const y = e.picBed || ue;
      if (y) {
        const N = c.owner.login, O = c.name, S = {
          username: N,
          reponame: O,
          stargazers_count: c.stargazers_count,
          language: c.language,
          issues: c.open_issues_count,
          forks: c.forks_count,
          description: f
        }, w = `${y}/github`, G = await k(w, {
          ...t,
          "Content-Type": "application/json"
        }, S);
        s.cover = G.url;
      }
      r = `${n}

${E}`;
    } else
      return { error: "Github error: Not supported website." };
    return { data: { title: n, url: o, content: r, meta: s } };
  } catch (c) {
    return { error: `Github error: ${c}` };
  }
}
async function Qe(e, t = { "User-Agent": _e }) {
  var n;
  let r = "", o = "";
  const s = e.webUrl, i = { domain: V, website: "Twitter" }, l = /https:\/\/twitter.com\/([^\/]*\/status\/[^\?]*)/g.exec(s), c = l ? l[1] : "", u = c.split("/")[2], _ = e.webHub || et;
  try {
    if (c && _) {
      const E = (await B(`${_}/twitter/tweet/${c}/original=true`, t)).item;
      E.forEach((d) => {
        var y, N;
        let O = d.full_text;
        if ((y = d.entities) != null && y.urls && d.entities.urls.forEach((S) => {
          O = O.replace(S.url, S.expanded_url), d.full_text = O;
        }), d.quoted_status) {
          let S = d.quoted_status.full_text;
          (N = d.quoted_status.entities) != null && N.urls && d.quoted_status.entities.urls.forEach((w) => {
            S = S.replace(w.url, w.expanded_url), d.quoted_status.full_text = S;
          }), o += `${d.quoted_status.user.name}: ${S}
${d.user.name}: ${O}
`;
        } else
          o += `${d.user.name}: ${O}
`;
      });
      const f = E.find(({ id_str: d }) => d === u);
      if (f) {
        const d = f.user, y = d.name, N = d.screen_name;
        r = `Twitter · ${y} @${N}`;
        const O = e.picBed || ue;
        if (O) {
          const w = d.profile_image_url_https.replace("_normal", ""), G = f.full_text, p = new Date(f.created_at).toUTCString(), m = {
            name: y,
            screenName: N,
            avator: w,
            content: G,
            status: u,
            pubTime: p
          }, A = `${O}/twitter`, I = await k(A, { ...t, "Content-Type": "application/json" }, m);
          i.cover = I.url;
        }
        const S = (n = f.entities) == null ? void 0 : n.hashtags;
        S && (i.tags = S.map((w) => w.text));
      }
    } else
      return { error: "Twitter error: Not supported website." };
    return { data: { title: r, url: s, content: o, meta: i } };
  } catch (E) {
    return { error: `Twitter error: ${E}` };
  }
}
const W = "github.com", V = "twitter.com", et = {}.VITE_STAR_NEXUS_HUB_API, tt = {}.VITE_GITHUB_API_HOST || "https://api.github.com", te = `${tt}/repos`, nt = {}.VITE_GITHUB_RAW_HOST || "https://raw.githubusercontent.com", ue = {}.VITE_PICTURE_BED, X = {}.VITE_NOTION_API_URL || "https://api.notion.com/v1", rt = {}.VITE_OPENAI_API_HOST || "https://api.openai.com/v1", ot = 2048, ne = `Please summarize content within 300 words and then classify it to 1-5 types of classification. Classification names should be short and no explanation or description is needed. Separate the classification names with "#", not other symbols.
Start the summary with "Summary:". Start the types classification with "Classification:". Return the summary first and then the types of classification. The format is as follows:

Summary: This is the summary content. // must start with Summary:
Classification: XXX#YYY#ZZZ // must start with Classification:
`, st = `The Content is:
=====
{content}
=====
{language}`, at = {
  en: "Please answer in English.",
  "zh-CN": "请用中文回答。"
}, _e = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15", re = {
  [W]: {
    loader: qe
  },
  [V]: {
    loader: Qe
  }
};
async function it(e, t) {
  let n = {};
  const r = Ve(e.webUrl);
  return re[r] ? n = await re[r].loader(e, t) : n.error = "StarNexus error: Not supported website.", n;
}
async function ct(e, t, n = "en") {
  try {
    let r = "", o = "", s = t.content;
    s = Ze(s);
    const i = ee(s);
    if (i > 40) {
      const c = ee(ne), u = ot - c;
      i > u && (s = s.substring(0, s.length - (i - u)));
      const _ = {
        content: s,
        language: at[n]
      }, E = xe(st, _);
      let f = (await k(
        `${rt}/chat/completions`,
        {
          Authorization: `Bearer ${e}`,
          "Content-Type": "application/json"
        },
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: ne
            },
            {
              role: "user",
              content: E
            }
          ],
          max_tokens: 800,
          temperature: 0.4
        }
      )).choices[0].message.content;
      f = f.replace(/\n/g, "");
      const d = /Summary:(.*)Classification:/g, y = /Classification:(.*)$/g, N = d.exec(f), O = y.exec(f);
      N && (r = N[1].trim()), O && (o = O[1].trim());
    } else
      r = s;
    const l = (o || "Others").split("#");
    return { data: { summary: r, categories: l } };
  } catch (r) {
    return { error: `Openai API error: ${r}` };
  }
}
async function lt(e, t) {
  try {
    let n = [{
      name: "Others"
    }];
    n = t.categories.map((c) => (c = c.trim(), c.endsWith(".") && (c = c.slice(0, -1)), {
      name: c
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
    if (t.meta && Object.keys(t.meta).length > 0) {
      const c = t.meta;
      if (c.cover && (o = c.cover, r.properties = {
        ...r.properties,
        Cover: {
          url: o
        }
      }), r.properties = {
        ...r.properties,
        Website: {
          select: {
            name: c.website
          }
        }
      }, t.meta.domain === W) {
        const u = c;
        if (u.languages) {
          const _ = u.languages.map((E) => ({
            name: E
          }));
          r.properties = {
            ...r.properties,
            Languages: {
              multi_select: _
            }
          };
        }
        if (u.tags) {
          const _ = u.tags.map((E) => ({
            name: E
          }));
          r.properties = {
            ...r.properties,
            Tags: {
              multi_select: _
            }
          };
        }
      } else if (t.meta.domain === V) {
        const u = c;
        if (u.tags) {
          const _ = u.tags.map((E) => ({
            name: E
          }));
          r.properties = {
            ...r.properties,
            Tags: {
              multi_select: _
            }
          };
        }
      }
    }
    const s = await k(
      `${X}/databases/${t.databaseId}/query`,
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
      }, await k(
        `${X}/pages/${i}`,
        {
          Authorization: `Bearer ${e}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        r,
        !0
      ), { data: { starred: !l, notionPageId: i } };
    if (o) {
      const c = {
        object: "block",
        image: {
          external: {
            url: o
          }
        }
      };
      r.children = [c];
    }
    return i = (await k(
      `${X}/pages`,
      {
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
        Authorization: `Bearer ${e}`
      },
      r
    )).id, { data: { starred: !l, notionPageId: i } };
  } catch (n) {
    return { error: `Notion API error: ${n}` };
  }
}
async function ut(e) {
  const t = /https?:\/\/(github.com|twitter.com|m.weibo.cn)\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/g, n = e.match(t), r = [];
  if (n)
    for (let o = 0; o < n.length; o++) {
      const s = n[o], i = await it({
        webUrl: s,
        picBed: a.PICTURE_BED_URL,
        webHub: a.STAR_NEXUS_HUB_API
      });
      r.push(i);
    }
  return r;
}
async function _t(e) {
  let t = "", n = ["Others"];
  const r = a.NOTION_API_KEY, o = a.NOTION_DATABASE_ID, s = a.API_KEY;
  if (!r || !o)
    return { error: "Missing Notion API key or Database ID in settings." };
  if (s) {
    const { data: c, error: u } = await ct(s, e);
    if (u)
      return { error: u };
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
  }, { error: l } = await lt(r, i);
  return l ? { error: l } : { message: "success" };
}
async function ht(e, t) {
  try {
    await t.initContext(e);
  } catch (n) {
    return new Response(P(n), { status: 200 });
  }
  return null;
}
async function pt(e, t) {
  if (a.DEBUG_MODE) {
    const n = `last_message:${t.SHARE_CONTEXT.chatHistoryKey}`;
    await g.put(n, JSON.stringify(e), { expirationTtl: 3600 });
  }
  return null;
}
async function mt(e, t) {
  return a.API_KEY ? g ? null : h(t)("DATABASE Not Set") : h(t)("OpenAI API Key Not Set");
}
async function K(e, t) {
  return a.I_AM_A_GENEROUS_PERSON ? null : t.SHARE_CONTEXT.chatType === "private" ? a.CHAT_WHITE_LIST.includes(`${t.CURRENT_CHAT_CONTEXT.chat_id}`) ? null : h(t)(
    a.I18N.message.user_has_no_permission_to_use_the_bot(t.CURRENT_CHAT_CONTEXT.chat_id)
  ) : $.GROUP_TYPES.includes(t.SHARE_CONTEXT.chatType) ? a.GROUP_CHAT_BOT_ENABLE ? a.CHAT_GROUP_WHITE_LIST.includes(`${t.CURRENT_CHAT_CONTEXT.chat_id}`) ? null : h(t)(
    a.I18N.message.group_has_no_permission_to_use_the_bot(t.CURRENT_CHAT_CONTEXT.chat_id)
  ) : new Response("Not support", { status: 401 }) : h(t)(
    a.I18N.message.not_supported_chat_type(t.SHARE_CONTEXT.chatType)
  );
}
async function dt(e, t) {
  return e.text ? null : h(t)(a.I18N.message.not_supported_chat_type_message);
}
async function oe(e, t) {
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
async function j(e, t) {
  return await Ye(e, t);
}
async function F(e, t) {
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
async function Et(e, t) {
  try {
    setTimeout(() => J(t)("typing").catch(console.error), 0);
    const n = await ut(e.text);
    if (n.length === 0)
      return h(t)("No supported website.");
    for (let r = 0; r < n.length; r++) {
      const o = n[r];
      if (o.error)
        return h(t)(o.error);
      const s = await _t(o.data);
      if (s.error)
        return h(t)(s.error);
    }
    return h(t)("Saved to Notion 🎉");
  } catch (n) {
    return h(t)(`Error: ${n.message}`);
  }
}
async function ft(e, t) {
  const n = {
    private: [
      K,
      dt,
      j,
      F
    ],
    group: [
      oe,
      K,
      j,
      F
    ],
    supergroup: [
      oe,
      K,
      j,
      F
    ]
  };
  if (!n.hasOwnProperty(t.SHARE_CONTEXT.chatType))
    return h(t)(
      a.I18N.message.not_supported_chat_type(t.SHARE_CONTEXT.chatType)
    );
  const r = n[t.SHARE_CONTEXT.chatType];
  for (const o of r)
    try {
      const s = await o(e, t);
      if (s && s instanceof Response)
        return s;
    } catch (s) {
      return console.error(s), h(t)(
        a.I18N.message.handle_chat_type_message_error(t.SHARE_CONTEXT.chatType)
      );
    }
  return null;
}
async function Tt(e, t) {
  const n = await e.json();
  if (a.DEV_MODE && setTimeout(() => {
    g.put(`log:${(/* @__PURE__ */ new Date()).toISOString()}`, JSON.stringify(n), { expirationTtl: 600 }).catch(console.error);
  }), n.edited_message)
    throw new Error("Ignore edited message");
  if (n.message)
    return n.message;
  throw new Error("Invalid message");
}
async function gt(e) {
  const t = new fe();
  t.initTelegramContext(e);
  const n = await Tt(e), r = [
    ht,
    // 初始化聊天上下文: 生成chat_id, reply_to_message_id(群组消息), SHARE_CONTEXT
    pt,
    // 保存最后一条消息
    mt,
    // 检查环境是否准备好: API_KEY, DATABASE
    ft,
    // 根据类型对消息进一步处理
    Et
    // 与OpenAI聊天
  ];
  for (const o of r)
    try {
      const s = await o(n, t);
      if (s && s instanceof Response)
        return s;
    } catch (s) {
      return console.error(s), new Response(P(s), { status: 500 });
    }
  return null;
}
const se = "https://github.com/TBXark/ChatGPT-Telegram-Workers/blob/master/doc/DEPLOY.md", ae = "https://github.com/TBXark/ChatGPT-Telegram-Workers/issues", At = "./init", z = `
<br/>
<p>For more information, please visit <a href="${se}">${se}</a></p>
<p>If you have any questions, please visit <a href="${ae}">${ae}</a></p>
`;
function he(e) {
  return `<p style="color: red">Please set the <strong>${e}</strong> environment variable in Cloudflare Workers.</p> `;
}
async function yt(e) {
  const t = [], n = new URL(e.url).host, r = Y ? "safehook" : "webhook";
  for (const s of a.TELEGRAM_AVAILABLE_TOKENS) {
    const i = `https://${n}/telegram/${s.trim()}/${r}`, l = s.split(":")[0];
    t[l] = {
      webhook: await Ne(s, i).catch((c) => P(c)),
      command: await Je(s).catch((c) => P(c))
    };
  }
  const o = v(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <h2>${n}</h2>
    ${a.TELEGRAM_AVAILABLE_TOKENS.length === 0 ? he("TELEGRAM_AVAILABLE_TOKENS") : ""}
    ${Object.keys(t).map((s) => `
        <br/>
        <h4>Bot ID: ${s}</h4>
        <p style="color: ${t[s].webhook.ok ? "green" : "red"}">Webhook: ${JSON.stringify(t[s].webhook)}</p>
        <p style="color: ${t[s].command.ok ? "green" : "red"}">Command: ${JSON.stringify(t[s].command)}</p>
        `).join("")}
      ${z}
    `);
  return new Response(o, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Nt(e) {
  const t = await Ce(), { pathname: n } = new URL(e.url), r = n.match(/^\/telegram\/(.+)\/history/)[1];
  if (new URL(e.url).searchParams.get("password") !== t)
    return new Response("Password Error", { status: 401 });
  const i = JSON.parse(await g.get(r)), l = v(`
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
async function Ot(e) {
  try {
    return le(await gt(e));
  } catch (t) {
    return console.error(t), new Response(P(t), { status: 200 });
  }
}
async function St(e) {
  try {
    const t = new URL(e.url);
    return t.pathname = t.pathname.replace("/safehook", "/webhook"), e = new Request(t, e), le(Y.fetch(e));
  } catch (t) {
    return console.error(t), new Response(P(t), { status: 200 });
  }
}
async function It() {
  const e = v(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Deployed Successfully!</p>
    <p> Version (ts:${a.BUILD_TIMESTAMP},sha:${a.BUILD_VERSION})</p>
    <br/>
    <p>You must <strong><a href="${At}"> >>>>> click here <<<<< </a></strong> to bind the webhook.</p>
    <br/>
    ${a.API_KEY ? "" : he("API_KEY")}
    <p>After binding the webhook, you can use the following commands to control the bot:</p>
    ${We().map((t) => `<p><strong>${t.command}</strong> - ${t.description}</p>`).join("")}
    <br/>
    <p>You can get bot information by visiting the following URL:</p>
    <p><strong>/telegram/:token/bot</strong> - Get bot information</p>
    ${z}
  `);
  return new Response(e, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Rt(e) {
  const t = new URL(e.url).searchParams.get("text") || "Hello World", n = await ie(), r = v(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Token Counter:</p>
    <p>source text: ${t}</p>
    <p>token count: ${n(t)}</p>
    <br/>
    `);
  return new Response(r, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function wt() {
  const e = [];
  for (const n of a.TELEGRAM_AVAILABLE_TOKENS) {
    const r = n.split(":")[0];
    e[r] = await Re(n);
  }
  const t = v(`
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
    ${z}
  `);
  return new Response(t, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function Ct(e) {
  const { pathname: t } = new URL(e.url);
  if (t === "/")
    return It();
  if (t.startsWith("/init"))
    return yt(e);
  if (t.startsWith("/telegram") && t.endsWith("/webhook"))
    return Ot(e);
  if (t.startsWith("/telegram") && t.endsWith("/safehook"))
    return St(e);
  if (a.DEV_MODE || a.DEBUG_MODE) {
    if (t.startsWith("/telegram") && t.endsWith("/history"))
      return Nt(e);
    if (t.startsWith("/gpt3/tokens/test"))
      return Rt(e);
    if (t.startsWith("/telegram") && t.endsWith("/bot"))
      return wt();
  }
  return null;
}
const bt = {
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
}, $t = {
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
}, Mt = {
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
function Ut(e) {
  switch (e.toLowerCase()) {
    case "cn":
    case "zh-cn":
    case "zh-hans":
      return bt;
    case "zh-tw":
    case "zh-hk":
    case "zh-mo":
    case "zh-hant":
      return $t;
    case "en":
    case "en-us":
      return Mt;
  }
}
const Pt = {
  async fetch(e, t) {
    try {
      return Ee(t, Ut), await Ct(e) || new Response("NOTFOUND", { status: 404 });
    } catch (n) {
      return console.error(n), new Response(P(n), { status: 500 });
    }
  }
};
export {
  Pt as default
};
