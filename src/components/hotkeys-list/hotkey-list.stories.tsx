import React from "react";
import { storiesOf } from "@storybook/react";

import { HotkeyList } from "./hotkey-list";

storiesOf("HotkeyList", module).add("default", () => (
  <HotkeyList
    hotkeys={[
      { keys: ["cmd", "p"], description: "test hotkey" },
      {
        keys: ["alt", "p"],
        description:
          "long description long description long description long description "
      }
    ]}
  />
));
