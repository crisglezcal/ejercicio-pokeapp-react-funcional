// 1️⃣ Importamos React y los hooks que necesitamos de react-router-dom
  // React: Biblioteca principal para crear componentes
  // useParams: Hook para obtener parámetros de la URL (como /pokemon/:id)
  // useNavigate: Hook para navegar programáticamente entre páginas
  // useSearchParams: Hook para leer y manipular parámetros de consulta (query strings)
import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

  // Importamos nuestro contexto personalizado para acceder a los Pokémon guardados
import { usePokemonContext } from "../context/PokemonContext";

  // Importamos los estilos CSS específicos para este componente
import "./PokemonDetails.css";

// 2️⃣ Definimos nuestro componente funcional PokemonDetails
const PokemonDetails = () => {
  // useParams() nos da acceso a los parámetros de la URL (si la ruta es "/pokemon/25", id será "25")
  const { id } = useParams();
  
  // useNavigate() nos da una función para cambiar de página programáticamente
  const navigate = useNavigate();
  
  // useSearchParams() nos da acceso a los parámetros de consulta (query parameters)
    // Si la URL es "/pokemon/25?name=pikachu&type=electric" => searchParams contendrá { name: "pikachu", type: "electric" }
  const [searchParams] = useSearchParams();
  
  // Usamos nuestro contexto personalizado para acceder a la lista de Pokémon => pokemons es el array que contiene todos nuestros Pokémon personalizados
  const { pokemons } = usePokemonContext();

  // Obtenemos los datos específicos de los query parameters
  // searchParams.get('clave') busca el valor de ese parámetro en la URL
  const name = searchParams.get('name');        // Ej: "Pikachu"
  const image = searchParams.get('image');      // Ej: "https://.../pikachu.png"
  const typeOne = searchParams.get('typeOne');  // Ej: "electric"
  const typeTwo = searchParams.get('typeTwo');  // Ej: null o "flying"

  // Buscamos si este Pokémon existe en nuestro contexto (Pokémon personalizados)
    // find() recorre el array y retorna el primer elemento que cumpla la condición
    // parseInt(id) convierte el string "25" a número 25 para comparar
  const customPokemon = pokemons.find(p => p.id === parseInt(id));

  // Lógica para determinar qué datos mostrar:
    // Si encontramos el Pokémon en nuestro contexto (customPokemon existe), lo usamos
    // Si no existe en el contexto, creamos un objeto con los datos de los query parameters
  const pokemon = customPokemon || {
    id: parseInt(id),    // Convertimos el ID de string a número
    name: name,          // Nombre del query parameter
    image: image,        // Imagen del query parameter  
    typeOne: typeOne,    // Primer tipo del query parameter
    typeTwo: typeTwo     // Segundo tipo (puede ser null/undefined)
  };

  // Validación: Si no tenemos nombre o imagen, mostramos un error
  if (!pokemon.name || !pokemon.image) {
    return (
      <div className="pokemon-details-container">
        <h2>Pokémon no encontrado</h2>
        <p>ID: {id}</p>
        {/* Object.fromEntries convierte searchParams a objeto para mostrarlo */}
        <p>Query Params: {Object.fromEntries(searchParams.entries())}</p>
        {/* Botón para volver al inicio usando navigate */}
        <button onClick={() => navigate("/")} className="back-btn">
          Volver al inicio
        </button>
      </div>
    );
  }

  // Si tenemos datos válidos, mostramos la información del Pokémon
  return (
    <div className="pokemon-details-container">
      <div className="pokemon-details-card">
        {/* Nombre del Pokémon - text-transform: capitalize lo pone en mayúscula la primera letra */}
        <h1 className="pokemon-details-name">{pokemon.name}</h1>
        
        {/* Imagen del Pokémon */}
        <img 
          src={pokemon.image} 
          alt={pokemon.name} 
          className="pokemon-details-image" 
        />
        
        <div className="pokemon-details-info">
          {/* ID formateado: padStart(3, '0') convierte "25" en "025" */}
          <p><strong>ID:</strong> #{pokemon.id.toString().padStart(3, '0')}</p>
          
          {/* Contenedor para los tipos del Pokémon */}
          <div className="pokemon-details-types">
            {/* Primer tipo - siempre existe */}
            <span className={`type-badge type-${pokemon.typeOne}`}>
              {pokemon.typeOne}
            </span>
            
            {/* Segundo tipo - solo se muestra si existe */}
            {/* && es un operador lógico: si pokemon.typeTwo es truthy, muestra el span */}
            {pokemon.typeTwo && (
              <span className={`type-badge type-${pokemon.typeTwo}`}>
                {pokemon.typeTwo}
              </span>
            )}
          </div>
        </div>
        
        {/* Botón para volver al inicio */}
        <button onClick={() => navigate("/")} className="back-btn">
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

// Exportamos el componente para poder usarlo en otras partes de la aplicación
export default PokemonDetails;