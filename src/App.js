import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInPage from './pages/LoginPage'; 
import ScorePage from './pages/ScorePage'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogInPage />} /> 
        <Route path="/score" element={<ScorePage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
