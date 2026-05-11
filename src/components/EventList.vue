<script setup lang="ts">
import { useState, type PinochleEvent } from "@/composables/state";
import { computed } from "vue";

const { events } = useState();
const timeline = computed(() => {
  const timeline: PinochleEvent[] = new Array(events.value.length);
  events.value.forEach((event, i) => {
    timeline[events.value.length - i - 1] = event;
  });
  return timeline;
});

const label = {
  run: "Run",
  marriage: "Marriage",
  "royal-marriage": "Royal Marriage",
  aces: "Aces Around",
  kings: "Kings Around",
  queens: "Queens Around",
  jacks: "Jacks Around",
  pinochle: "Pinochle",
  dix: "Dix",
};
</script>

<template>
  <div>
    <p v-for="event in timeline">
      <template v-if="event.type === 'meld'"
        >P{{ event.player }} melded {{ label[event.meld] }}</template
      >
      <template v-if="event.type === 'trick'"
        >P{{ event.player }} took
        {{ event["last-trick"] ? "the last trick and" : "" }} {{ event.ace }} A,
        {{ event.ten }} T, {{ event.king }} K, {{ event.queen }} Q, and
        {{ event.jack }} J</template
      >
    </p>
  </div>
</template>
