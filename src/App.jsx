import { Outlet } from "react-router-dom";
import BroadcastPlayer from "./Components/AudioPlayer/BroadcastPlayer";
import ChatBox from "./Components/Chat/ChatBox";
import DonationBar from "./Components/Donation/DonationBar";
import Header from "./Components/Header";
import HeaderOffset from "./Components/HeaderOffset";
import SearchBar from "./Components/Search/SearchBar";
import useBroadcastStore from "./Stores/BroadcastStore";

function App() {
  const { isVisible } = useBroadcastStore();
  return (
    <>
      <Header />
      <PageWrapper>
        <Outlet />
        {isVisible && (<div style={{ height: "9rem" }}>&nbsp;</div>)}
      </PageWrapper>
      <BroadcastPlayer />
      <ChatBox />
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
    <HeaderOffset>
      <SearchBar />
      <DonationBar />
      {children}
    </HeaderOffset>
  );
};

export default App;
