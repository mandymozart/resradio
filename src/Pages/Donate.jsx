import styled from "@emotion/styled";
import React from "react";
import HeaderOffset from "../Components/HeaderOffset";

const Container = styled.div`
  padding: 2rem 0;
  text-align: center;
  width: 50vw;
  margin: 0 auto;
`

/** redundant */
const DonatePage = () => {
  return (
    <Container>
      <HeaderOffset>
        <h3>Donate</h3>
        <p>Support our community web radio and help us keep the airwaves alive!
          Your donation will help us cover the costs of equipment, maintenance,
          and licensing fees. With your contribution, we can continue to provide
          high-quality programming that reflects the diversity and vibrancy of our community.
          Every little bit helps, and we are grateful for your support!</p>
        <p>
          Support via donation:<br />
          Vienna Community Webradio<br />
          AT63 2011 1841 2411 3300<br />
          GIBAATWWXXX</p>
      </HeaderOffset>
    </Container>
  );
};

export default DonatePage;
