import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Ticker from "react-ticker";

const Container = styled.div`
  text-align: center;
  line-height: 3rem;
  font-size: 1.5rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
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
      style={{
        backgroundColor: documents.results[0].data.backgroundcolor,
        color: documents.results[0].data.textcolor,
      }}
      onClick={() => navigate(documents.results[0].data.targetcontent.url)}
    >
      <Ticker>
        {({ index }) => <>{documents.results[0].data.text}&nbsp;</>}
      </Ticker>
    </Container>
  );
};
export default Announcement;
