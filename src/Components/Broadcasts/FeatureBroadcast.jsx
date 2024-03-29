import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { getFeatureBroadcastQuery } from "../../Queries/broadcasts";
import { BREAKPOINT_MD, BREAKPOINT_XS, DATE_FORMAT_LONG } from "../../config";
import { getTimeRangeString } from "../../utils";
import SectionLoader from "../SectionLoader";
import Tags from "../Tags";
import HeroImage from "../TeaserImage/HeroImage";

const Container = styled.div`
border-bottom: 1px solid var(--color);
padding-bottom: 1rem;
.image {
  border-bottom: 1px solid var(--color);
  overflow: hidden;
  position: relative;
  a {
    display: block;
  }
  img {
    transition: all .2s ease;
    vertical-align: middle;
  }
}
&:hover {
  cursor: pointer;
  img {
    /* filter: blur(10px); */
    transform: scale(1.01);
  }
}

h4 {
  margin: 2rem 0 1rem 0;
padding: 0 2rem;
  a{
    text-transform: initial;
  }
  @media (max-width: ${BREAKPOINT_MD}px) {
    padding: 0 1rem;
  }
}
.date {
  font-size: 1rem;
  margin: 0;
  text-transform: uppercase;
  padding: 0 2rem;
  @media (max-width: ${BREAKPOINT_MD}px) {
    margin-bottom: .5rem;
    padding: 0 1rem;
  }

}
.content {
  display: flex;
    align-items: top; 
    justify-content: space-between;
    @media (max-width: ${BREAKPOINT_XS}px) {
      display: block;
      padding: 0;
    }
}
.meta {

  margin-bottom: 1rem;
  gap: 2rem;
}
.tags {
  text-align: right;
  flex: 1;
  padding-right: 2rem;
  margin-top: 2rem;
  @media (max-width: ${BREAKPOINT_MD}px) {
    text-align: left;
    padding-left: 1rem;
    margin-top: 1.5rem;
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
      <div className="content">

        <div className="meta">

          <h4>
            <Link to={`/broadcasts/${broadcast._meta.uid}`}>
              {broadcast.hostedby.title}&mdash;{broadcast.title}
            </Link>
          </h4>
          <div className="date">
            {dayjs(broadcast.begin).format(DATE_FORMAT_LONG)}<br />
            {getTimeRangeString(broadcast.begin, broadcast.end)}
          </div>
        </div>
        <div className="tags">
          <Tags tags={broadcast._meta.tags} />
        </div>
      </div>
    </Container>
  );
};
export default FeatureBroadcast;
