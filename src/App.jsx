import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./Components/About/About";
import Announcement from "./Components/Announcement copy/Announcement";
import Footer from "./Components/Footer";
import Navigation from "./Components/Navigation/Navigation";
import NotFound from "./Components/NotFound";
import Event from "./Pages/Event";
import Events from "./Pages/Events";
import Show from "./Pages/Show";
import Shows from "./Pages/Shows";

function App() {
  return (
    <BrowserRouter>
      <Announcement />
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Events />} />
        <Route exact path="/events" element={<Events />} />
        <Route exact path="/event/:uid" element={<Event />} />
        <Route exact path="/shows" element={<Shows />} />
        <Route exact path="/show/:uid" element={<Show />} />
        <Route exact path="/about" element={<About />} />

        <Route element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
