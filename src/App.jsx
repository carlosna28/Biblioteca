import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Usuario } from "./Components/Usuario/Usuario";
import { Registro } from "./Components/Registro/Registro";
import { Inicio } from "./Components/Inicio/Inicio";
import { Admin } from "./Components/Admin/Admin";
import { Biblio } from "./Components/Biblio/Biblio";
import { Bibliotecario } from "./Components/Bibliotecario/Biblliotecario";
import { Biblioinicio } from "./Components/Biblioinicio/Biblioinicio";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Usuario />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/biblio" element={<Biblio />} />
        <Route path="/bibliotecario" element={<Bibliotecario/>}/>
        <Route path="/biblioinicio" element={<Biblioinicio/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
