import React from "react";
import PokemonCard from "./PokemonCard/PokemonCard";
import "./PokemonList.css";

const PokemonList = ( {pokemons} ) => {
 
const renderCard = () => pokemons.map(pokemon => <PokemonCard key={pokemon.id} pokemon={pokemon}/>);

  return (
    <section>
      <div className="pokemon-list-container">
       {renderCard()}
      </div>
    </section>
  );
};

export default PokemonList;
