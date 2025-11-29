// 1️⃣ Importamos las funciones necesarias de React
  // createContext: Para crear un contexto que permita compartir datos entre componentes
  // useContext: Hook para consumir el contexto en los componentes
  // useState: Hook para manejar estado en componentes funcionales
  // useEffect: Hook para manejar efectos secundarios (como llamadas a APIs o localStorage)
import React, { createContext, useContext, useState, useEffect } from 'react';

// 2️⃣ Creamos el contexto de Pokémon (esto será como una "caja" global donde guardaremos datos que podrán ser utilizados por cualquier componente de nuestra app
const PokemonContext = createContext();

// 3️⃣ Creamos un hook personalizado para usar nuestro contexto (useContext es un hook que nos permite acceder al valor del contexto)
export const usePokemonContext = () => {
  const context = useContext(PokemonContext);
  
  // 4️⃣ Validación de seguridad => Si el contexto no existe = undefined (significa que estamos intentando usarlo fuera del PokemonProvider)
  if (!context) {
    throw new Error('usePokemonContext debe usarse dentro de PokemonProvider');
  }
  return context;
};

// 5️⃣Este es el componente Provider que envolverá nuestra aplicación (provee el contexto a los componentes hijos)
export const PokemonProvider = ({ children }) => {
  // useState para manejar la lista de Pokémon
  // pokemons: array que contiene todos nuestros Pokémon
  // setPokemons: función para actualizar la lista de Pokémon
  const [pokemons, setPokemons] = useState([]);
  
  // Estado para saber si ya cargamos los datos del localStorage:
    // isLoaded: booleano que indica si terminó la carga inicial
    // setIsLoaded: función para cambiar este estado
  const [isLoaded, setIsLoaded] = useState(false);

  // useEffect para cargar los Pokémon guardados cuando la aplicación inicia
    // El array vacío [] como segundo parámetro significa que se ejecuta solo una vez al montar el componente
  useEffect(() => {
    
    try {
      // localStorage es una API del navegador para almacenar datos persistentes - getItem intenta obtener los datos con la clave 'customPokemons'
      const stored = localStorage.getItem('customPokemons');
      
      // Verificamos si hay datos válidos en localStorage
        // stored !== '[]' evita cargar un array vacío
        // stored !== 'undefined' evita cargar el string "undefined"
      if (stored && stored !== '[]' && stored !== 'undefined') {
        // JSON.parse convierte el string JSON guardado en un objeto/array JavaScript
        const parsed = JSON.parse(stored);
        
        // Verificamos que lo parseado sea un array y no esté vacío
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Actualizamos el estado con los Pokémon cargados
          setPokemons(parsed);
        } else {
          setPokemons([]);
        }
      } else {
        setPokemons([]);
      }
    } catch (error) {
      // Si hay algún error al cargar (por ejemplo, datos corruptos)
      console.error('Error al cargar:', error);
      // Limpiamos el localStorage para evitar errores futuros
      localStorage.removeItem('customPokemons');
      // Establecemos el estado como array vacío
      setPokemons([]);
    } finally {
      // finally se ejecuta siempre, haya error o no
      // Marcamos que la carga inicial terminó
      setIsLoaded(true);
    }
  }, []); // Array de dependencias vacío = se ejecuta solo al montar el componente

  // 6️⃣ useEffect para guardar automáticamente en localStorage cuando cambien los Pokémon (se ejecuta cada vez que pokemons o isLoaded cambien)
   useEffect(() => {
    // Solo guardamos si ya terminó la carga inicial y hay Pokémon
    if (isLoaded && pokemons.length > 0) {
      // Convertimos el array de Pokémon a string JSON y lo guardamos
      localStorage.setItem('customPokemons', JSON.stringify(pokemons));
    } else if (isLoaded && pokemons.length === 0) {
      // Si no hay Pokémon, limpiamos el localStorage
      localStorage.removeItem('customPokemons');
    }
  }, [pokemons, isLoaded]); // Se ejecuta cuando pokemons o isLoaded cambien

  // 7️⃣ Función para añadir un nuevo Pokémon a la lista
  const addPokemon = (newPokemon) => {
    // Usamos la forma funcional de setState para asegurarnos de tener el estado actual
    setPokemons(prevPokemons => {
      // Creamos un nuevo array con todos los Pokémon anteriores y el nuevo => spread operator (...) copia todos los elementos del array anterior
      const updatedPokemons = [...prevPokemons, newPokemon];
      return updatedPokemons;
    });
  };

  // 8️⃣Preparamos el valor que será compartido a través del contexto (incluye la lista de Pokémon, la función para añadir y el estado de carga)
  const value = {
    pokemons,      // Array con todos los Pokémon
    addPokemon,    // Función para añadir nuevos Pokémon
    isLoaded       // Booleano que indica si terminó la carga inicial
  };

  // PokemonContext.Provider es el componente que "provee" el contexto
    // Todos los componentes hijos (children) podrán acceder al value
  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
};