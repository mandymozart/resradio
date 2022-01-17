import logo from './logo.svg';

import { PrismicRichText, useFirstPrismicDocument } from '@prismicio/react'

import ShowList from './Components/Shows/ShowList';
import EventList from './Components/Events/EventList';
import Announcement from './Components/Announcement copy/Announcement';
import About from './Components/About/About';

function App() {
  const [document] = useFirstPrismicDocument()

  return (
    <div>
      <Announcement/>
      <img src={logo} className="App-logo" alt="logo" />
      {document && (
        <PrismicRichText field={document.data.example_rich_text} />
      )}
      <EventList/>
      <ShowList/>
      <About/>

    </div>
  )
}

export default App;
