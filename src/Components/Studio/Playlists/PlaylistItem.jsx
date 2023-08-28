import styled from '@emotion/styled';
import React from "react";
import { Link } from 'react-router-dom';
import { BREAKPOINT_XS } from '../../../config';
import ThumbnailImage from '../../TeaserImage/ThumbnailImage';

const Container = styled.div`
h3 {
    font-size: 1.5rem;
    margin-top: 1rem;
}
@media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1rem;
    h3 {
        font-size: 1rem;
        margin: 0;
    }
    img {
        margin-bottom: 1rem;
    }
  }
`

const PlaylistItem = ({ playlist }) => {
    return (<Container>
        <Link to={`${playlist._meta.uid}`}>
            <ThumbnailImage image={playlist.image} />
        </Link>
        <h3>
            {playlist.title}
        </h3>
    </Container>)
}

export default PlaylistItem;