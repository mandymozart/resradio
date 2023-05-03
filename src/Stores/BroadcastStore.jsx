import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import create from "zustand";

const useBroadcastStore = create(
  produce((set) => ({
    isPlaying: false,
    setIsPlaying: (value) => set(() => ({ isPlaying: value })),
    isLoading: false,
    setIsLoading: (value) => set(() => ({ isLoading: value })),
    error: false,
    setError: (error) => set(() => ({ error: error })),
    playing: null,
    setPlaying: (uid) =>
      set(() => ({
        playing: uid,
      })),
    /** current and next are for display in stream info */
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
