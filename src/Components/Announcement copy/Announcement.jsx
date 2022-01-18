import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import Ticker from "react-ticker";

const Container = styled.div`
  text-align: center;
  line-height: 3rem;
  font-size: 1.5rem;
`;

const Announcement = () => {
  const [documents] = usePrismicDocumentsByType("announcement");
  useEffect(() => {
    console.log(documents);
  }, [documents]);
  if (!documents) return <></>;
  return (
    <Container
      style={{
        backgroundColor: documents.results[0].data.backgroundcolor,
        color: documents.results[0].data.textcolor,
      }}
    >
      <Ticker>{({ index }) => <>{documents.results[0].data.text}&nbsp;</>}</Ticker>
    </Container>
  );
};
export default Announcement;
