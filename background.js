const extensionId = "eihlalofpohbomlblfaolifmamalkgaa";
const sendResponseToPopup = (res) => {
  chrome.runtime.sendMessage({
    action: "saveToNotionFinish",
    data: res,
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  let apiKey, databaseId
  const result = await chrome.storage.sync.get(["notionApiKey", "notionDatabaseId"]);
  apiKey = result.notionApiKey ?? '';
  databaseId = result.notionDatabaseId ?? '';
  chrome.storage.sync.set({ notionApiKey: apiKey, notionDatabaseId: databaseId });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "saveToNotion") {
    if (request.data) {
      const { title, url, category, summary } = request.data;
      saveToNotion(title, url, category, summary).then((res) => {
        console.log(res)
        sendResponseToPopup(res);
      }).catch(err => {
        sendResponseToPopup({ message: err.message, error: true });
      })
      sendResponse({ message: 'handling save to notion' })
    } else {
      console.error("Error: request.data is undefined.");
      sendResponse({ message: "Error: request.data is undefined.", error: true });
    }
  }
  return true
});

async function saveToNotion(title, url, category, summary) {
  return new Promise(async (resolve, reject) => {
    let apiKey, databaseId;
    try {
      // 获取 Notion API 密钥和数据库 ID
      const result = await chrome.storage.sync.get(["notionApiKey", "notionDatabaseId"]);
      apiKey = result.notionApiKey ?? '';
      databaseId = result.notionDatabaseId ?? '';
      if (!apiKey || !databaseId) {
        console.error("Missing Notion API key or Database ID in settings.");
        return reject({ message: 'Missing Notion API key or Database ID in settings.', error: true });
      }
  
      // 创建 Notion 页面并保存信息
      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
          "Authorization": `Bearer ${apiKey}`,
          "Access-Control-Allow-Origin": `chrome-extension://${extensionId}`,
        },
        body: JSON.stringify({
          parent: {
            database_id: databaseId,
          },
          properties: {
            Title: {
              title: [
                {
                  text: {
                    content: title,
                  },
                },
              ],
            },
            Summary: {
              rich_text: [
                {
                  text: {
                    content: summary,
                  },
                },
              ],
            },
            URL: {
              url: url,
            },
            Category: {
              rich_text: [
                {
                  text: {
                    content: category,
                  },
                }
              ]
            }
          },
        }),
      });
  
      if (!response.ok) {
        return reject({ message: 'Error creating new page in Notion.', error: true });
      } else {
        console.log("Created new page in Notion successfully!");
        const newPageResponse = await response.json();
        const newPageId = newPageResponse.id; // 获取新页面的 ID
  
        const imageBlock = {
          object: "block",
          type: "paragraph", 
          paragraph: {
            "rich_text": [
              { 
                "type": "text", 
                "text": { 
                  "content": "- Notion API Team", 
                  "link": { 
                    "type": "url", 
                    "url": "https://twitter.com/NotionAPI" 
                  } 
                } 
              }]
          }
        };
  
        const addChildResponse = await fetch(
          `https://api.notion.com/v1/blocks/${newPageId}/children`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Notion-Version": "2022-06-28",
              "Authorization": `Bearer ${apiKey}`,
              "Access-Control-Allow-Origin": `chrome-extension://${extensionId}`,
            },
            body: JSON.stringify({
              children: [imageBlock],
            }),
          }
        );
  
        if (!addChildResponse.ok) {
          return reject({ message: 'Error appending child block to Notion page.', error: true })
        } else {
          console.log("Appended child block to Notion page successfully!");
          return resolve({ message: 'Data saved successfully.' })
        }
      }
    } catch (error) {
      console.error("Error saving to Notion:", error);
      return reject({ message: 'Error saving to Notion.', error: true });
    }
  })
}



