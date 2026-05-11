<script setup lang="ts">
import type { PinochleMeld } from "@/composables/state";
import Button from "primevue/button";

defineEmits<{ meld: [value: PinochleMeld] }>();

const buttons: { label: string; meld: PinochleMeld }[] = [
  { label: "Run", meld: "run" },
  { label: "Marriage", meld: "marriage" },
  { label: "R. Marriage", meld: "royal-marriage" },
  { label: "Aces", meld: "aces" },
  { label: "Kings", meld: "kings" },
  { label: "Queens", meld: "queens" },
  { label: "Jacks", meld: "jacks" },
  { label: "Pinochle", meld: "pinochle" },
  { label: "Dix", meld: "dix" },
];
</script>

<template>
  <div class="meld-controls">
    <Button
      v-for="b in buttons"
      :label="b.label"
      @click="$emit('meld', b.meld)"
    />
  </div>
</template>

<style scoped>
.meld-controls {
  display: grid;
  justify-content: center;
  gap: 1em;
}
</style>
