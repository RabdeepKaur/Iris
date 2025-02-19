import {Routes,Route} from "react-router-dom"
import './App.css';
import Lobby from "./screens/lobby";
import Roompage from "./screens/room";

function App() {
  return (
    <>
   <Routes>
    <Route  path="/" element={<Lobby/>}></Route>
    <Route  path="/room/:roomid" element={<Roompage/>}></Route>
   </Routes>
    </>
  );
}

export default App;
