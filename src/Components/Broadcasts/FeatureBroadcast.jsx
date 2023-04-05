import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import gql from "graphql-tag";
import React from "react";
import { Link } from "react-router-dom";
import { BroadcastFragment, BroadcastTagsFragement, GetFeatureBroadcastQuery } from "../../Queries/broadcasts";
import PageLoader from "../PageLoader";
import Tags from "../Tags";
import HeroImage from "../TeaserImage/HeroImage";

const Container = styled.div`
border-bottom: 2px solid var(--color);
img {
  border-bottom: 2px solid var(--color);
}
h4 {
  margin: 1rem 0;
  padding: 0 2rem;
  a{
    text-transform: initial;
  }
}
p {
  font-size: 1rem;
  margin: 0;
  text-transform: uppercase;
  margin-bottom: 1rem;
  padding: 0 2rem;
}
.meta {
  display: flex;
  gap: 2rem;
}
.tags {
  text-align: right;
  flex: 1;
  padding-right: 2rem;
}
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
  const broadcast = data.allFeaturebroadcasts.edges[0].node.broadcast;
  return (
    <Container>
      <HeroImage image={broadcast.image.hero} />
      <h4>
        <Link to={`/broadcasts/${broadcast._meta.uid}`}>
          {broadcast.hostedby.title} &mdash; {broadcast.title}
        </Link>
      </h4>
      <div className="meta">
        <p>
          {dayjs(broadcast.begin).format("MMM DD.MM.YYYY")}<br />
          {dayjs(broadcast.begin).format("h:mm")}&mdash;{dayjs(broadcast.end).format("h:mm A")}
        </p>
        <div className="tags">
          <Tags tags={broadcast.tags} />
        </div>
      </div>
    </Container>
  );
};
export default FeatureBroadcast;
