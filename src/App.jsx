import useMouse from "@react-hook/mouse-position";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Announcement from "./Components/Announcement copy/Announcement";
import Footer from "./Components/Footer";
import Navigation from "./Components/Navigation/Navigation";
import NotFound from "./Components/NotFound";
import RandomBackground from "./Components/RandomImages/RandomBackground";
import RandomImage from "./Components/RandomImages/RandomImage";
import AboutPage from "./Pages/About";
import Event from "./Pages/Event";
import Events from "./Pages/Events";
import LandingPage from "./Pages/LandingPage";
import Show from "./Pages/Show";
import Shows from "./Pages/Shows";
import useThemeStore from "./Stores/ThemeStore";

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

const MousePositionProvider = ({ children }) => {
  const setMousePosition = useThemeStore((store) => store.setMousePosition);
  const ref = useRef(null);
  const mouse = useMouse(ref, {
    enterDelay: 100,
    leaveDelay: 100,
  });
  useEffect(() => {
    setMousePosition({ x: mouse.screenX, y: mouse.screenY });
  }, [mouse, setMousePosition]);

  return <div ref={ref}>{children}</div>;
};

function App() {
  return (
    <MousePositionProvider>
      <BrowserRouter>
        <RandomBackground />
        <Announcement />
        <RandomImage scale={0.9} />
        {/* <RandomImage /> */}
        {/* <RandomImage /> */}

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

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Navigation />
        <RandomImage scale={1.1} />
        {/* <RandomImage scale={1.15}/> */}
        <Footer />
        {/* <Chat /> */}
      </BrowserRouter>
    </MousePositionProvider>
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
