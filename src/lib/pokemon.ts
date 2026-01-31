export type Pokemon = {
    name: string;
    sprites?: {
        front_default?: string;
    };
}
export const  getPokemon = async (pokmemonName: string) => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokmemonName.toLowerCase());
    return response.json();
}