import React, { FC } from "react";

import { HotKeysNamespace } from "./hot-key-namespace";

export const DisableAllHotKeys: FC = ({ children }) => (
  <HotKeysNamespace name="DisableAllHotKeys">{children}</HotKeysNamespace>
);
