import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import gql from "graphql-tag";
import React from "react";
import { Link } from "react-router-dom";
import { BroadcastFragment, BroadcastTagsFragement, GetFeatureBroadcastQuery } from "../../Queries/broadcasts";
import PageLoader from "../PageLoader";
import HeroImage from "../TeaserImage/HeroImage";

const Container = styled.div`

img {
  border-bottom: 2px solid var(--color);
}
  h4 {
    margin: 1rem 0;
    padding: 0 2rem;
  }
  p {
    font-size: 1rem;
    margin: 0;
    text-transform: uppercase;
    margin-bottom: 1rem;
    padding: 0 2rem;
  }
  border-bottom: 2px solid var(--color);
`

const getFeatureBroadcastQuery = gql`
${GetFeatureBroadcastQuery}
${BroadcastFragment}
${BroadcastTagsFragement}
`

const FeatureBroadcast = () => {
  const { loading, error, data } = useQuery(getFeatureBroadcastQuery);

  if (loading) return <PageLoader />;
  if (error) return <>Error : {error.message}</>;
  if (data.allFeaturebroadcasts.edges <= 0) return <></>
  console.log(data);
  const broadcast = data.allFeaturebroadcasts.edges[0].node.broadcast;
  return (
    <Container>
      <HeroImage image={broadcast.image.hero} />
      <div className="meta">
        <h4>
          <Link to={`/broadcast/${broadcast._meta.uid}`}>
            {broadcast.hostedby.title} &mdash; {broadcast.title}
          </Link>
        </h4>
        <p>
          {dayjs(broadcast.begin).format("MMM DD.MM.YYYY")}<br />
          {dayjs(broadcast.begin).format("HH:mm")}&mdash;{dayjs(broadcast.end).format("HH:mm")}
        </p>
      </div>
    </Container>
  );
};
export default FeatureBroadcast;
