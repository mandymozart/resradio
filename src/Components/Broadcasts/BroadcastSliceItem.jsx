import styled from "@emotion/styled";
import { PrismicLink, usePrismicDocumentByUID } from "@prismicio/react";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import Loader from "../Loader";
import HeroImage from "../TeaserImage/HeroImage";

const Container = styled.div`

img {
  border-bottom: 2px solid var(--color);
}
  h4 {
    margin: 1rem 0;
    padding: 0 2rem;
  }
  p {
    font-size: 1rem;
    margin: 0;
    text-transform: uppercase;
    margin-bottom: 1rem;
    padding: 0 2rem;
  }
  border-bottom: 2px solid var(--color);
`

const BroadcastSliceItem = ({ uid }) => {
  const [document, { state, error }] = usePrismicDocumentByUID(
    "broadcasts",
    uid,
    {
      fetchLinks: "shows.title",
    }
  );
  useEffect(() => {
    console.log(document, uid);
  }, [document]);
  if (state === "loading") return <Loader />;
  else if (state === "failed") return <></>;
  else if (state === "loaded")
    return (
      <Container>
        <HeroImage image={document.data.image.hero ? document.data.image.hero : document.data.image} />
        <div className="meta">
          <h4>
            <PrismicLink field={document}>
              {document.data.hostedby.data.title} - {document.data.title}
            </PrismicLink>
          </h4>
          <p>
            {dayjs(document.data.begin).format("MMM DD.MM.YYYY")}<br />
            {dayjs(document.data.begin).format("HH:mm")}&mdash;{dayjs(document.data.end).format("HH:mm")}
          </p>
        </div>
      </Container>
    );
  return <></>;
};
export default BroadcastSliceItem;
