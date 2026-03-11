import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Usuario } from "./Components/Usuario/Usuario";
import { Registro } from "./Components/Registro/Registro";
import { Inicio } from "./Components/Inicio/Inicio";
import { Admin } from "./Components/Admin/Admin";
import { Biblio } from "./Components/Biblio/Biblio";
import { Biblioinicio } from "./Components/Biblioinicio/Biblioinicio";
import { Administrador } from "./Components/Administrador/Administrador";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Usuario />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/biblio" element={<Biblio />} />
        <Route path="/biblioinicio" element={<Biblioinicio/>}/>
        <Route path="/administrador" element={<Administrador/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
