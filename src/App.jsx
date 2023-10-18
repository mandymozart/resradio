import { Outlet } from "react-router-dom";
import BroadcastPlayer from "./Components/AudioPlayer/BroadcastPlayer";
import ChatBox from "./Components/Chat/ChatBox";
import DonationBar from "./Components/Donation/DonationBar";
import Header from "./Components/Header";
import MainPage from "./Components/MainPage";
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

const PageWrapper = ({ children }) => {
  return (
    <MainPage>
      <SearchBar />
      <DonationBar />
      {children}
    </MainPage>
  );
};

export default App;
