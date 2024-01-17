import { Cryption } from '@stargram/core/utils'

export const appName = 'Stargram'
export const appDescription = 'Manage all your Starred Pages'
export const DEFAULT_OG_IMAGE = 'https://kiafhufrshqyrvlpsdqg.supabase.co/storage/v1/object/public/pics-bed/stargram.png?v=stargramogimage'
export const DEFAULT_STARGRAM_HUB = 'https://stargram.cc'
export const C1 = 26739
export const C2 = 59874
export const cryption = new Cryption(C1, C2)
