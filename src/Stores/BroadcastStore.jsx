import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import create from "zustand";

const useBroadcastStore = create(
  produce((set) => ({
    isPlaying: false,
    setIsPlaying: (value) => set(() => ({ isPlaying: value })),
    playing: undefined,
    setPlaying: (uid) =>
      set(() => ({
        playing: uid,
      })),
    currentBroadcast: undefined,
    setCurrentBroadcast: (broadcast) =>
      set(() => ({
        currentBroadcast: broadcast,
      })),
    nextBroadcast: undefined,
    setNextBroadcast: (broadcast) =>
      set(() => ({
        nextBroadcast: broadcast,
      })),
  }))
);

export default useBroadcastStore;


if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('BroadcastStore', useBroadcastStore);
}
