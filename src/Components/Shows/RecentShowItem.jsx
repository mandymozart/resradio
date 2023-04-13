import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
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
    .overlay {
      position: absolute;
      width: calc(100% - 8rem);
      padding: 2rem 4rem;
      top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      opacity: 0;
      transition: all .2s ease;
      .description {
        text-overflow:ellipsis " ...";
        overflow:hidden;
        display: -webkit-box !important;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        white-space: normal;
        text-transform: initial;
        color: var(--color)
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
      filter: blur(10px);
      transform: scale(1.06);
    }
    .image .overlay {
      opacity: 1;
    }
  }
`

const RecentShowItem = ({ show }) => {
  const linkTo = `shows/${show.node._meta.uid}`;
  return (
    <Container>
      <Link to={linkTo}>
        <div className="image">
          <ThumbnailPanoramaImage image={show.node.image.thumbnailPanorama} />
          <div className="overlay">
            <div className="description">
              {show.node.description}
            </div>
            <Tags className="tags" tags={show.node.tags} />
          </div>
        </div>
      </Link>
      <div className="meta">
        <Link to={linkTo}>
          <h4>{show.node.title}</h4>
        </Link>
        <div>{dayjs(show.node.begin).format("DD.MM.YYYY")}</div>
      </div>
    </Container>
  );
};
export default RecentShowItem;
