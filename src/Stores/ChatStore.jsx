import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import create from "zustand";
import { persist } from "zustand/middleware";

const useChatStore = create(
  persist(
    produce((set) => ({
      activate: false,
      setActivate: (value) => set(() => ({ activate: value })),
      username: "",
      setUsername: (value) => set(() => ({ username: value })),
      history: undefined,
      setHistory: (history) =>
        set(() => ({
          history: history,
        })),
    })), { name: "chat-store" }
  )
);

export default useChatStore;


if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('ChatStore', useChatStore);
}
