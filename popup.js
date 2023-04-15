document.getElementById("saveButton").addEventListener("click", async () => {
  // 延迟以确保 content script 已加载
  await new Promise((resolve) => setTimeout(resolve, 100));

  // 向 content script 发送消息，请求保存操作
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "saveToNotion" }, (response) => {
      const statusElement = document.getElementById("status");
      if (chrome.runtime.lastError) {
        statusElement.textContent = `Error: 保存失败, ${chrome.runtime.lastError.message}`;
      } else {
        if (response && response.message) {
          statusElement.textContent = `当前状态: ${response.message}`;
        }
      }
      
      // setTimeout(() => {
      //   statusElement.textContent = "";
      // }, 3000);
    });
  });
});

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.action === "saveToNotionFinish") {
    const statusElement = document.getElementById("status");
    if (request.data.err) {
      statusElement.textContent = `Error: 保存失败, ${request.data.message}`;
    } else {
      statusElement.textContent = "成功保存至 Notion";
    }
    setTimeout(() => {
      statusElement.textContent = "";
    }, 3000);
  }
  return true
});
