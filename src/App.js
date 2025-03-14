import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import SuggestionPage from "./pages/SuggestionPage";
import LogInPage from './pages/LoginPage'; 
import ScorePage from './pages/ScorePage'; 
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/suggest" element={<SuggestionPage />} /> 
        <Route path="/" element={<LogInPage />} /> 
        <Route path="/score/:username" element={<ScorePage />} /> 
        <Route path="/404" element={<NotFound />}/>
        <Route path="*" element={<NotFound  />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
