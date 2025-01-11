import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import SuggestionPage from "./pages/SuggestionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/suggest" element={<SuggestionPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
