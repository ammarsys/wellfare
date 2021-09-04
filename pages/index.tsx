import { useState } from "react";
import type { NextPage } from "next";
import Link from "next/Link";
import Head from "next/head";
import styled from "styled-components";
import { Container } from "../styled/reusable";
import { Button } from "../styled/reusable";
import { ScrollableCards, Showcase } from "../components";

const Hero = styled.section`
  width: 100%;
  height: 75vh;
  background-image: url("img/blob-scene-haikei.svg");
  background-size: cover;
  background-repeat: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .hero-info {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      font-size: 4rem;
      max-width: 550px;
      display: inline-block;
      font-weight: 900;
      line-height: 1.3;
    }

    p.subtitle {
      max-width: 400px;
      display: inline-block;
      font-size: 1.6rem;
      line-height: 1.3;
      margin-top: 1em;
    }

    ${Button} {
      margin-top: 2em;
    }
  }

  .scrollable-container {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    height: 100vh;
  }

  @media only screen and (max-width: 425px) {
    .hero-info {
      align-items: flex-start;
      text-align: start;

      h1 {
        font-size: 3rem;
      }
    }

    .scrollable-container {
      display: block;
      margin-top: 4em;
    }
  }

  @media only screen and (max-height: 425px) and (max-width: 812px) {
    height: auto !important;
    padding: 11em 0 !important;

    h1 {
      font-size: 2.5rem !important;
      width: 300px;
    }
  }
`;

const MailSection = styled.section`
  background-color: #fbfbfb;
  padding: 5em 0;
  width: 100%;
  min-height: 50vh;
  display: flex;
  align-items: center;

  ${Container} {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
  }

  p.subtitle {
    font-size: 1.6rem;
    line-height: 1.3;
    margin-top: 1.5em;
    max-width: 300px;
    display: inline-block;
  }

  .mail-input {
    background-color: #fff;
    display: inline-flex;
    padding: 0.7em 1.4em;
    margin-top: 3em;
    border-radius: 6px;
    box-shadow: 0px 4px 23px rgba(0, 0, 0, 0.14);
    width: 400px;
    justify-content: space-between;
    max-width: 100%;

    input {
      background-color: none;
      border: none;
      outline: none;
      width: 100%;
      padding-right: 1.2em;
    }

    button {
      color: #fafafa;
      padding: 0.4em 2em;
      font-size: 1.4rem;
      background: #117ee3;
      box-shadow: 0px 0px 7px 1px rgba(48, 89, 232, 0.65);
      border-radius: 3px;
      margin-top: 0.1em;
      display: inline-block;
      transition: 0.5s all;
      outline: none;
      border: none;
      margin-top: 0;

      &:hover {
        cursor: pointer;
        background: #2b95f8;
      }
    }
  }

  @media only screen and (max-width: 425px) {
    button {
      padding: 0.4em 1em !important;
    }
  }
`;

const UIFeaturing = styled.section`
  min-height: 50vh;
  text-align: center;
  display: flex;
  align-items: center;
  padding: 10em 0;

  .slider {
    margin-top: 5em;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    max-width: 300px;
    display: inline-block;
    line-height: 1.4;
  }
`;

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  return (
    <>
      <Head>
        <title>Wellfaree</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="wrapper">
        <Hero>
          <Container>
            <div className="hero-info">
              <h1>Summarize your mental state in a single place</h1>
              <p className="subtitle">
                Ever felt lost and emotionally burnt out? Cut it! Organize
                yourself and ur mental state using <b>Wellfaree</b>.
              </p>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </Container>
          <ScrollableCards changeInterval={5000}></ScrollableCards>
        </Hero>
        <UIFeaturing>
          <Container>
            <h2>Clean UI for the best experience ever.</h2>
            <Showcase />
          </Container>
        </UIFeaturing>
        <MailSection>
          <Container>
            <h2>Dont miss out on the latest news!</h2>
            <p className="subtitle">
              Subscribe to our newsletter to stay up to date to the latest
              updates
            </p>
            <div className="mail-input">
              <input
                type="text"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button>Subscribe</button>
            </div>
          </Container>
        </MailSection>
      </div>
    </>
  );
};

export default Home;
