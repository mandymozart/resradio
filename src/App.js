import ShowList from './Components/Shows/ShowList';
import EventList from './Components/Events/EventList';
import Announcement from './Components/Announcement copy/Announcement';
import About from './Components/About/About';

function App() {
  return (
    <div>
      <Announcement/>
      <h1>res.radio</h1>
      <EventList/>
      <ShowList/>
      <About/>

    </div>
  )
}

export default App;
