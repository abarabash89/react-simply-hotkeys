import React, { FC } from "react";
import { createPortal } from "react-dom";

import css from "./popup.module.scss";

export const Popup: FC = ({ children }) =>
  createPortal(
    <div className={css.popup}>
      <div className={css.content}>{children}</div>
    </div>,
    document.body
  );
