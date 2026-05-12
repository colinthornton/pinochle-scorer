<script setup lang="ts">
import { useState } from "@/composables/state";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import RadioButton from "primevue/radiobutton";
import { ref } from "vue";

const showDialog = ref(false);
function openDialog() {
  p0.value = { ...initial };
  showDialog.value = true;
}

type PlayerInput = {
  "last-trick": number;
  ace: number;
  ten: number;
  king: number;
  queen: number;
  jack: number;
};
type CardKey = Exclude<keyof PlayerInput, "last-trick">;

const initial = {
  "last-trick": 1,
  ace: 4,
  ten: 4,
  king: 4,
  queen: 4,
  jack: 4,
};

const p0 = ref<PlayerInput>(initial);

function increment(key: CardKey) {
  const curr = p0.value[key];
  p0.value[key] = Math.min(curr + 1, 8);
}
function decrement(key: CardKey) {
  const curr = p0.value[key];
  p0.value[key] = Math.max(curr - 1, 0);
}

const cardKeys: CardKey[] = ["ace", "ten", "king", "queen", "jack"];

const label = {
  ace: "Aces",
  ten: "Tens",
  king: "Kings",
  queen: "Queens",
  jack: "Jacks",
};

const { pushEvent } = useState();
function submit() {
  pushEvent({
    type: "trick",
    player: 0,
    ...p0.value,
  });
  showDialog.value = false;
}
</script>

<template>
  <div>
    <Button label="Score Tricks" @click="openDialog" />

    <Dialog
      v-model:visible="showDialog"
      modal
      dismissable-mask
      :show-header="false"
    >
      <div class="modal">
        <RadioButton
          v-model="p0['last-trick']"
          name="last-trick"
          :value="1"
          :pt="{ root: { style: { marginInline: 'auto' } } }"
        />
        <label>Last Trick</label>
        <RadioButton
          v-model="p0['last-trick']"
          name="last-trick"
          :value="0"
          :pt="{ root: { style: { marginInline: 'auto' } } }"
        />

        <template v-for="key in cardKeys">
          <Button
            :label="String(p0[key])"
            icon="pi pi-plus"
            icon-pos="left"
            severity="secondary"
            @click="increment(key)"
          />
          <label>{{ label[key] }}</label>
          <Button
            :label="String(8 - p0[key])"
            icon="pi pi-plus"
            icon-pos="right"
            severity="secondary"
            @click="decrement(key)"
          />
        </template>

        <Button class="submit" label="Score" @click="submit" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.input-group {
  display: grid;
  grid-auto-flow: row;
}

.modal {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1em;
  padding-block-start: var(--p-overlay-modal-padding);
  text-align: center;
}

.submit {
  grid-column: span 3;
  justify-self: center;
}
</style>
