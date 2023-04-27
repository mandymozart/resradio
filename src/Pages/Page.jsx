import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { PrismicRichText } from "@prismicio/react";
import React from "react";
import { useParams } from "react-router-dom";
import HeaderOffset from "../Components/HeaderOffset";
import NotFound from "../Components/NotFound";
import SectionLoader from "../Components/SectionLoader";
import HeroImage from "../Components/TeaserImage/HeroImage";
import { GetPageQuery } from "../Queries/pages";

const Container = styled.div`
padding: 2rem 0;
width: 50vw;
margin: 0 auto;
`;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
`;

const Description = styled.section``;

const Page = () => {
  const { uid } = useParams();
  const { loading, error, data } = useQuery(GetPageQuery, { variables: { uid: uid } });

  if (loading) return <SectionLoader />;
  if (error) return <NotFound error={error.message} />;
  if (!data.page) return <NotFound error={"Page does not exist"} />
  const page = data.page
  return (
    <HeaderOffset>
      {page.image && (
        <Header>
          <HeroImage image={page.image} />
        </Header>
      )}
      <Container>
        <Description>
          <h3>{page.title}</h3>
          <PrismicRichText field={page.text} />
          {/* {page.text.map(el => {
            if (el.type === "paragraph") return <KeyFieldParagraph text={el.text} />
            if (el.type === "heading1") return <h1>{el.text}</h1>
            if (el.type === "heading2") return <h2>{el.text}</h2>
            if (el.type === "heading3") return <h3>{el.text}</h3>
            if (el.type === "heading4") return <h4>{el.text}</h4>
            if (el.type === "heading5") return <h5>{el.text}</h5>
            if (el.type === "heading6") return <h6>{el.text}</h6>
            if (el.type === "image") return <img src={el.url} alt={el.alt} />
          })} */}
        </Description>
      </Container>
    </HeaderOffset>
  );
};

export default Page;
