import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { DATE_FORMAT } from "../../utils";
import ThumbnailPanoramaImage from "../TeaserImage/ThumbnailPanoramaImage";

const Container = styled.div`
box-sizing: border-box;
height: 100%;
box-sizing: border-box;
padding: 0;
h4 {
  text-transform: initial;
  margin: 0;
  font-size: 1.25rem;
}
.meta {
  padding: 0 2rem 0 2rem;
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  padding-bottom: 3rem;
}

.image {
    overflow: hidden;
    position: relative;
}
`

const RecentShowItem = ({ show }) => {
  const linkTo = `shows/${show.node._meta.uid}`;
  return (
    <Container>
      <Link to={linkTo}>
        <div className="image">
          <ThumbnailPanoramaImage image={show.node.image.thumbnailPanorama} />
          {/* <div className="overlay">
            <div className="description">
              {show.node.description}
            </div>
            <Tags className="tags" tags={show.node.tags} />
          </div> */}
        </div>
      </Link>
      <div className="meta">
        <Link to={linkTo}>
          <h4>{show.node.title}</h4>
        </Link>
        <div>{dayjs(show.node.begin).format(DATE_FORMAT)}</div>
      </div>
    </Container>
  );
};
export default RecentShowItem;
