<script setup lang="ts">
import Button from "primevue/button";
import ButtonGroup from "primevue/buttongroup";
import EventList from "./components/EventList.vue";
import MeldControls from "./components/MeldControls.vue";
import TrickControls from "./components/TrickControls.vue";
import { useState } from "./composables/state";

const { scores, pushEvent, canUndo, undoEvent, canRedo, redoEvent } =
  useState();
</script>

<template>
  <div class="scores">
    <span>{{ scores[0] }}</span>
    <span>{{ scores[1] }}</span>
  </div>
  <div class="controls">
    <ButtonGroup class="undoredo">
      <Button icon="pi pi-replay" :disabled="!canUndo" @click="undoEvent" />
      <Button
        class="redo"
        icon="pi pi-replay"
        :disabled="!canRedo"
        :pt="{ icon: { style: { scale: '-1 1' } } }"
        @click="redoEvent"
      />
    </ButtonGroup>
    <MeldControls
      @meld="
        (meld, subtype) => pushEvent({ type: 'meld', player: 0, meld, subtype })
      "
    />
    <MeldControls
      @meld="
        (meld, subtype) => pushEvent({ type: 'meld', player: 1, meld, subtype })
      "
    />
    <TrickControls class="trick-controls" />
    <!-- <EventList /> -->
  </div>
</template>

<style>
body {
  font-family: monospace;
}
</style>

<style scoped>
.scores {
  font-family: sans-serif;
  font-size: xxx-large;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 2em;
}

.undoredo {
  grid-column: span 2;
  justify-self: center;
}

.trick-controls {
  grid-column: span 2;
  justify-self: center;
}
</style>
