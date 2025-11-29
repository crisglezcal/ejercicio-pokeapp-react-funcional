// 1️⃣ Importamos React y otras dependencias necesarias
import React from "react";
  // useNavigate: Hook de React Router para navegar programáticamente
import { useNavigate } from "react-router-dom";
  // Importamos los estilos CSS específicos para la tarjeta de Pokémon
import "./PokemonCard.css";

// 2️⃣ Definimos nuestro componente funcional PokemonCard => Recibe una prop: pokemon (objeto con los datos del Pokémon)
const PokemonCard = ({pokemon}) => {

  // EXTRAEMOS Y NORMALIZAMOS LOS DATOS DEL POKÉMON
    // ID: siempre está disponible directamente
  const id = pokemon.id;
  // Nombre: siempre está disponible directamente
  const name = pokemon.name;
  
  // Imagen: puede venir de dos fuentes diferentes
    // Para Pokémon de la API: pokemon.sprites.front_default
    // Para Pokémon personalizados: pokemon.image
    // El operador ?. (optional chaining) evita errores si la propiedad no existe
  const image = pokemon.sprites?.front_default || pokemon.image;
  
  // Tipo primario: puede venir de dos estructuras diferentes
    // Para Pokémon de la API: pokemon.types[0].type.name (estructura anidada)
    // Para Pokémon personalizados: pokemon.typeOne (estructura plana)
  const typeOne = pokemon.types?.[0]?.type?.name || pokemon.typeOne;
  
  // Tipo secundario: opcional, misma lógica que el tipo primario
  const typeTwo = pokemon.types?.[1]?.type?.name || pokemon.typeTwo;
  
  // useNavigate nos da una función para cambiar de página
  const navigate = useNavigate();

  // Función que se ejecuta cuando el usuario hace click en la tarjeta
  const handleClick = () => {

    // DIFERENCIAMOS ENTRE POKÉMON DE API Y POKÉMON PERSONALIZADOS

        // Si el Pokémon tiene la propiedad 'sprites', es de la API
    if (pokemon.sprites) {
      // Para Pokémon de la API, necesitamos pasar los datos via query parameters porque no están guardados en nuestro contexto
      
      // URLSearchParams es una API nativa para construir query strings
      const queryParams = new URLSearchParams({
        name: name,      // Nombre del Pokémon
        image: image,    // URL de la imagen
        typeOne: typeOne // Tipo primario
      });
      
      // Si existe tipo secundario, lo añadimos a los parámetros
      if (typeTwo) queryParams.append('typeTwo', typeTwo);
      
      // Navegamos a la página de detalles con los query parameters
        // Ejemplo: /pokemon/25?name=pikachu&image=...&typeOne=electric
      navigate(`/pokemon/${id}?${queryParams.toString()}`);
    } else {
      // Para Pokémon personalizados, solo necesitamos el ID porque los datos están guardados en nuestro contexto (PokemonContext)
      navigate(`/pokemon/${id}`);
    }
  };

  // Renderizado de la tarjeta de Pokémon
  return (
    <article 
      className="pokemon-card clickable" 
      onClick={handleClick}
    >
      {/* ID del Pokémon formateado con ceros a la izquierda */}
      {/* padStart(3, '0') convierte "25" en "025", "5" en "005" */}
      <div className="pokemon-id">#{id.toString().padStart(3, '0')}</div>
      
      {/* Nombre del Pokémon */}
      <h1 className="pokemon-name">{name}</h1>
      
      {/* Imagen del Pokémon */}
      <img 
        src={image} 
        alt={name} 
        className="pokemon-image"
      />
      
      {/* Contenedor para los tipos del Pokémon */}
      <div className="pokemon-types">
        {/* Tipo primario - siempre existe */}
        {/* La clase CSS se construye dinámicamente: type-{typeOne} → type-fire, type-water, etc. */}
        <span className={`type-badge type-${typeOne}`}>
          {typeOne}
        </span>
        
        {/* Tipo secundario - solo se muestra si existe */}
        {/* typeTwo && ... es un patrón común en React para renderizado condicional */}
        {typeTwo && (
          <span className={`type-badge type-${typeTwo}`}>
            {typeTwo}
          </span>
        )}
      </div>
    </article>
  );
};

export default PokemonCard;