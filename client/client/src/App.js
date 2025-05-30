import {Routes,Route} from "react-router-dom"
import './App.css';

import Lobby from "./screens/lobby";
import Roompage from "./screens/room";
import Homepage from "./screens/home";
import Leaderboard from "./screens/leaderboard";

function App() {
  return (
    <>
   <Routes>
    <Route  path="/" element={<Lobby/>}></Route>
    <Route  path="/room/:roomid" element={<Roompage/>}></Route>
    <Route  path="/Home" element={<Homepage/>}></Route>
    <Route path="/Leaderboard" element={<Leaderboard/>}></Route>
   </Routes>
    </>
  );
}

export default App;
