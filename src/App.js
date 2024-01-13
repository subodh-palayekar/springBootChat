import './App.css';
import Chatapp from './components/Chatapp';
import Login from './components/Login'; 
import {Routes,Route} from "react-router-dom"
import Register from './components/Register';



function App() {
  return (
    <>
      {/* <Chatapp/> */}

      <Routes>
        <Route path='/'  element={<Chatapp/>}/>
        <Route path='/register'element={<Register/>} />
      </Routes>
    </>
  );
}

export default App;
