import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/Link";
import styled from "styled-components";
import { Container, GlowingBLue, Error } from "../../styled/reusable";
import { WatermarkInput, Pfp } from "../../components";
import { useEffect, useRef, useState } from "react";
import { useTextareaValidator } from "../../hooks/useTextareaValidator";
import { animated, useSpring, config } from "react-spring";
import { MouseEvent, TouchEvent } from "react";

const Wrapper = styled.main`
  min-height: 100vh;
  width: 100vw;
  height: auto;
  background-color: ${(props: any) => props.theme.backgroundColor};
  color: ${(props: any) => props.theme.mainColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${Container} {
    display: flex;
    flex-direction: column;
    gap: 2em;
    align-items: flex-start;
    min-height: 80vh;
    margin: 8em 0;

    justify-content: space-between;
  }

  .upper {
    width: 100%;
  }

  .top-bar {
    margin-bottom: 4em;
    width: 100% !important;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p.logo {
      font-weight: 700;
    }
  }

  .greetings {
    font-weight: 500;
    margin-bottom: 1.5em;
    max-width: 100%;

    span {
      font-weight: 700;
    }
  }

  textarea {
    width: 400px;
    max-width: 100%;
  }

  .details {
    margin-top: 2.5em;
    display: flex;
    flex-direction: column;
    gap: 1.5em;

    .summarize {
      cursor: pointer;
      color: ${(props) => props.theme.watermark};
      position: relative;
      display: inline-block;
      margin-top: 1em;
      width: 300px;

      &::before {
        content: "";
        background-color: ${(props) => props.theme.watermark};
        position: absolute;
        left: 0;
        bottom: -1em;
        width: 50px;
        height: 2px;
        display: inline-block;
        border-radius: 20px;
      }
    }

    .summarize.error {
      color: rgb(255, 0, 0, 0.4);

      &::before {
        background-color: rgb(255, 0, 0, 0.4);
      }
    }

    .summarize.active {
      span {
        margin-left: 0.8em;
      }
      color: ${(props) => props.theme.mainColor};

      &::before {
        display: none;
      }
    }
  }

  footer {
    display: flex;
    gap: 3em;
    margin-top: 2em;
    flex-direction: column;

    .btns {
      display: flex;
      gap: 3em;
      align-items: center;
    }

    button {
      ${GlowingBLue}
    }

    a {
      font-size: 1.4rem;
      margin-top: -0.5em;
      text-decoration: underline;
    }

    @media only screen and (max-width: 425px) {
      width: 100%;

      .btns {
        flex-direction: column;
        width: 100%;
        gap: 4em;

        button {
          width: 100%;
        }
      }
    }
  }
`;

// Emoji modal
const EmojiWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  display: none;

  .overlay {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
    opacity: 0;
    transition: 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.55);
    }
  }

  .modal {
    background-color: ${(props: any) => props.theme.maximum};
    padding: 4em;
    border-radius: 16px;
    position: relative;
    z-index: 4;
    display: flex;
    gap: 3em;
    flex-direction: column;
    display: none;

    .draggable {
      display: none;
      cursor: pointer;
    }

    .row {
      .emojis {
        margin-top: 2em;
        display: flex;
        gap: 2em;

        .emoji {
          font-size: 2.4rem;
          cursor: pointer;
          transition: 0.3s;

          &:hover {
            transform: translateY(-2px);
          }
        }
      }
    }

    span.close {
      position: absolute;
      top: 0.5em;
      right: 1em;
      color: ${(props: any) => props.theme.watermark};
      font-size: 2rem;
      padding: 0.5em;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        color: ${(props: any) => props.theme.shadedColor};
      }
    }
  }

  @media only screen and (max-width: 425px) {
    .draggable {
      display: inline-block !important;
      width: 80px;
      height: 3px;
      border-radius: 30px;
      background-color: ${(props: any) => props.theme.shadedColor};
      margin-bottom: 1em;
    }

    .modal {
      width: 100vw;
      position: fixed;
      left: 0;
      bottom: 0;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      border-top-left-radius: 40px;
      border-top-right-radius: 40px;
      justify-content: center;
      align-items: center;
      padding: 6em 0 !important;
      padding-top: 3em !important;
    }

    .close {
      display: none;
    }
  }
`;

const emojisList = [
  {
    name: "Like usual",
    emojis: ["😍", "😎", "😣", "🤑"],
  },
  {
    name: "Quirky",
    emojis: ["😈", "🤖", "😇", "😡"],
  },
  {
    name: "Crazy",
    emojis: ["😭", "😙", "🤕", "🤠"],
  },
];

const Entry: NextPage = () => {
  // TODO: To be replaced with graphql fetched username
  const [username, setUsername] = useState("Roland");
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const { register, handleTextareaSubmit, handleResults } =
    useTextareaValidator();
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [isMobile, setIssMobile] = useState(false);
  const modalRef = useRef<null | HTMLDivElement>(null);
  const lastDeltaY = useRef(0);
  const emojiSelector = useRef<HTMLParagraphElement | null>(null);

  // Variables for mobile popup window
  let touchStart = 0;
  let startTime = 0;
  let endTime = 0;

  const startDragging = (e: TouchEvent<HTMLDivElement>): void => {
    if (!modalRef || !modalRef.current) return;

    let deltaTop = window.innerHeight - e.touches[0].clientY;

    let touchEnd = window.innerHeight - deltaTop;
    endTime = performance.now();

    const deltaY = touchEnd - touchStart;

    lastDeltaY.current = deltaY;

    if (deltaY < 0) return;

    if (Math.round(deltaY) > 40 && Math.round(deltaY) < 50) {
      // deltaSpeed = v(final) - v(initial) = 0 = v(final)
      const deltaSpeed = deltaY / ((endTime - startTime) / 1000); // pixels per second (px/s)

      // if above 300 to 350 px/s then it's a pretty fast swipe
      if (deltaSpeed > 350) {
        closeModal();
        return;
      }
    }

    mobileModalApi.start({
      to: { y: String(deltaY) + "px" },
      immediate: true,
    });
  };

  const stopDragging = (e: TouchEvent<HTMLDivElement>): void => {
    if (modalRef && modalRef.current) {
      if (lastDeltaY.current + 20 >= modalRef.current.offsetHeight / 2) {
        closeModal();
        return;
      }

      if (lastDeltaY.current <= modalRef?.current.offsetHeight / 2) {
        mobileModalApi.start({
          to: { y: "0px" },
        });
      }
    }

    window.removeEventListener("touchmove", startDragging as any);
  };

  const initDrag = (e: TouchEvent<HTMLDivElement>): void => {
    let deltaTop = window.innerHeight - e.touches[0].clientY;
    touchStart = window.innerHeight - deltaTop;

    startTime = performance.now();
    window.addEventListener("touchmove", startDragging as any);
    window.addEventListener("touchend", stopDragging as any);
  };

  useEffect(() => {
    closeModal();

    return () => {};
  }, [isMobile]);

  // Spring styles for modal
  const [modalWrapperStyles, modalWrapperApi] = useSpring(
    {
      from: { display: "none" },
    },
    []
  );

  const [overlayStyles, overlayApi] = useSpring(
    {
      from: { display: "none", opacity: 0 },
      config: config.wobbly,
    },
    []
  );

  const [modalStyles, modalApi] = useSpring(
    {
      from: { display: "none", opacity: 0, scale: 0.8 },
    },

    []
  );

  const [mobileModalStyles, mobileModalApi] = useSpring(
    {
      from: { display: "none", y: "600px" },
    },

    []
  );

  const openModal = (): void => {
    modalWrapperApi.start({
      // start the wrapper
      to: async (animate) => {
        await animate({
          to: { display: "flex" },
        });

        // start the overlay
        overlayApi.start({
          to: async (animate) => {
            await animate({
              to: { display: "block" },
            });

            await animate({
              to: { opacity: 1 },
            });
          },
        });

        // start the actual modal

        modalApi.start({
          to: async (animate) => {
            await animate({
              to: { display: "flex" },
            });
            await animate({
              to: { opacity: 1, scale: 1 },
            });
          },
        });

        mobileModalApi.start({
          to: async (animate) => {
            await animate({
              to: { display: "flex" },
            });

            await animate({
              to: { y: "0px" },
            });
          },
        });
      },
    });
  };

  const closeModal = (): void => {
    mobileModalApi.start({
      to: async (animate) => {
        await animate({
          to: { y: "600px" },
        });

        await animate({
          to: { display: "none" },
        });
      },
    });

    // hide the modal
    modalApi.start({
      to: async (animate) => {
        await animate({
          to: { opacity: 0, scale: 0.8 },
        });

        await animate({
          to: { display: "none" },
        });
      },
    });

    // hide the overlay
    overlayApi.start({
      to: async (animate) => {
        await animate({
          to: { opacity: 0 },
        });

        await animate({
          to: { display: "none" },
        });

        // hide the wrapper
        modalWrapperApi.start({
          to: async (animate) => {
            await animate({
              to: { display: "none" },
            });
          },
        });
      },
    });
  };

  useEffect(() => {
    setIssMobile(document.body.offsetWidth <= 425);

    const resizeFn = () => {
      setIssMobile(document.body.offsetWidth <= 425);
    };

    window.addEventListener("resize", resizeFn);

    return () => {
      window.removeEventListener("resize", resizeFn);
    };
  }, []);

  return (
    <Wrapper>
      <Container>
        <div className="upper">
          <div className="top-bar">
            <p className="logo">Wellfaree</p>
            <Pfp url="/img/sample_pfp.jpg"></Pfp>
          </div>
          <h3 className="greetings">
            Welcome back, <span className="name">{username}</span>
          </h3>
          <div className="questions">
            <form>
              <WatermarkInput
                main={true}
                placeholder="How are you feeling today?"
                label="Overall feeling"
                toFocus={true}
                {...register()}
              />

              <div className="details">
                <WatermarkInput
                  main={false}
                  placeholder="What’s been bothering you throughout the day?"
                  label="Bothers"
                  {...register()}
                />
                <WatermarkInput
                  main={false}
                  placeholder="What are you grateful for at this very moment?"
                  label="Gratefulness for"
                  {...register()}
                />
                <p
                  ref={emojiSelector}
                  className="summarize"
                  onClick={openModal}
                >
                  {currentEmoji
                    ? `Report summarized with`
                    : `Summarize your day with an emoji`}
                  {currentEmoji && <span>{currentEmoji}</span>}
                </p>
              </div>
            </form>
          </div>
        </div>
        <footer>
          {error && <Error>{error}</Error>}
          <div className="btns">
            <button
              onClick={() => {
                // custom check if an emoji has been selected
                if (!currentEmoji) {
                  emojiSelector.current?.classList.add("error");
                }

                const raw_data = handleTextareaSubmit();
                const res = handleResults(raw_data);
                setError(res);

                if (!res && !currentEmoji) {
                  setError("Please, summarize your day with one emoji");
                  return;
                }

                if (!res) {
                  router.push("/app");
                }
              }}
            >
              Save the record
            </button>
            <Link href="/app">Skip, I’ll do this later.</Link>
          </div>
        </footer>
        <EmojiWrapper as={animated.div} style={modalWrapperStyles}>
          <animated.div
            onClick={closeModal}
            className="overlay"
            style={overlayStyles}
          ></animated.div>
          <animated.div
            style={isMobile ? mobileModalStyles : modalStyles}
            className="modal"
            ref={modalRef}
            onTouchStart={initDrag}
          >
            <div className="draggable" onTouchStart={initDrag}></div>
            {emojisList.map((emoji, index) => {
              return (
                <div className="row" key={index}>
                  <p className="name">{emoji.name}</p>
                  <div className="emojis">
                    {emoji.emojis.map((symbol) => (
                      <span
                        key={symbol}
                        onClick={() => {
                          setCurrentEmoji(symbol);
                          emojiSelector.current?.classList.add("active");
                          closeModal();
                        }}
                        className="emoji"
                      >
                        {symbol}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            <span className="close" onClick={closeModal}>
              &times;
            </span>
          </animated.div>
        </EmojiWrapper>
      </Container>
    </Wrapper>
  );
};

export default Entry;
