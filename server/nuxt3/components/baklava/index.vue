<script setup lang="ts">
import {
  DependencyEngine,
  EditorComponent,
  applyResult,
  useBaklava,
} from 'baklavajs'
import '@baklavajs/themes/dist/syrup-dark.css'

import { DisplayNode } from './displayNode'
import { MathNode } from './mathNode'

const baklava = useBaklava()
const engine = new DependencyEngine(baklava.editor)

baklava.editor.registerNodeType(MathNode)
baklava.editor.registerNodeType(DisplayNode)

const token = Symbol('token')
engine.events.afterRun.subscribe(token, (result) => {
  engine.pause()
  applyResult(result, baklava.editor)
  engine.resume()
})

engine.start()

// Add some nodes for demo purposes
function addNodeWithCoordinates(NodeType: new () => any, x: number, y: number) {
  const n = new NodeType()
  baklava.displayedGraph.addNode(n)
  n.position.x = x
  n.position.y = y
  return n
}
const node1 = addNodeWithCoordinates(MathNode, 300, 140)
const node2 = addNodeWithCoordinates(DisplayNode, 550, 140)
baklava.displayedGraph.addConnection(
  node1.outputs.result,
  node2.inputs.value,
)
</script>

<template>
  <div style="width: 100vw; height: 50vh">
    <EditorComponent :view-model="baklava">
      <template #toolbar>
        <div />
      </template>
      <template #palette>
        <div />
      </template>
    </EditorComponent>
  </div>
</template>

<style scoped>

</style>
