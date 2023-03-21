import produce from "immer";
import create from "zustand";
import { mountStoreDevtool } from 'simple-zustand-devtools';

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


if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('BroadcastStore', useBroadcastStore);
}
