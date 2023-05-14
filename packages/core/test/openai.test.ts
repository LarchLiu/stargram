import { describe, expect, test } from 'vitest'
import { summarizeContent } from '../src/openai'
import type { WebInfoData } from '../src/types'

const webInfo: WebInfoData = {
  title: 'star-nexus',
  content: 'Alex Liu: I\'m excited to share my new project, Poto powered by @vuejs and @vite_js. It\'s an open source, low-code platform for designer. ❤️Thanks to @vuejs @vite_js @VueUse #Pinia @turborepo @vercel, so many powerful tools. 🙌Some images designed by Poto. https://github.com/LarchLiu/poto https://t.co/LxhL1fi0k9 Alex Liu: @vuejs @vite_js @VueUse @turborepo @vercel Features 📋 Templates for tutorials 📽 Record and Replay the process of creating template 💾 Reusable custom blocks 🏞 Export to image 🧩 Custom plugins 🛠 Use data from REST API or JavaScript snippet 🟧 Built-in themes #VueJS #VITE https://poto-vue.vercel.app/ Alex Liu: @vuejs @vite_js @VueUse @turborepo @vercel 📋 Templates for tutorials There are some built-in templates and they are also used as tutorials for new users. Moreover, we can replay the process of creating template.👇 Alex Liu: @vuejs @vite_js @VueUse @turborepo @vercel 📽 Record and Replay the process of creating template It would be friendly for new users if there were some tutorials. We always use videos as tutorials, but if the tutorials were built into the site itself it would be much clearer to see each step. That would be wonderful! https://t.co/lnkMBeJ549 Alex Liu: @vuejs @vite_js @VueUse @turborepo @vercel The following video shows how to record, save, reload and replay templates. @antfu7 @sanxiaozhizi https://t.co/5pgbOVSys2',
  url: 'https://github.com/LarchLiu/star-nexus',
  meta: {
    domain: '',
    siteName: '',
    prompts: 'The Github repo info',
  },
}
describe('openai', () => {
  test('summarize in zh-CN', async () => {
    const res = await summarizeContent(import.meta.env.VITE_OPENAI_API_KEY, webInfo, 'zh-CN')
    expect(res.summary).toBeDefined()
    expect(res.categories).toBeDefined()
    // expect(res)?.toMatchSnapshot()
  })
  test('summarize in en', async () => {
    const res = await summarizeContent(import.meta.env.VITE_OPENAI_API_KEY, webInfo, 'en')
    expect(res.summary).toBeDefined()
    expect(res.categories).toBeDefined()
    // expect(res)?.toMatchSnapshot()
  })
})
