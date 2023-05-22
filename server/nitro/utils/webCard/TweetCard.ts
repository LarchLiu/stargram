export function TweetCard(props: { avatar: string; name: string; screenName: string; content: string[]; pubTime: string; lang?: string }) {
  const { avatar, name, screenName, content, pubTime, lang } = props
  const language = lang ?? 'zh-CN'
  const divContent = content.map((c) => {
    return `<div class="flex" lang="${language}">
    ${c}
    </div>
    `
  })
  return `
  <div class="h-full w-full flex flex-col justify-between bg-white p-60px text-60px">
    <div class="flex flex-col">
      <div class="flex items-center">
        <img
          alt="avatar"
          width="120"
          height="120"
          src="${avatar}"
          class="rounded-full"
        />
        <div class="ml-20px flex flex-col text-40px">
          <div class="flex" lang="${language}">${name}</div>
          <div class="flex" lang="${language}">@${screenName}</div>
        </div>
      </div>

      <div class="h-320px flex flex-col overflow-hidden pt-30px text-30px">
        ${divContent.join('')}
      </div>
    </div>
    <div class="flex items-center justify-between text-24px text-[#1DA1F2]">
      <span class="text-[#586069]">${pubTime}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32"><path fill="currentColor" d="M11.547 25.752c9.057 0 14.01-7.503 14.01-14.01c0-.213 0-.425-.014-.636A10.017 10.017 0 0 0 28 8.556a9.827 9.827 0 0 1-2.828.776a4.942 4.942 0 0 0 2.164-2.724a9.866 9.866 0 0 1-3.126 1.195a4.929 4.929 0 0 0-8.392 4.491A13.98 13.98 0 0 1 5.67 7.15a4.928 4.928 0 0 0 1.525 6.573a4.887 4.887 0 0 1-2.235-.617v.063a4.926 4.926 0 0 0 3.95 4.827a4.917 4.917 0 0 1-2.223.084a4.93 4.93 0 0 0 4.6 3.42A9.88 9.88 0 0 1 4 23.54a13.94 13.94 0 0 0 7.547 2.209" /></svg>
    </div>
  </div>
`
}
