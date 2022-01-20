import { AnimatePresence, motion } from "framer-motion";
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

        <AnimatePresence>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <PageWrapper>
                  <LandingPage />
                </PageWrapper>
              }
            />
            <Route
              exact
              path="/events"
              element={
                <PageWrapper>
                  <Events />
                </PageWrapper>
              }
            />
            <Route
              exact
              path="/event/:uid"
              element={
                <PageWrapper>
                  <Event />
                </PageWrapper>
              }
            />
            <Route
              exact
              path="/shows"
              element={
                <PageWrapper>
                  <Shows />
                </PageWrapper>
              }
            />
            <Route
              exact
              path="/show/:uid"
              element={
                <PageWrapper>
                  <Show />
                </PageWrapper>
              }
            />
            <Route
              exact
              path="/about"
              element={
                <PageWrapper>
                  <AboutPage />
                </PageWrapper>
              }
            />

            <Route element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <Navigation />
        <Footer />
        <Chat />
      </ScrollToTop>
    </BrowserRouter>
  );
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: "-100vh",
    scale: 0.8,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: "100vh",
    scale: 1.2,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const pageStyle = {
  // position: "absolute"
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      style={pageStyle}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default App;
