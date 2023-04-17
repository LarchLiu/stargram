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

async function getDataFromPage() {
  const title = document.title
  const url = location.href
  let category = 'Github'
  let summary = 'test hot reload no.123'
  const host = location.host
  if (host === 'github.com') {
    const path = location.pathname
    const readmeEl = document.getElementById('readme')
    const titleArr = title.split(':')
    let about = ''
    if (titleArr.length > 1) {
      titleArr.shift()
      about = titleArr.join(':')
    }

    if (readmeEl) {
      const branchMenu = document.getElementById('branch-select-menu')
      const branchEl = branchMenu.querySelector('.css-truncate-target') as HTMLElement
      const branch = (branchEl && branchEl.innerText) ? branchEl.innerText : 'main'
      const readmePath = `https://raw.githubusercontent.com/${path}/${branch}/README.md`
      // fetch readme
      const res = await fetch(readmePath)
      const readme = await res.text()
      const apiKey = ''

      const openaiRes = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: `Summarize this then categorize this, categories should divided by punctuation \',\', return the summary and categories like this:\n\nSummary: my summary\n\nCategories: Github, OSS\n\n${about}\n\n${readme}`,
          max_tokens: 200,
          temperature: 0.5,
        }),
      })
      const openaiData = await openaiRes.json()
      const text = openaiData.choices[0].text
      const textArr = text.split('\n\n')
      summary = textArr[0].split(':')[1].trim()
      category = textArr[1].split(':')[1].trim()
      // console.log(category)
    }
    else {
      summary = about || title
    }
  }

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

async function handleSaveToNotion() {
  // console.log('Handling save to Notion in the content script')
  const { title, url, category, summary } = await getDataFromPage()

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
