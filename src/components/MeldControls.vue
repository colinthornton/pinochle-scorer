<script setup lang="ts">
import {
  useState,
  type PinochleMeld,
  type PinochleMeldSubtype,
} from "@/composables/state";
import Button from "primevue/button";
import type { MenuItem } from "primevue/menuitem";
import SplitButton from "primevue/splitbutton";

const emit = defineEmits<{
  meld: [meld: PinochleMeld, subtype?: PinochleMeldSubtype];
}>();

const { config } = useState();

const melds = Object.keys(config.melds) as PinochleMeld[];
const labels = {
  run: "Run",
  marriage: "Marriage",
  "royal-marriage": "R. Marriage",
  aces: "Aces",
  kings: "Kings",
  queens: "Queens",
  jacks: "Jacks",
  pinochle: "Pinochle",
  dix: "Dix",
  promote: "Promote",
  double: "Double",
};
const buttons = melds.map((meld) => {
  const menuItems: MenuItem[] = Object.keys(config.melds[meld][1]).map(
    (subtype) => ({
      label: labels[subtype as PinochleMeldSubtype],
      command: () => emit("meld", meld, subtype as PinochleMeldSubtype),
    }),
  );
  const component = menuItems.length > 0 ? SplitButton : Button;
  const label = labels[meld];
  const command = () => emit("meld", meld);
  return { component, menuItems, label, command };
});
</script>

<template>
  <div class="meld-controls">
    <template v-for="b in buttons">
      <component
        :is="b.component"
        :label="b.label"
        :model="b.menuItems"
        fluid
        @click="b.command"
      />
    </template>
  </div>
</template>

<style scoped>
.meld-controls {
  display: grid;
  justify-content: center;
  gap: 1em;
}
</style>
