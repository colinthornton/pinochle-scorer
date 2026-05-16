import { computed, readonly } from "vue";
import { useLocalStorage } from "./local_storage";

export type PinochleMeld =
  | "run"
  | "marriage"
  | "royal-marriage"
  | "aces"
  | "kings"
  | "queens"
  | "jacks"
  | "pinochle"
  | "dix";
export type PinochleMeldSubtype = "promote" | "double";
export type PinochleTrick =
  | "last-trick"
  | "ace"
  | "ten"
  | "king"
  | "queen"
  | "jack";
export type PinochleConfig = {
  melds: Record<
    PinochleMeld,
    [number, Partial<Record<PinochleMeldSubtype, number>>]
  >;
  tricks: Record<PinochleTrick, number>;
};

const config: PinochleConfig = {
  melds: {
    run: [150, { promote: 110 }],
    marriage: [20, {}],
    "royal-marriage": [40, {}],
    aces: [100, {}],
    kings: [80, {}],
    queens: [60, {}],
    jacks: [40, {}],
    pinochle: [40, { double: 260 }],
    dix: [10, {}],
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

export type PinochleEvent =
  | {
      type: "meld";
      player: 0 | 1;
      meld: PinochleMeld;
      subtype?: PinochleMeldSubtype;
    }
  | {
      type: "trick";
      player: 0;
      "last-trick": number;
      ace: number;
      ten: number;
      king: number;
      queen: number;
      jack: number;
    };
export type PinochleEventScored = PinochleEvent & { score: number };

const events = useLocalStorage<PinochleEventScored[]>("state_events", []);

const undoHistory = useLocalStorage<PinochleEventScored[]>(
  "state_undo_history",
  [],
);
function pushEvent(event: PinochleEvent) {
  let scoredEvent: PinochleEventScored | null = null;
  if (event.type === "meld") {
    const [score, subscores] = config.melds[event.meld];
    if (event.subtype && Object.hasOwn(subscores, event.subtype)) {
      scoredEvent = { ...event, score: subscores[event.subtype]! };
    } else {
      scoredEvent = { ...event, score };
    }
  } else if ((event.type = "trick")) {
    const score =
      config.tricks["last-trick"] * event["last-trick"] +
      config.tricks.ace * event.ace +
      config.tricks.ten * event.ten +
      config.tricks.king * event.king +
      config.tricks.queen * event.queen +
      config.tricks.jack * event.jack;
    scoredEvent = { ...event, score };
  }
  if (!scoredEvent) return;
  if (undoHistory.value.length > 0) {
    undoHistory.value = [];
  }
  events.value.push(scoredEvent);
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
    if (event.type === "meld") {
      scores[event.player]! += event.score;
    } else if (event.type === "trick") {
      scores[0]! += event.score;
      scores[1]! +=
        config.tricks["last-trick"] +
        config.tricks.ace * 8 +
        config.tricks.ten * 8 +
        config.tricks.king * 8 +
        config.tricks.queen * 8 +
        config.tricks.jack * 8 -
        event.score;
    }
  }
  return scores;
});

export const useState = () => {
  return {
    config: readonly(config),
    events: readonly(events),
    scores,
    pushEvent,
    undoEvent,
    redoEvent,
    canUndo,
    canRedo,
  };
};
