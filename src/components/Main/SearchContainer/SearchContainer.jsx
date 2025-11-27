import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./Search/Search";
import PokemonList from "./PokemonList/PokemonList";

const SearchContainer = () => {
  const [value, setValue] = useState(""); // Para guardar el dato a buscar
  const [pokemons, setPokemons] = useState([]); // Para guardar los pokemons

  useEffect(() => {
    if (!value) return; // No hacer la petición si no hay valor
    async function fetchData() {
      try {
        const res = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`
        );
        setPokemons([res.data]);
      } catch (e) {
        setPokemons([]); // No mostrar nada si hay error
      }
    }

    fetchData();
  }, [value]);

  return (
    <section>
      <Search setValue={setValue} />
      <PokemonList pokemons={pokemons} />
    </section>
  );
};

export default SearchContainer;
