import {
  NodeInterface,
  SelectInterface,
  TextInputInterface,
  defineNode,
} from 'baklavajs'

export const MathNode = defineNode({
  type: 'MathNode',
  title: 'Math',
  inputs: {
    operation: () =>
      new SelectInterface('Operation', 'Add', ['Add', 'Subtract']).setPort(
        false,
      ),
    num1: () => new TextInputInterface('Num 1', '1'),
  },
  outputs: {
    result: () => new NodeInterface('Output', 0),
  },
})
