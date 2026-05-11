import { computed, readonly, ref } from "vue";

const config = {
  melds: {
    run: 150,
    marriage: 20,
    "royal-marriage": 40,
    aces: 100,
    kings: 80,
    queens: 60,
    jacks: 40,
    pinochle: 40,
    dix: 10,
  },
  doubleMelds: {
    pinochle: 300,
  },
  tricks: {
    "last-trick": 10,
    ace: 11,
    ten: 10,
    king: 4,
    queen: 3,
    jack: 2,
  },
};

export type PinochleMeld = keyof (typeof config)["melds"];

export type PinochleEvent =
  | { type: "meld"; player: 0 | 1; meld: PinochleMeld }
  | {
      type: "trick";
      player: 0 | 1;
      "last-trick": boolean;
      ace: number;
      ten: number;
      king: number;
      queen: number;
      jack: number;
    };

const events = ref<PinochleEvent[]>([]);

const undoHistory = ref<PinochleEvent[]>([]);
function pushEvent(event: PinochleEvent) {
  undoHistory.value = [];
  events.value.push(event);
}
const canUndo = computed(() => events.value.length > 0);
function undoEvent() {
  const event = events.value.pop();
  if (!event) return;
  undoHistory.value.push(event);
}
const canRedo = computed(() => undoHistory.value.length > 0);
function redoEvent() {
  const event = undoHistory.value.pop();
  if (!event) return;
  events.value.push(event);
}

const scores = computed(() => {
  const scores = [0, 0];
  for (const event of events.value) {
    switch (event.type) {
      case "meld":
        // need to account for r.marriage+run and d.pinochle rules later
        scores[event.player]! += config.melds[event.meld];
        break;
      case "trick":
        if (event["last-trick"]) {
          scores[event.player]! += config.tricks["last-trick"];
        }
        scores[event.player]! += event.ace * config.tricks.ace;
        scores[event.player]! += event.ten * config.tricks.ten;
        scores[event.player]! += event.king * config.tricks.king;
        scores[event.player]! += event.queen * config.tricks.queen;
        scores[event.player]! += event.jack * config.tricks.jack;
        break;
    }
  }
  return scores;
});

export const useState = () => {
  return {
    events: readonly(events),
    scores,
    pushEvent,
    undoEvent,
    redoEvent,
    canUndo,
    canRedo,
  };
};
