import React, { FC } from "react";
import cn from "classnames";

import { IS_WINDOWS } from "../../hotkeys/check-device";
import { Popup } from "../popup/popup";

import css from "./hotkey-list.module.scss";

interface IPreviewKeyMap {
  [index: string]: string;
}

export const previewKeyMap: IPreviewKeyMap = {
  cmd: "⌘",
  esc: "Esc",
  backspace: "⌫",
  shift: "⇧",
  enter: "↵",
  tab: "⇥",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  alt: IS_WINDOWS ? "Alt" : "⌥",
  ctrl: IS_WINDOWS ? "Ctrl" : "⌃",
  delete: IS_WINDOWS ? "Del" : "⌦"
};

interface IHotkeysList {
  hotkeys: {
    keys: string[];
    description: string;
  }[];
  classNames?: string;
  itemClassName?: string;
}

export const HotkeyList: FC<IHotkeysList> = ({
  hotkeys,
  classNames,
  itemClassName
}) => {
  if (!hotkeys.length) {
    return null;
  }
  return (
    <Popup>
      <ul className={cn(css.list, classNames)}>
        {hotkeys.map(({ keys, description }) => (
          <li className={cn(css.hotkey, itemClassName)} key={keys.join("+")}>
            <div>{description}</div>
            <div>
              {keys
                .map(key =>
                  previewKeyMap.hasOwnProperty(key)
                    ? previewKeyMap[key]
                    : key.toUpperCase()
                )
                .join(" + ")}
            </div>
          </li>
        ))}
      </ul>
    </Popup>
  );
};
