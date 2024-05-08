import { Footer } from "./components/layouts/Footer";
import Header from "./components/layouts/Header";
import "./App.css";
import { Home } from "./components/Home";

function App() {
  return (
    <div className="App">
      <Header/>
      
      <div className="container">
        <Home/>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
