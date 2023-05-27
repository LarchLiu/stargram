import { NodeInterface, TextInterface, defineNode } from 'baklavajs'

export const DisplayNode = defineNode({
  type: 'DisplayNode',
  title: 'Display',
  inputs: {
    value: () => new NodeInterface('Value', ''),
  },
  outputs: {
    display: () => new TextInterface('Display', ''),
  },
  calculate({ value }) {
    return {
      display: typeof value === 'number' ? (value as number).toFixed(3) : String(value),
    }
  },
})
