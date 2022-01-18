import styled from '@emotion/styled'
import React from 'react'
import { Link } from 'react-router-dom'
import icon from "./../images/middle-finger.png"

const Container = styled.section`
display: flex;
align-items: center;
flex-direction: column;
justify-content: center;
height: 100vh;
`

const NotFound = ({error}) => {
  return (
    <Container>
      <h1>404</h1>
      <h2>Document not found</h2>
      <img src={icon} alt="Not found"/>
      <p>{JSON.stringify(error)}</p>
      <p><Link to="/">Return to homepage</Link></p>
    </Container>
  )
}

export default NotFound
