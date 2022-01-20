import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import Divider from "../Divider";
import TeaserImage from "../TeaserImage/TeaserImage";

const Container = styled.div`
`;

const ShowItem = ({ show }) => {
  return (
    <Container>
      <Link key={show.id} to={show.url}>
        <TeaserImage image={show.data.image} />
        <h3>{show.data.title}</h3>
      </Link>
      <Divider/>
    </Container>
  );
};
export default ShowItem;
