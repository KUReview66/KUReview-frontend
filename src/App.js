import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import SuggestionPage from "./pages/SuggestionPage";
import LogInPage from './pages/LoginPage'; 
import ScorePage from './pages/ScorePage'; 
import NotFound from "./pages/NotFound";
import PreExamSuggest from "./pages/PreExamSuggest";
import ExerciseU2Page from "./pages/ExerciseU2Page"
import ExerciseU3Page from "./pages/ExerciseU3Page";
import ExerciseU5Page from "./pages/ExerciseU5Page";
import ExerciseU6Page from "./pages/ExerciseU6Page";
import ExerciseU7Page from "./pages/ExerciseU7Page";
import ExerciseU8Page from "./pages/ExerciseU8Page";
import ExerciseU9Page from "./pages/ExerciseU9Page";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile/:username" element={<ProfilePage />} /> 
        <Route path="/suggest/:username/:round" element={<SuggestionPage />} /> 
        <Route path="/pre-exam-suggestion" element={<PreExamSuggest />}/>
        <Route path="/" element={<LogInPage />} /> 
        <Route path="/score/:username" element={<ScorePage />} /> 
        <Route path="/404" element={<NotFound />}/>
        <Route path="*" element={<NotFound  />} />
        <Route path="/exerciseU2" element={<ExerciseU2Page  />} />
        <Route path="/exerciseU3" element={<ExerciseU3Page  />} />
        <Route path="/exerciseU5" element={<ExerciseU5Page  />} />
        <Route path="/exerciseU6" element={<ExerciseU6Page  />} />
        <Route path="/exerciseU7" element={<ExerciseU7Page  />} />
        <Route path="/exerciseU8" element={<ExerciseU8Page  />} />
        <Route path="/exerciseU9" element={<ExerciseU9Page  />} />



      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
