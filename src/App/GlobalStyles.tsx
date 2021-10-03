import React, { FC } from "react";
import { Global, css } from "@emotion/react";
import { cssVar, lighten } from "polished";
import reset from "emotion-reset";
import fonts from "./fonts";

const GlobalStyles: FC = ({ ...props }) => {
  return (
    <Global
      styles={css`
        ${fonts}
        ${reset}

        html {
          box-sizing: border-box;
        }

        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }

        body {
          color: var(--color-white);
          background-color: var(--color-gray);
          overflow: hidden;
          font-size: 15px;

          &,
          input,
          textarea {
            font-family: "Fira Sans", sans-serif;
          }
        }

        #root {
          height: 100vh;
          width: 100vw;
        }

        svg {
          display: block;

          * {
            shape-rendering: geometricPrecision;
          }
        }

        ::selection {
          background: ${lighten(0.35, `${cssVar("--color-purple")}`)};
        }
      `}
      {...props}
    />
  );
};

export default GlobalStyles;
