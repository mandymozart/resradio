import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { DATE_FORMAT } from "../../config";
import { getTimeRangeString } from "../../utils";
import Tags from "../Tags";
import ThumbnailPanoramaImage from "../TeaserImage/ThumbnailPanoramaImage";

const Container = styled.div`
box-sizing: border-box;
height: 100%;
box-sizing: border-box;
padding: 0;
h4 {
  text-transform: initial;
  margin: 0;
  font-size: 1.5rem;
  font-family: var(--font-medium);
  margin-bottom: 0.25rem;
  margin-top: 2rem;
}
.meta {
  padding: 0 2rem 0 2rem;
  font-size: 1rem;
  padding-bottom: 3rem;
}
.time {
  margin-bottom: 2rem;
}
.image {
    overflow: hidden;
    position: relative;
}
`

const RecentShowItem = ({ broadcast }) => {
  console.log(broadcast)
  const linkTo = `shows/${broadcast.node.hostedby?._meta.uid}`;
  return (
    <Container>
      <Link to={linkTo}>
        <div className="image">
          <ThumbnailPanoramaImage image={broadcast.node.hostedby?.image.thumbnailPanorama} />
        </div>
      </Link>
      <div className="meta">
        <Link to={linkTo} className="host">
          <h4>{broadcast.node.title}</h4>
        </Link>
        <div className="date">{dayjs(broadcast.node.begin).format(DATE_FORMAT)}
        </div>
        <div className="time">
          {getTimeRangeString(broadcast.node.begin, broadcast.node.end)}
        </div>

        <Tags className="tags" tags={broadcast.node._meta.tags} />
      </div>
    </Container>
  );
};
export default RecentShowItem;
