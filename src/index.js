import React from "react";

import { IdentityContextProvider } from "react-netlify-identity";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { configureAbly } from "@ably-labs/react-hooks";
import { ApolloProvider } from "@apollo/client";
import { PrismicToolbar } from "@prismicio/react";
import { nanoid } from "nanoid";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App";
import Alert from "./Components/Alert/Alert";
import PrimaryButton from "./Components/FormElements/PrimaryButton";
import NotFound from "./Components/NotFound";
import ScrollToTop from "./Components/ScrollToTop";
import Playlist from "./Components/Studio/Playlists/Playlist";
import Playlists from "./Components/Studio/Playlists/Playlists";
import RotationInfo from "./Components/Studio/RotationInfo";
import SystemMessage from "./Components/SystemMessage";
import BroadcastPage from "./Pages/Broadcast";
import Explore from "./Pages/Explore";
import LandingPage from "./Pages/LandingPage";
import Page from "./Pages/Page";
import SchedulePage from "./Pages/Schedule";
import SearchResults from "./Pages/SearchResults";
import ShopPage from "./Pages/Shop";
import Show from "./Pages/Show";
import Shows from "./Pages/Shows";
import Sandbox from "./Sandbox";
import Studio from "./Studio";
import { ABLY_KEY } from "./config";
import Logo from "./images/Logo";
import { client } from "./prismic";

const container = document.getElementById('root');
const root = createRoot(container);

configureAbly({ key: ABLY_KEY, clientId: nanoid() })

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <Alert role="alert">
      <div>
        <Logo />
        <SystemMessage message={error.message} type="error" />
        <PrimaryButton large onClick={() => resetErrorBoundary()}>Retry</PrimaryButton>
      </div>
    </Alert>
  );
}

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <IdentityContextProvider url={process.env.REACT_APP_NETLIFY_IDENTITY_PROVIDER}>
        <Router>
          <ScrollToTop>
            <ErrorBoundary fallbackRender={fallbackRender}>
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
                    path="info"
                    element={
                      <RotationInfo />
                    } />
                  <Route
                    path="playlists/:uid"
                    element={
                      <Playlist />
                    } />
                </Route>
                <Route path="/sandbox" element={<Sandbox />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </ScrollToTop>
          <PrismicToolbar />
        </Router>
      </IdentityContextProvider>
    </ApolloProvider>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
