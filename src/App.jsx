import { motion } from "framer-motion";
import { BrowserView } from "react-device-detect";
import { Outlet } from "react-router-dom";
import FloatingAnnouncement from "./Components/Announcement/FloatingAnnouncement";
import Header from "./Components/Header";

function App() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Outlet />
      </PageWrapper>
      <BrowserView>
        <FloatingAnnouncement />
      </BrowserView>
    </>
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
