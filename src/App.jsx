import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Usuario } from "./Components/Usuario/Usuario";
import { Registro } from "./Components/Registro/Registro";
import { Inicio } from "./Components/Inicio/Inicio";
import { Prestamo } from "./Components/Prestamo/Prestamo";
import { Devolucion } from "./Components/Devolucion/Devolucion";
import { Lista } from "./Components/Lista/Lista";
import { Bibliotecario } from "./Components/Bibliotecario/Biblliotecario";
import { Biblioinicio } from "./Components/Biblioinicio/Biblioinicio";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Usuario />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/prestamo" element={<Prestamo />} />
        <Route path="/devolucion" element={<Devolucion />} />
        <Route path="/lista" element={<Lista />} />
        <Route path="/bibliotecario" element={<Bibliotecario/>}/>
        <Route path="/biblioinicio" element={<Biblioinicio/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
