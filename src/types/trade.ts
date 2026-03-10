export type PokemonVariant = "normal" | "shiny";

export type PokemonTag = "lucky" | "costume" | "dynamax" | "gigantamax";

export interface PokemonForm {
  name: string; // e.g. "venusaur-mega"
  displayName: string; // e.g. "Venusaur Mega"
  spriteUrl: string;
  shinyUrl: string;
}

export interface PokemonInfo {
  id: number;
  name: string;
  displayName: string;
  spriteUrl: string;
  types: string[];
  variant: PokemonVariant;
  tags: PokemonTag[];
  /** If this is an alternate form, the base species name */
  baseName?: string;
  /** Available related forms (Mega, Gmax, Alolan, Galarian, etc.) */
  forms?: PokemonForm[];
}

export interface Trade {
  id: string;
  ingameName: string;
  redditName?: string;
  date: string;
  notes?: string;
  theirPokemon: PokemonInfo;
  myPokemon: PokemonInfo;
  status: "planned" | "completed" | "cancelled";
}
