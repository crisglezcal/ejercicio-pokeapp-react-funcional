// 1️⃣ Importamos React y los hooks necesarios
  // useState: Para manejar estado local del componente
  // useEffect: Para manejar efectos secundarios (como llamadas a API)
import React, { useState, useEffect } from "react";
  // axios: Librería para hacer peticiones HTTP a APIs
import axios from "axios";
  // Importamos el componente Search que maneja la búsqueda
import Search from "./Search/Search";
  // Importamos el componente PokemonList que muestra la lista de Pokémon
import PokemonList from "./PokemonList/PokemonList";
  // Importamos nuestro contexto para acceder a los Pokémon personalizados
import { usePokemonContext } from "../context/PokemonContext";
  // Importamos los estilos CSS específicos de este componente
import "./SearchContainer.css";

// 2️⃣ Definimos nuestro componente funcional SearchContainer
  // Este componente es el "cerebro" de la búsqueda y gestión de Pokémon
const SearchContainer = () => {
  // ESTADO 1: Valor de búsqueda introducido por el usuario
    // value: string con el texto de búsqueda
    // setValue: función para actualizar el valor de búsqueda
  const [value, setValue] = useState("");
  
  // ESTADO 2: Pokémon obtenidos de la API externa (PokeAPI)
    // apiPokemons: array con Pokémon de la API
    // setApiPokemons: función para actualizar la lista
  const [apiPokemons, setApiPokemons] = useState([]);
  
  // ESTADO 3: Estado de carga para mostrar spinner/loading
    // loading: booleano que indica si está cargando datos
    // setLoading: función para cambiar el estado de carga
  const [loading, setLoading] = useState(false);
  
  // ESTADO 4: Mensajes de error para mostrar al usuario
    // error: string con el mensaje de error
    // setError: función para actualizar el error
  const [error, setError] = useState("");
  
  // Obtenemos los Pokémon personalizados desde nuestro contexto => customPokemons: array con los Pokémon creados por el usuario
  const { pokemons: customPokemons } = usePokemonContext();

  // Combinamos Pokémon de la API con Pokémon personalizados => El spread operator (...) crea un nuevo array combinando ambos
  const allPokemons = [...apiPokemons, ...customPokemons];

  // useEffect que se ejecuta cada vez que value cambia => Este efecto maneja toda la lógica de búsqueda
  useEffect(() => {
    // CASO 1: Si no hay valor de búsqueda, limpiamos errores y salimos
    if (!value) {
      setError("");
      return;
    }
    
    // CASO 2: Si el valor tiene menos de 3 caracteres, mostramos error
    if (value.length < 3) {
      setError("Escribe al menos 3 caracteres");
      return;
    }
    
    // Si pasó las validaciones, iniciamos la búsqueda
    setLoading(true);  // Activamos el estado de carga
    setError("");      // Limpiamos errores anteriores
    
    // Creamos un timeout para implementar "debounce"
    // Debounce evita hacer muchas peticiones mientras el usuario escribe
    const timeoutId = setTimeout(async () => {
      try {
        // PASO 1: Hacemos petición a la PokeAPI para obtener todos los Pokémon
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
        
        // PASO 2: Filtramos los Pokémon que coincidan con la búsqueda
          // .filter() crea un nuevo array solo con los que cumplan la condición
          // .startsWith() verifica si el nombre empieza con el texto de búsqueda
        const matchingPokemons = res.data.results.filter(pokemon => 
          pokemon.name.toLowerCase().startsWith(value.toLowerCase())
        );
        
        // PASO 3: Si no encontramos coincidencias, mostramos error
        if (matchingPokemons.length === 0) {
          setError(`No se encontraron Pokémon con "${value}"`);
          setApiPokemons([]);  // Limpiamos resultados anteriores
          return;
        }
        
        // PASO 4: Limitamos a los primeros 5 resultados para no sobrecargar
        const topResults = matchingPokemons.slice(0, 5);
        
        // PASO 5: Obtenemos los detalles completos de cada Pokémon
          // Promise.all ejecuta todas las peticiones en paralelo
        const pokemonDetails = await Promise.all(
          topResults.map(async (pokemon) => {
            try {
              // Hacemos petición a la URL específica de cada Pokémon
              const detailRes = await axios.get(pokemon.url);
              return detailRes.data;  // Retornamos los datos completos del Pokémon
            } catch (e) {
              // Si hay error en un Pokémon individual, lo registramos pero continuamos
              console.log("Error fetching details for:", pokemon.name);
              return null;  // Retornamos null para filtrarlo después
            }
          })
        );
        
        // PASO 6: Filtramos los Pokémon que se cargaron correctamente (no null)
        const validPokemons = pokemonDetails.filter(pokemon => pokemon !== null);
        
        // PASO 7: Actualizamos el estado con los nuevos Pokémon
        setApiPokemons(prev => [...prev, ...validPokemons]);
        
      } catch (e) {
        // Manejo de errores generales (fallo de red, API caída, etc.)
        console.log("Error:", e.message);
        setError("Error al buscar Pokémon");
      } finally {
        // finally se ejecuta siempre, haya éxito o error
        setLoading(false);  // Desactivamos el estado de carga
      }
    }, 300);  // 300ms de delay para el debounce
    
    // FUNCIÓN DE LIMPIEZA: Se ejecuta antes del próximo efecto o al desmontar el componente
      // Esto cancela el timeout si el usuario sigue escribiendo
    return () => clearTimeout(timeoutId);
  }, [value]);  // Dependencia: se ejecuta cada vez que value cambia

  // Renderizado del componente
  return (
    <section className="search-container">
      {/* Componente Search: maneja la entrada de búsqueda del usuario */}
      <Search setValue={setValue} existingPokemons={allPokemons} />
      
      {/* ESTADO 1: Loading - mostramos spinner cuando está cargando */}
      {loading && (
        <div className="loading-state">
          <p className="loading-text">
            <div className="loading-spinner"></div>
            Buscando Pokémon...
          </p>
        </div>
      )}
      
      {/* ESTADO 2: Error - mostramos mensaje de error si existe */}
      {error && (
        <div className="error-state">
          <p className="error-text">
            <span className="error-icon">⚠️</span>
            {error}
          </p>
        </div>
      )}
      
      {/* ESTADO 3: Resultados encontrados - mostramos contador si hay Pokémon */}
      {allPokemons.length > 0 && !loading && (
        <div className="results-info">
          <p className="results-count">
            Se encontraron {allPokemons.length} Pokémon
          </p>
        </div>
      )}
      
      {/* ESTADO 4: Sin resultados - mostramos mensaje cuando no hay coincidencias */}
      {allPokemons.length === 0 && !loading && !error && value.length >= 3 && (
        <div className="no-results">
          <p className="no-results-text">
            No se encontraron resultados
          </p>
          <p className="no-results-subtext">
            Intenta con otro nombre o crea un nuevo Pokémon
          </p>
        </div>
      )}
      
      {/* Componente PokemonList: muestra la lista de Pokémon encontrados */}
      {/* Le pasamos la combinación de Pokémon de API + personalizados */}
      <PokemonList pokemons={allPokemons} />
    </section>
  );
};

export default SearchContainer;