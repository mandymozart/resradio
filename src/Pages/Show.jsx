import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React from "react";
import { useParams } from "react-router-dom";
import HeaderOffset from "../Components/HeaderOffset";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import HeroImage from "../Components/TeaserImage/HeroImage";
import BigArrow from "../images/BigArrow";
import { GetShowQuery } from "../Queries/shows";

const Container = styled.div``;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
  padding: 1rem;
`;

export const SoundcloudPlayer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: 1rem;
  padding-top: 56.25%;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
`;

const Description = styled.section`
  font-size: 1rem;
  padding: 0 2rem;
  h3 {
    font-size: 1.5rem;
    font-family: var(--font-bold);
    margin-bottom: 1rem; 
    text-transform: none;
  }
  border-bottom: 2px solid var(--color);
  padding-bottom: 1rem;
`;

const ShowBroadcasts = styled.section`
padding: 2rem 2rem;
h3 {
  font-size: 1.5rem;
  font-family: var(--font-bold);
  margin-bottom: 1rem; 
  text-transform: none;
}
button {
  background: none;
  border: none;

  width: 100%;
  padding: 2rem;
  margin: 0;
  text-align: center;
  cursor: pointer;
  div {
    text-transform: uppercase;
    font-size: 1rem;
    font-family: var(--font-light);
    margin-bottom: 1rem;
  }
  &:hover {
    color: var(--second);
  }
}
`;

const Show = () => {
  const { uid } = useParams();
  const { loading, error, data } = useQuery(GetShowQuery, { variables: { uid: uid } });

  const loadMore = () => {
    console.log("not implemented")
  }

  if (loading) return <PageLoader />;
  if (error) return <NotFound error={error.message} />;
  if (data.allShowss.edges <= 0) return <></>
  console.log(data);
  const show = data.allShowss.edges[0].node;
  return (
    <HeaderOffset>
      <Container>
        <Header>
          <HeroImage image={show.image.hero} />
        </Header>
        <Description>
          <h3>{show.title}</h3>
          <KeyFieldParagraph className="text" text={show.description} />
        </Description>
        <ShowBroadcasts>
          <h4>Recent Broadcasts</h4>
          <div className="list">
            ...
          </div>
          <button onClick={() => loadMore()}><div>load more</div>
            <BigArrow />
          </button>
        </ShowBroadcasts>
      </Container>
    </HeaderOffset>
  );
};

export default Show;
