import React, { FC } from "react";
import css from "./input.module.sass";

interface IInputProps {
  placeholder: string;
}

export const Input: FC<IInputProps> = ({ placeholder }) => (
  <input className={css.input} placeholder={placeholder} />
);
