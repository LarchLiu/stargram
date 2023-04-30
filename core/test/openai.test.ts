import { describe, expect, test } from 'vitest'
import { summarizeContent } from '~/openai'

const webInfo = {
  domain: 'github.com',
  website: 'Github',
  title: 'star-nexus',
  content: `haibbo: Azure OpenAI 团队在搞事情, 10天前他们刚刚修复了GPT-3.5的打印机和结束符问题, 今天不知道为什么代码又回滚了. 😓

  使用最新的 cf-openai-azure-proxy 解决这些问题, 加个 ✨不迷路 😄
  
  https://github.com/haibbo/cf-openai-azure-proxy
  lewang🍥: 👍，我正需要一个这样的 Cloudflare Worker：把微软 Azure  上免费的  OpenAI 服务接口转为 OpenAI API，让支持  OpenAI API 的客户端也能使用 Azure 上部署的 GPT3.5/4 模型，我试了一下 OpenCat 和 AMA，都可以使用。 https://t.co/vEJtV0cPtW
  Jintao Zhang: 要申请 #Azure OpenAI Service #GPT-4, 需要以下条件：
  
  * Azure 国际版
  * 开通 Azure OpenAI Service: https://aka.ms/oai/access 
  * 开通 GPT-4: https://aka.ms/oai/get-gpt4
  
  现在审核感觉速度快了很多 https://t.co/yV5bRcZf7p
  lewang🍥: Azure 的 OpenAI 服务申请参考这里
  ShīnChvën 🧑🏻‍💻: Azure OpenAI Service + ChatBox 极尽丝滑的体验
  
  我写了一份心得来记录如何注册、申请和配置
  https://atlassc.net/2023/04/25/azure-openai-service https://t.co/FarEwp7rmx
  lewang🍥: 这篇博客把 Azure OpenAI 服务注册申请配置过程都做了说明
  Kevin: @lewangdev 才办了万事达卡支付通道，😄
  lewang🍥: @Kevinlitte3 留着 OpenAI 的账号，先用 Azure 送的额度
  Gavin Cruz: @lewangdev @haibbo_real 有open cat链接的教程吗
  lewang🍥: @GavinCruz147987 填上自己的 azure 上生成的 key 和自己的域名就行
  99yio: @lewang...`,
  url: 'https://github.com/LarchLiu/star-nexus',
}
describe('openai', () => {
  test('get summarize', async () => {
    const res = await summarizeContent(import.meta.env.VITE_OPENAI_API_KEY, webInfo)
    expect(res.data?.summary).toBeDefined()
    expect(res.data?.categories).toBeDefined()
    // expect(res)?.toMatchSnapshot()
  }, 20000)
})
