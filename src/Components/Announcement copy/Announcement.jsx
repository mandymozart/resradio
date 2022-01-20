import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  text-align: center;
  line-height: 1rem;
  font-size: 1rem;
  padding: 1rem;
  height: 3rem;
  top: 0;
  left: 0;
  width: 100vw;
  color: var(--color);
  background: var(--background);
`;

const Announcement = () => {
  const [documents] = usePrismicDocumentsByType("announcement");
  const navigate = useNavigate();

  useEffect(() => {
    if (documents) console.log(documents.results[0].data);
  }, [documents]);
  if (!documents) return <></>;
  return (
    <Container
      // style={{
      //   backgroundColor: documents.results[0].data.backgroundcolor,
      //   color: documents.results[0].data.textcolor,
      // }}
      onClick={() => navigate(documents.results[0].data.targetcontent.url)}
      className="glassomorphism"
    >
      {documents.results[0].data.text} 
    </Container>
  );
};
export default Announcement;
