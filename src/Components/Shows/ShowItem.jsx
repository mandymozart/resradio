import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";
import TeaserImage from "../TeaserImage/TeaserImage";

const Container = styled.div`
  display: flex;
  gap: 3rem;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  line-height: 1.1rem;
  margin-bottom: 2rem;
  .image {
    flex: 0 0 10rem;
  }
  .meta {
    flex: 1;
    h3 {
      font-size: 1.1rem;
      margin: 0;
    }
    span {
      font-size: 1.1rem;
      line-height: 1.1rem;
    }
  }
`;

const ShowItem = ({ show }) => {
  return (
    <FadeIn>
      <Container>
        <div className="image">
          <Link key={show.id} to={show.url}>
            <TeaserImage image={show.data.image} />
          </Link>
        </div>
        <div className="meta">
          <Link key={show.id} to={show.url}>
            <h3>{show.data.title}</h3>
          </Link>
        </div>
      </Container>
    </FadeIn>
  );
};
export default ShowItem;
