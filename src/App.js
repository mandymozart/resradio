import logo from './logo.svg';

import { PrismicRichText, useFirstPrismicDocument } from '@prismicio/react'
import Announcement from './Components/Announcement/Announcement';
import ShowList from './Components/Shows/ShowList';

function App() {
  const [document] = useFirstPrismicDocument()

  return (
    <div>
      <Announcement/>
      <img src={logo} className="App-logo" alt="logo" />
      {document && (
        <PrismicRichText field={document.data.example_rich_text} />
      )}
      {/* <ShowList/> */}
    </div>
  )
}

export default App;
