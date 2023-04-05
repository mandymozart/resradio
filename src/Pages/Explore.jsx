import styled from "@emotion/styled";
import React from "react";
import RecentBroadcastList from "../Components/Broadcasts/RecentBroadcastList";
import Footer from "../Components/Footer";
import HeaderOffset from "../Components/HeaderOffset";

const Container = styled.section`
h2 {
  padding: 2rem;
}
`

const Explore = () => {

  return (
    <HeaderOffset>
      <Container>
        <h2>Explore</h2>
        <RecentBroadcastList />
        <Footer />
      </Container>
    </HeaderOffset>
  );
};

export default Explore;
