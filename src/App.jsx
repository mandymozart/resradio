import useMouse from "@react-hook/mouse-position";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { BrowserView } from "react-device-detect";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FloatingAnnouncement from "./Components/Announcement/FloatingAnnouncement";
import Header from "./Components/Header";
import NotFound from "./Components/NotFound";
import ScrollToTop from "./Components/ScrollToTop";
import AboutPage from "./Pages/About";
import Broadcast from "./Pages/Broadcast";
import Broadcasts from "./Pages/Broadcasts";
import Event from "./Pages/Event";
import Events from "./Pages/Events";
import ImpressumPage from "./Pages/Impressum";
import LandingPage from "./Pages/LandingPage";
import Page from "./Pages/Page";
import RotationPage from "./Pages/Rotation";
import Show from "./Pages/Show";
import Shows from "./Pages/Shows";
import useThemeStore from "./Stores/ThemeStore";

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
       <Header />
        <ScrollToTop>
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
              path="/broadcasts"
              element={
                <PageWrapper>
                  <Broadcasts />
                </PageWrapper>
              }
            />
            <Route
              exact
              path="/broadcast/:uid"
              element={
                <PageWrapper>
                  <Broadcast />
                </PageWrapper>
              }
            />
            <Route
              exact
              path="/schedule"
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
              path="/page/:uid"
              element={
                <PageWrapper>
                  <Page />
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
            <Route
              exact
              path="/impressum"
              element={
                <PageWrapper>
                  <ImpressumPage />
                </PageWrapper>
              }
            />
            <Route
              exact
              path="/rotation"
              element={
                <PageWrapper>
                  <RotationPage />
                </PageWrapper>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ScrollToTop>
        <BrowserView>
          <FloatingAnnouncement/>
        </BrowserView>
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
