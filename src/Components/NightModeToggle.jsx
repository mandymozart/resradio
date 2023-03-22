import styled from "@emotion/styled"
import useThemeStore from "../Stores/ThemeStore";
import { css, Global } from "@emotion/react";
import { BsMoon, BsSunFill } from "react-icons/bs";

const Container = styled.button`
  font-size: 1.5rem;
`
const NightModeToggle = () => {

  const { nightMode, setNightMode } = useThemeStore(store);

  return (<>
    <Container onClick={() => setNightMode(!nightMode)}>
      {nightMode ? <BsMoon /> : <BsSunFill />}
      {nightMode && (
        <>
          <Global
            styles={css`
            :root {
              --color: var(--color-night);
              --second: var(--second-night);
              --background: var(--background-night);
            }
            `}
          />
        </>
      )}
    </Container>
  </>
  )
}

export default NightModeToggle;