import React from "react";

import { IdentityContextProvider } from "react-netlify-identity";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { configureAbly } from "@ably-labs/react-hooks";
import { ApolloProvider } from "@apollo/client";
import { nanoid } from "nanoid";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App";
import NotFound from "./Components/NotFound";
import ScrollToTop from "./Components/ScrollToTop";
import Player from "./Components/Studio/Player/Player";
import Playlists from "./Components/Studio/Playlists/Playlists";
import AboutPage from "./Pages/About";
import BroadcastPage from "./Pages/Broadcast";
import Event from "./Pages/Event";
import Explore from "./Pages/Explore";
import LandingPage from "./Pages/LandingPage";
import Page from "./Pages/Page";
import SchedulePage from "./Pages/Schedule";
import SearchResults from "./Pages/SearchResults";
import ShopPage from "./Pages/Shop";
import Show from "./Pages/Show";
import Shows from "./Pages/Shows";
import Studio from "./Studio";
import config from "./config";
import { client } from "./prismic";

const container = document.getElementById('root');
const root = createRoot(container);

configureAbly({ key: config.ABLY_KEY, clientId: nanoid() })

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <IdentityContextProvider value={config.IDENTITY_URL}>
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
                  path="/explore"
                  element={
                    <Explore />
                  }
                />
                <Route
                  exact
                  path="/broadcasts/:uid"
                  element={
                    <BroadcastPage />
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <SchedulePage />
                  }
                />
                <Route
                  path="/schedule/:from"
                  element={
                    <SchedulePage />
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
                  path="/search/*"
                  element={
                    <SearchResults />
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
                  path="/shop"
                  element={
                    <ShopPage />
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="studio" element={<Studio />}>
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
      </IdentityContextProvider>
    </ApolloProvider>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
