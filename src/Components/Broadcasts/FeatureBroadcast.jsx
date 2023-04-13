import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import gql from "graphql-tag";
import React from "react";
import { Link } from "react-router-dom";
import { BroadcastFragment, BroadcastTagsFragement, GetFeatureBroadcastQuery } from "../../Queries/broadcasts";
import KeyFieldParagraph from "../KeyFieldParagraph";
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
.image {
    overflow: hidden;
    position: relative;
    .overlay {
      position: absolute;
      width: calc(50% - 5rem);
      padding: 2rem;
      bottom: 2rem;
      right: 2rem;
      background: var(--color);
      opacity: 0;
      transition: all .2s ease;
      .description {
        text-overflow:ellipsis " ...";
        overflow:hidden;
        display: -webkit-box !important;
        -webkit-line-clamp: 15;
        -webkit-box-orient: vertical;
        white-space: normal;
        text-transform: initial;
      color: var(--background);
      }
      .tags {
        margin-top: 0.5rem;
        text-align: left;
      }
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
      transform: scale(1.06);
    }
    .image .overlay {
      opacity: 1;
    }
  }
`

const getFeatureBroadcastQuery = gql`
${GetFeatureBroadcastQuery}
${BroadcastFragment}
${BroadcastTagsFragement}
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
          <div className="overlay">
            <div className="description">
              <KeyFieldParagraph text={broadcast.description} />
            </div>
          </div>
        </div>
      </Link>
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
