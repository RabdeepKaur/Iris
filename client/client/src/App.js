import {Routes,Route} from "react-router-dom"
import './App.css';

import Lobby from "./screens/lobby";
import Roompage from "./screens/room";
import Homepage from "./screens/home";


function App() {
  return (
    <>
   <Routes>
    <Route  path="/Lobby" element={<Lobby/>}></Route>
    <Route  path="/room/:roomid" element={<Roompage/>}></Route>
    <Route  path="/" element={<Homepage/>}></Route>
    
   </Routes>
    </>
  );
}

export default App;
