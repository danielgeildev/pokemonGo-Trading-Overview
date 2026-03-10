export interface PokemonInfo {
  id: number;
  name: string;
  displayName: string; // Capitalized name
  spriteUrl: string;
  types: string[];
}

export interface Trade {
  id: string;
  traderName: string;
  date: string; // ISO string
  notes?: string;
  // What the trader offers (what I receive)
  theirPokemon: PokemonInfo;
  // What I offer (what I give)
  myPokemon: PokemonInfo;
  status: "planned" | "completed" | "cancelled";
}
