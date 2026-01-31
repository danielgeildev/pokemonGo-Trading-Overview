import { db } from "@/lib/db";
import { Pokemon } from "@/lib/pokemon";
import React from "react";

export function usePokemon () {
    const [pokemon, setPokemon] = React.useState<Pokemon>();



    return {pokemon, setPokemon}
}