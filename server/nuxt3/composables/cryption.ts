import { Cryption } from '@stargram/core/utils'

export function useCryption() {
  const runtimeConfig = useRuntimeConfig()
  const C1 = Number.parseInt(runtimeConfig.public.CRYPTION_C1 || '1234')
  const C2 = Number.parseInt(runtimeConfig.public.CRYPTION_C2 || '1234')

  return new Cryption(C1, C2)
}
