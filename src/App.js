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
import ScoreHistoryPage from "./pages/scorehistory";


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
        <Route path="/exerciseU2/:username" element={<ExerciseU2Page  />} />
        <Route path="/exerciseU3/:username" element={<ExerciseU3Page  />} />
        <Route path="/exerciseU5/:username" element={<ExerciseU5Page  />} />
        <Route path="/exerciseU6/:username" element={<ExerciseU6Page  />} />
        <Route path="/exerciseU7/:username" element={<ExerciseU7Page  />} />
        <Route path="/exerciseU8/:username" element={<ExerciseU8Page  />} />
        <Route path="/exerciseU9/:username" element={<ExerciseU9Page  />} />
        <Route path="/history/:username" element={<ScoreHistoryPage  />} />



      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
