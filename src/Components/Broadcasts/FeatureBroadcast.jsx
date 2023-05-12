import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { getFeatureBroadcastQuery } from "../../Queries/broadcasts";
import { BREAKPOINT_MD } from "../../config";
import { trimZeros } from "../../utils";
import SectionLoader from "../SectionLoader";
import Tags from "../Tags";
import HeroImage from "../TeaserImage/HeroImage";

const Container = styled.div`
border-bottom: 2px solid var(--color);
.image {
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
  padding: 0 2rem;
  @media (max-width: ${BREAKPOINT_MD}px) {
    margin-bottom: .5rem;
  }

}
.meta {
  display: flex;
  @media (max-width: ${BREAKPOINT_MD}px) {
    display: block;
  }
  margin-bottom: 1rem;
  gap: 2rem;
}
.tags {
  text-align: right;
  flex: 1;
  padding-right: 2rem;
  @media (max-width: ${BREAKPOINT_MD}px) {
    text-align: left;
    padding-left: 2rem;
  }
}
.image {
    overflow: hidden;
    position: relative;
    img {
      transition: all .2s ease;
      vertical-align: middle;
    }
  }
  &:hover {
    cursor: pointer;
    img {
      /* filter: blur(10px); */
      transform: scale(1.06);
    }
    .image .overlay {
      opacity: 1;
    }
  }
`

const FeatureBroadcast = () => {
  const { loading, error, data } = useQuery(getFeatureBroadcastQuery);

  if (loading) return <SectionLoader />;
  if (error) return <>Error : {error.message}</>;
  if (data.allFeaturebroadcasts.edges <= 0) return <></>
  const broadcast = data.allFeaturebroadcasts.edges[0].node.broadcast;
  return (
    <Container>
      <Link to={`/broadcasts/${broadcast._meta.uid}`}>

        <div className="image">
          <HeroImage image={broadcast.image.hero} />
        </div>
      </Link>
      <h4>
        <Link to={`/broadcasts/${broadcast._meta.uid}`}>
          {broadcast.hostedby.title} &mdash; {broadcast.title}
        </Link>
      </h4>
      <div className="meta">
        <p>
          {dayjs(broadcast.begin).format("MMM D.M.YYYY")}<br />
          {trimZeros(
            dayjs(broadcast.begin))}&mdash;{trimZeros(dayjs(broadcast.end))} {dayjs(broadcast.end).format("A")}
        </p>
        <div className="tags">
          <Tags tags={broadcast._meta.tags} />
        </div>
      </div>
    </Container>
  );
};
export default FeatureBroadcast;
