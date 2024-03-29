import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import create from "zustand";

const useBroadcastStore = create(
  produce((set, get) => ({
    canPlay: true,
    setCanPlay: (value) => set(() => ({ canPlay: value })),
    isPlaying: false,
    setIsPlaying: (value) => set(() => ({ isPlaying: value })),
    isVisible: false,
    setIsVisible: (value) => set(() => ({ isVisible: value })),
    rotationInfo: null,
    setRotationInfo: (info) => set(() => ({ rotationInfo: info })),
    isStreaming: () => {
      if (get().rotationInfo !== undefined) return true;
      return false;
    },
    isLive: () => {
      if (get().currentBroadcast !== undefined && get().nextBroadcast !== undefined) return true;
      return false;
    },
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
