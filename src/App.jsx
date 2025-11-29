// 1️⃣ Importamos los estilos globales de la aplicación
  // './App.css' contiene estilos que se aplican a toda la aplicación
import './App.css'

// 2️⃣ Importamos los componentes de React Router DOM para el enrutamiento
  // BrowserRouter: Componente que proporciona el enrutamiento a toda la aplicación
import { BrowserRouter} from 'react-router-dom';

// 3️⃣ Importamos nuestros componentes personalizados
  // Header: Componente que muestra la barra de navegación superior
import Header from './components/Header/Header';
  // Main: Componente principal que contiene las rutas y contenido de la aplicación
import Main from './components/Main/Main';
  // Footer: Componente que muestra el pie de página
import Footer from './components/Footer/Footer';

// 4️⃣ Importamos nuestro Provider personalizado para el contexto de Pokémon
// PokemonProvider: Componente que provee el estado global de Pokémon a toda la app
import { PokemonProvider } from './components/Main/context/PokemonContext';

// 5️⃣Definimos nuestro componente principal App => Este es el componente raíz de toda nuestra aplicación React
function App() {
  // El componente App retorna la estructura principal de la aplicación
  return (
    // Fragmento de React (<> </>) - permite retornar múltiples elementos sin un div padre
    <>
      {/* BrowserRouter: Proporciona el contexto de enrutamiento a todos sus componentes hijos */}
      {/* Todas las rutas y navegación funcionan porque están dentro de BrowserRouter */}
      <BrowserRouter>
        {/* PokemonProvider: Proporciona el contexto global de Pokémon */}
        {/* Todos los componentes dentro pueden acceder a los Pokémon y funciones del contexto */}
        <PokemonProvider>
          {/* Header: Componente de navegación - muestra menú y logo */}
          {/* Está dentro del contexto, puede acceder a datos de Pokémon si es necesario */}
          <Header/>
          {/* Main: Componente principal - contiene las rutas y páginas de la aplicación */}
          {/* Aquí es donde se renderizan las diferentes páginas (Home, Search, Details, etc.) */}
          <Main/>
        </PokemonProvider>
      </BrowserRouter>
      
      {/* Footer: Componente de pie de página */}
      {/* Está FUERA de BrowserRouter y PokemonProvider por diseño específico */}
      {/* Esto significa que: */}
      {/* - No tiene acceso al enrutamiento (no puede usar useNavigate, etc.) */}
      {/* - No tiene acceso al contexto de Pokémon */}
      {/* - Se muestra en todas las páginas de forma consistente */}
      <Footer/>
    </>  
  )
}

// 6️⃣ Exportamos el componente App como exportación por defecto
  // Esto permite importarlo en otros archivos como: import App from './App'
export default App;