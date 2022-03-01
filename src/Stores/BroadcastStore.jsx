import produce from "immer";
import create from "zustand";

const useBroadcastStore = create(
  produce((set) => ({
    currentBroadcast: undefined,
    setCurrentBroadcast: (broadcast) =>
      set(() => ({
        currentBroadcast: broadcast,
      })),
    broadcasts: [],
    setBroadcasts: (broadcasts) =>
      set(() => ({
        broadcasts: broadcasts,
      })),
    tags: [],
    setTags: (tags) =>
      set(() => ({
        tags: tags,
      })),
  }))
);

export default useBroadcastStore;
