export const filter: Filter = {
  genres: [],
  moods: [],
  tempos: [],
  variance: 5, // 0-9 (0 tight, 9 go wild)
  history: [],
  hosts: [],
  currentBroadcast: null,
};

export type Filter = {
  genres: string[];
  moods: string[];
  tempos: number[];
  variance: number;
  history: BroadcastRefernce[];
  hosts: ShowReference[];
  currentBroadcast: BroadcastRefernce | null;
};

export type BroadcastRefernce = {
  prismicId: string;
  title: string;
  host: ShowReference;
  alias: string;
  score: number; // 0-9 (0 didn't like it, 9 loved it)
};

export type ShowReference = {
  prismicId: string;
  name: string;
  alias: string;
  score: number; // 0-9 (0 exclude host, 9 must play)
};
