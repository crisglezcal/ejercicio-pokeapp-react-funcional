// 1️⃣ Importamos React y los hooks necesarios
import React from "react";
  // useForm: Hook de react-hook-form para manejar formularios de manera eficiente
import { useForm } from "react-hook-form";
  // Importamos nuestro contexto para acceder a los Pokémon y la función para añadir nuevos
import { usePokemonContext } from "../context/PokemonContext";
  // useNavigate: Para redirigir al usuario después de crear el Pokémon
import { useNavigate } from "react-router-dom";
  // Importamos los estilos CSS específicos del formulario
import "./PokemonForm.css";

// 2️⃣ Definimos nuestro componente funcional PokemonForm
const PokemonForm = () => {
  // useForm es un hook que nos proporciona todas las herramientas para manejar el formulario
    // register: Función para conectar los inputs al formulario
    // handleSubmit: Función que maneja el envío del formulario
    // errors: Objeto que contiene los errores de validación
    // setError: Función para establecer errores manualmente
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  
  // Usamos nuestro contexto para acceder a:
    // addPokemon: Función para añadir nuevos Pokémon al estado global
    // pokemons: Array con todos los Pokémon existentes (para validar duplicados)
  const { addPokemon, pokemons } = usePokemonContext();
  
  // useNavigate nos da una función para cambiar de página programáticamente
  const navigate = useNavigate();

  // Array con todos los tipos de Pokémon disponibles
  const pokemonTypes = [
    "normal", "fire", "water", "electric", "grass", "ice",
    "fighting", "poison", "ground", "flying", "psychic",
    "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
  ];

  // Función que se ejecuta cuando el formulario se envía correctamente
    // data contiene todos los valores de los campos del formulario
  const onSubmit = (data) => {
    // Creamos un nuevo objeto Pokémon con los datos del formulario
    const newPokemon = {
      id: parseInt(data.id),           // Convertimos el ID de string a número
      name: data.name.toLowerCase(),   // Convertimos el nombre a minúsculas para consistencia
      image: data.image,               // URL de la imagen
      typeOne: data.typeOne,           // Tipo primario (obligatorio)
      typeTwo: data.typeTwo || null    // Tipo secundario (opcional, si no hay será null)
    };

    // VALIDACIÓN 1: Verificar si el ID ya existe en nuestros Pokémon
      // .some() recorre el array y retorna true si encuentra al menos un Pokémon con ese ID
    const idExists = pokemons.some(pokemon => pokemon.id === newPokemon.id);
    if (idExists) {
      // Si el ID existe, establecemos un error manual en el campo 'id'
      setError('id', {
        type: 'manual',  // Tipo de error manual (no de validación automática)
        message: 'Ya existe un Pokémon con este ID'
      });
      return; // Detenemos el envío del formulario
    }

    // VALIDACIÓN 2: Verificar si el nombre ya existe
    const nameExists = pokemons.some(pokemon => pokemon.name === newPokemon.name);
    if (nameExists) {
      setError('name', {
        type: 'manual',
        message: 'Ya existe un Pokémon con este nombre'
      });
      return; // Detenemos el envío del formulario
    }

    // Si pasó todas las validaciones, añadimos el nuevo Pokémon
    addPokemon(newPokemon);
    
    // Mostramos alerta de éxito al usuario
    alert("¡Pokémon creado exitosamente!");
    
    // Redirigimos al usuario a la página principal
    navigate("/");
  };

  // Renderizado del componente
  return (
    <div className="pokemon-form-container">
      <h1>Crea un nuevo Pokémon</h1>
      
      {/* Formulario que usa handleSubmit de react-hook-form */}
      {/* handleSubmit valida los datos antes de llamar a onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} className="pokemon-form">
        
        {/* GRUPO 1: Campo para el ID */}
        <div className="form-group">
          <label htmlFor="id">ID *</label>
          <input
            type="number"
            id="id"
            // register conecta este input al formulario y define sus validaciones
            {...register("id", { 
              required: "El ID es requerido",  // Validación: campo obligatorio
              valueAsNumber: true,             // Convierte automáticamente el valor a número
              min: {
                value: 1,                      // El ID debe ser al menos 1
                message: "El ID debe ser mayor a 0"
              }
            })}
          />
          {/* Si hay errores en el campo id, mostramos el mensaje de error */}
          {errors.id && <span className="error">{errors.id.message}</span>}
        </div>

        {/* GRUPO 2: Campo para el nombre */}
        <div className="form-group">
          <label htmlFor="name">Nombre *</label>
          <input
            type="text"
            id="name"
            {...register("name", { 
              required: "El nombre es requerido",
              minLength: {
                value: 3,  // Mínimo 3 caracteres
                message: "El nombre debe tener al menos 3 caracteres"
              },
              pattern: {
                // Expresión regular que solo permite letras (incluyendo acentos) y espacios
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: "El nombre solo puede contener letras"
              }
            })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        {/* GRUPO 3: Campo para la URL de la imagen */}
        <div className="form-group">
          <label htmlFor="image">URL de la Imagen *</label>
          <input
            type="text"
            id="image"
            {...register("image", { 
              required: "La imagen es requerida",
              pattern: {
                // Expresión regular para validar URLs de imágenes
                // ^https?:// - empieza con http:// o https://
                // .*\. - cualquier caracter seguido de un punto
                // (png|jpg|jpeg|gif|webp) - extensiones de imagen permitidas
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
                message: "Debe ser una URL válida de imagen (png, jpg, jpeg, gif, webp)"
              }
            })}
            placeholder="https://ejemplo.com/imagen.png"
          />
          {errors.image && <span className="error">{errors.image.message}</span>}
        </div>

        {/* GRUPO 4: Select para el tipo primario (obligatorio) */}
        <div className="form-group">
          <label htmlFor="typeOne">Tipo Primario *</label>
          <select
            id="typeOne"
            {...register("typeOne", { 
              required: "El tipo primario es requerido"
            })}
          >
            <option value="">Selecciona un tipo</option>
            {/* Mapeamos el array de tipos para crear las opciones del select */}
            {pokemonTypes.map(type => (
              <option key={type} value={type}>
                {/* type.charAt(0).toUpperCase() + type.slice(1) convierte "fire" en "Fire" */}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          {errors.typeOne && <span className="error">{errors.typeOne.message}</span>}
        </div>

        {/* GRUPO 5: Select para el tipo secundario (opcional) */}
        <div className="form-group">
          <label htmlFor="typeTwo">Tipo Secundario</label>
          <select
            id="typeTwo"
            {...register("typeTwo")}  // Sin validaciones porque es opcional
          >
            <option value="">Ninguno</option>
            {pokemonTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          {/* No mostramos errores porque este campo es opcional */}
        </div>

        {/* Botón de envío del formulario */}
        <button type="submit" className="submit-btn">Crear Pokémon</button>
      </form>
    </div>
  );
};

export default PokemonForm;