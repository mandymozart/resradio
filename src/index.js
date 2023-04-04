import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { configureAbly } from "@ably-labs/react-hooks";
import { ApolloProvider } from "@apollo/client";
import { nanoid } from "nanoid";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import MousePositionProvider from "./Components/MousePositionProvider";
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
import Show from "./Pages/Show";
import Shows from "./Pages/Shows";
import { client } from "./prismic";
import Sandbox, { Player, Playlists } from "./Sandbox";

const container = document.getElementById('root');
const root = createRoot(container);

configureAbly({ key: "-UKVOQ.551SOg:ATV3cBDTx4wFI1GZpLbCH0EynLqak8T74g85L2o-JJA", clientId: nanoid() })
// configureAbly({authUrl: "/api/ably-token-request"})

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MousePositionProvider>
        <Router>
          <ScrollToTop>
            <Routes>
              <Route exact path="/"
                element={<App />}>
                <Route
                  exact
                  path="/"
                  element={
                    <LandingPage />
                  }
                />
                <Route
                  exact
                  path="/broadcasts"
                  element={
                    <Broadcasts />
                  }
                />
                <Route
                  exact
                  path="/broadcasts/:uid"
                  element={
                    <Broadcast />
                  }
                />
                <Route
                  exact
                  path="/schedule"
                  element={
                    <Events />
                  }
                />
                <Route
                  exact
                  path="/event/:uid"
                  element={
                    <Event />
                  }
                />
                <Route
                  exact
                  path="/shows"
                  element={
                    <Shows />
                  }
                />
                <Route
                  exact
                  path="/shows/:uid"
                  element={
                    <Show />
                  }
                />
                <Route
                  exact
                  path="/page/:uid"
                  element={
                    <Page />
                  }
                />
                <Route
                  exact
                  path="/about"
                  element={
                    <AboutPage />
                  }
                />
                <Route
                  exact
                  path="/impressum"
                  element={
                    <ImpressumPage />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="studio" element={<Sandbox />}>
                <Route
                  path="playlists"
                  element={
                    <Playlists />
                  } />
                <Route
                  path="playlists/:uid"
                  element={
                    <Player />
                  } />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ScrollToTop>
        </Router>
      </MousePositionProvider>
    </ApolloProvider>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
