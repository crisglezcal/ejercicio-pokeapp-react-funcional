import React from "react";

const PokemonCard = ({pokemon}) => {
  return <article>
      <h3>{pokemon.name}</h3>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
    </article>
};

export default PokemonCard;
