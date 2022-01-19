import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useDidMount } from "rooks";
import Announcement from "./Components/Announcement copy/Announcement";
import Chat from "./Components/Chat/Chat";
import Footer from "./Components/Footer";
import Navigation from "./Components/Navigation/Navigation";
import NotFound from "./Components/NotFound";
import RandomBackground from "./Components/RandomBackground/RandomBackground";
import AboutPage from "./Pages/About";
import Event from "./Pages/Event";
import Events from "./Pages/Events";
import LandingPage from "./Pages/LandingPage";
import Show from "./Pages/Show";
import Shows from "./Pages/Shows";

const scrollToPosition = (top = 0) => {
  try {
    /**
     * Latest API
     */
    window.scroll({
      top: top,
      left: 0,
      behavior: "smooth",
    });
  } catch (_) {
    /**
     * Fallback
     */
    window.scrollTo(0, top);
  }
};

const ScrollToTop = ({ children }) => {
  const didMount = useDidMount();
  const location = useLocation();
  useEffect(() => {
    if (didMount) {
      scrollToPosition();
    }
  }, [location, didMount]);
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <RandomBackground />
        <Announcement />
        <Navigation />
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/events" element={<Events />} />
          <Route exact path="/event/:uid" element={<Event />} />
          <Route exact path="/shows" element={<Shows />} />
          <Route exact path="/show/:uid" element={<Show />} />
          <Route exact path="/about" element={<AboutPage />} />

          <Route element={<NotFound />} />
        </Routes>
        <Footer />
        <Chat />
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
