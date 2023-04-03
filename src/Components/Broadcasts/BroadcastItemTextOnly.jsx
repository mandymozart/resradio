import styled from "@emotion/styled";
import { PrismicLink } from "@prismicio/react";
import React, { useEffect, useState } from "react";

import * as prismic from "@prismicio/client";
import { client } from "../../prismic";
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1rem;
  width: 100%;

`
const BroadcastItemTextOnly = ({ uid }) => {
  const [document, setDocument] = useState(null);
  useEffect(() => {
    const fetchPrismicContent = async () => {
      client
        .getByType("broadcasts", {
          predicates: [
            prismic.predicate.at(
              "my.broadcasts.uid",
              uid
            ),
          ],

        }, {
          fetchLinks: "hostedby.title",
        })
        .then((data) => {
          if (data.results[0] && data.results[0].data)
            setDocument(data.results[0].data);
          console.log(data.results[0].data)
        });
    };
    fetchPrismicContent();
  }, [])
  if (!document) return <>...</>;
  else
    return (
      <Container>
        <div className="meta">
          <PrismicLink field={document.hostedby}>
            {document.title}
            &mdash;
            {document.hostedby.title}
          </PrismicLink>
        </div>
      </Container>
    );
};
export default BroadcastItemTextOnly;
