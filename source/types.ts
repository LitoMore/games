export type Game = {
  name: string;
  website: string;
};

export type Device = {
  name: string;
  anchor: string;
  badge: string;
  hostnames: string[];
  gameList: Game[];
};
