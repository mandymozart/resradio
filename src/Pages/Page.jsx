import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { PrismicRichText } from "@prismicio/react";
import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "../Components/NotFound";
import SectionLoader from "../Components/SectionLoader";
import HeroImage from "../Components/TeaserImage/HeroImage";
import { getPageQuery } from "../Queries/pages";
import { BREAKPOINT_XS } from "../config";

const Container = styled.div`
padding: 2rem;
@media (max-width: ${BREAKPOINT_XS}px) {
  padding: 1rem;
}
`;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
`;

const Description = styled.section`
h2 {
  @media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}
`;

const Page = () => {
  const { uid } = useParams();
  const { loading, error, data } = useQuery(getPageQuery, { variables: { uid: uid } });

  if (loading) return <SectionLoader />;
  if (error) return <NotFound error={error.message} />;
  if (!data.page) return <NotFound error={"Page does not exist"} />
  const page = data.page
  return (
    <>
      {page.image && (
        <Header>
          <HeroImage image={page.image} />
        </Header>
      )}
      <Container>
        <Description>
          <h2>{page.title}</h2>
          <PrismicRichText field={page.text} />
        </Description>
      </Container>
    </>
  );
};

export default Page;
