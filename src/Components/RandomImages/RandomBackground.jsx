import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { MobileView } from "react-device-detect";
import useThemeStore from "../../Stores/ThemeStore";

const Container = styled.div`
  img {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    object-fit: cover;
    opacity: 0.4;
    /* filter: blur(0.2rem); */
  }
`;

const RandomBackground = () => {
  const keyword = useThemeStore((store) => store.keyword);
  const [gif, setGif] = useState();
  useEffect(() => {
    fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=wWRjLNS6tiCZt1fiyaMz9VrRwHsfIUNB&tag=${keyword}`
    )
      .then((response) => response.json())
      .then((data) => {
        setGif(data.data.images.fixed_height_downsampled.url);
      })
      .catch((error) => console.warn("giphy api exceeded rate limit"));
  }, [setGif, keyword]);
  return (
    <MobileView>
      <Container>
        <img src={gif} alt="gif" />
      </Container>
    </MobileView>
  );
};

export default RandomBackground;
