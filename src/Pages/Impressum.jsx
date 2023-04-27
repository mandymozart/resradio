import styled from "@emotion/styled";
import React from "react";
import HeaderOffset from "../Components/HeaderOffset";
import ViennaStruggleLogo from "../images/ViennaStruggleLogo";

const Container = styled.div`
  padding: 2rem;
`

//** redundant */
const ImpressumPage = () => {
  return (
    <Container>

      <HeaderOffset>
        <h3>Impressum</h3>
        Vienna Community Radio<br />
        ZVR: 2736273<br />
        Vorstand: <br />
        <h4>Development</h4>
        <ul>
          <li>Mandy Mozart (UX &amp; Code)</li>
          <li>Lena Thomaka (Design)</li>
        </ul>
        <ViennaStruggleLogo />
        <h4>Acknowledgement</h4>
        <ul>
          <li>Jonas Pelzer (Scope Typeface)</li>
        </ul>
      </HeaderOffset>
    </Container>
  );
};

export default ImpressumPage;
