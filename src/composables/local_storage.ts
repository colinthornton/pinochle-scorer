import { ref, watch } from "vue";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const storedValue = read();
  if (storedValue === undefined) {
    return initialize(initialValue);
  } else {
    return initialize(storedValue);
  }

  function initialize(initialValue: T) {
    const value = ref(initialValue);
    watch(value, (v) => write(v), { deep: true, immediate: true });
    return value;
  }

  function read() {
    try {
      const json = window.localStorage.getItem(key);
      if (typeof json !== "string") return undefined;
      const parsed = JSON.parse(json) as T;
      return parsed;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  function write(value: T) {
    try {
      const json = JSON.stringify(value);
      window.localStorage.setItem(key, json);
    } catch (error) {
      console.error(error);
    }
  }
};
