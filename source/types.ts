export type Game = {
  name: string;
  website: string;
};

export type Platform = {
  name: string;
  anchor: string;
  duplication?: true | { website?: string[] };
  badge: string;
  hostnames: string[];
  gameList: Game[];
};

export type Related = {
  name: string;
  website: string;
  description: string;
}[];

export type GamesJson = {
  platforms: Platform[];
  related: Related[];
};
