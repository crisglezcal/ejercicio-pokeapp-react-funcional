import React, {useState} from "react";

const Search = ({setValue}) => {

  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setValue(input); // Actualizamos el estado en SearchContainer
    }
  };

  return <section>
              <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Busca un Pokémon"
      />
      <button type="submit">Buscar</button>
    </form>
          </section>;;
};

export default Search;
