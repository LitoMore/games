export type Game = {
  name: string;
  website: string;
};

export type Platform = {
  name: string;
  anchor: string;
  badge: string;
  hostnames: string[];
  gameList: Game[];
};
