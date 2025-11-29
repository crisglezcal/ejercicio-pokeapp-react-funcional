// 1️⃣ Importamos React y los hooks necesarios
  // useState: Para manejar el estado del input local
  // useRef: Para crear una referencia mutable que persiste entre renders
import React, {useState, useRef} from "react";
  // Link: Componente de React Router para navegación sin recargar la página
import { Link } from "react-router-dom";
  // Importamos los estilos CSS específicos del componente Search
import "./Search.css";

// 2️⃣ Definimos nuestro componente funcional Search que recibe props:
  // - setValue: función para actualizar el valor de búsqueda en el componente padre
  // - existingPokemons: array de Pokémon existentes (no se usa en este componente pero se recibe)
const Search = ({setValue, existingPokemons}) => {
  // ESTADO: Valor actual del input de búsqueda
    // input: string con lo que el usuario está escribiendo
    // setInput: función para actualizar el estado del input
  const [input, setInput] = useState("");
  
  // REF: Referencia mutable para almacenar el ID del timeout => useRef crea un objeto { current: valor } que persiste entre re-renders
  const debounceRef = useRef();

  // Función que se ejecuta cada vez que el usuario escribe en el input
  const handleInputChange = (e) => {
    // Obtenemos el valor actual del input
    const value = e.target.value;
    
    // Actualizamos el estado local para que el input muestre lo que escribe el usuario
    setInput(value);
    
    // DEBOUNCE: Si ya hay un timeout en progreso, lo cancelamos => Esto evita que se ejecuten múltiples búsquedas mientras el usuario escribe
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Si el input está vacío o solo tiene espacios, limpiamos la búsqueda
    if (value.trim() === "") {
      setValue("");  // Limpiamos el valor de búsqueda en el componente padre
      return;        // Salimos de la función temprano
    }

    // Configuramos un nuevo timeout para ejecutar la búsqueda después de 1500ms
      // Esto da tiempo al usuario para terminar de escribir antes de buscar
    debounceRef.current = setTimeout(() => {
      // Pasamos el valor trimado (sin espacios al inicio/final) al componente padre
      setValue(value.trim());
    }, 1500);  // 1500 milisegundos = 1.5 segundos
  };

  // Función que se ejecuta cuando el usuario envía el formulario (presiona Enter o click en Buscar)
  const handleSubmit = (e) => {
    // Prevenimos el comportamiento por defecto del formulario (recargar la página)
    e.preventDefault();
    
    // Si hay un timeout pendiente, lo cancelamos (Esto es importante porque el usuario podría enviar el formulario antes de que se ejecute el debounce)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Si el input no está vacío, ejecutamos la búsqueda inmediatamente
    if (input.trim() !== "") {
      setValue(input.trim());  // Pasamos el valor al componente padre
      setInput("");            // Limpiamos el input local
    }
  };

  // Renderizado del componente
  return (
    <section className="search-section">
      {/* Formulario que se envía cuando el usuario presiona Enter o click en Buscar */}
      <form className="search-form" onSubmit={handleSubmit}>
        
        {/* Contenedor del input de búsqueda con icono */}
        <div className="search-input-container">
          {/* Icono de lupa dentro del input (posición absoluta) */}
          <span className="search-icon">🔍</span>
          
          {/* Input de búsqueda principal */}
          <input
            className="search-input"
            type="text"
            value={input}                    // Valor controlado por el estado
            onChange={handleInputChange}     // Se ejecuta en cada tecla presionada
            placeholder="Busca un Pokémon (mínimo 3 letras)"
          />
        </div>

        {/* Contenedor de los botones */}
        <div className="search-buttons">
          {/* Botón de búsqueda - type="submit" envía el formulario */}
          <button className="search-submit" type="submit">
            Buscar
          </button>
          
          {/* Link para crear nuevo Pokémon - navega a la ruta "/new" */}
          <Link className="create-pokemon-link" to="/new">
            {/* Botón para crear Pokémon - type="button" evita que envíe el formulario */}
            <button className="create-pokemon-btn" type="button">
              Crear Nuevo Pokémon
            </button>
          </Link>
        </div>
        
      </form>
    </section>
  );
};

export default Search;