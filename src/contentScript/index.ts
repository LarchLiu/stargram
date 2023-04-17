// console.log('Content script loaded.')

// const observer = new MutationObserver((mutationsList) => {
//   for (const mutation of mutationsList) {
//     if (mutation.type === 'childList') {
//       // 在此处添加您希望在 DOM 变化时执行的代码
//       const jobPage = document.querySelector("#jobPage");
//       if (jobPage) {
//         // 添加事件监听器
//         const saveButton = document.querySelector('#saveButton');
//         if (saveButton) {
//           saveButton.removeEventListener('click', handleSaveToNotion);
//           saveButton.addEventListener('click', handleSaveToNotion);
//         }
//       }
//     }
//   }
// });

// const config = { childList: true, subtree: true };

// observer.observe(document.body, config);

function getDataFromPage() {
  const title = document.title
  const url = location.href
  const category = 'Github, Issue'
  const summary = 'test hot reload no.123'

  // const jobPage = document.getElementById("jobPage");
  // console.log("jobPage:", jobPage);
  // const imageContainer = jobPage.querySelector(".relative.h-auto.w-full.false, .relative.h-auto.w-full.overflow-hidden");
  // console.log("imageContainer:", imageContainer);
  // const imageElements = imageContainer.querySelectorAll("img");
  // let imageUrl = "";

  // for (const imageElement of imageElements) {
  //   const src = imageElement.src;
  //   if (src.startsWith("https://cdn.midjourney.com/")) {
  //     imageUrl = src.replace("_32_N.webp", ".png");
  //     break;
  //   }
  // }

  // const prompt = jobPage.querySelector(".first-letter\\:capitalize").innerText;
  // const property = jobPage.querySelector(".line-clamp-1:not(.break-all)").innerText;

  return { title, url, category, summary }
}

function handleSaveToNotion() {
  // console.log('Handling save to Notion in the content script')
  const { title, url, category, summary } = getDataFromPage()

  chrome.runtime.sendMessage(
    {
      action: 'saveToNotion',
      data: { title, url, category, summary },
    },
    (response) => {
      if (chrome.runtime.lastError) {
        // console.log(chrome.runtime.lastError)
      }
      else {
        // console.log(response)
      }
    },
  )
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'saveToNotion') {
    handleSaveToNotion()
    sendResponse({ message: 'Handling save to Notion in the content script', error: false })
  }
  else {
    sendResponse({ message: 'Unknow action', error: true })
  }
  return true // 添加这一行以确保响应可以在异步操作完成后发送
})
