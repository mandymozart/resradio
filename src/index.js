import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { configureAbly } from "@ably-labs/react-hooks";
import { ApolloProvider } from "@apollo/client";
import { nanoid } from "nanoid";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./Components/NotFound";
import { client } from "./prismic";
import Sandbox, { Player, Playlists } from "./Sandbox";

const container = document.getElementById('root');
const root = createRoot(container);

configureAbly({ key: "-UKVOQ.551SOg:ATV3cBDTx4wFI1GZpLbCH0EynLqak8T74g85L2o-JJA", clientId: nanoid() })
// configureAbly({authUrl: "/api/ably-token-request"})

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route exact path="/"
          element={<>Primary App goes here</>}/>
          <Route path="studio" element={<Sandbox/>}>
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
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
