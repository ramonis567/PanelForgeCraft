import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SignInPage from '../pages/Auth/SignInPage';
import SignUpPage from '../pages/Auth/SignOutPage';
import PanelForgePage from '../pages/PanelForge';
import PanelDesignPage from '../pages/PanelDesign';
import NotFound from '../pages/_common/NotFound';

const AppRouter = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/panel-forge" element={<PanelForgePage />} />
            <Route path="/panel-design" element={<PanelDesignPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
);

export default AppRouter;