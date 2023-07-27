import { Component, ComponentConfig } from "./types";

export const comp = <
  TProps extends object = {},
  TState = {},
  TUpdates extends Record<string, (props: TProps, state: TState, ...p: unknown[]) => TState> = {},
>(
  cfg: ComponentConfig<TUpdates, TState>,
): Component<TUpdates, TState> =>
  typeof cfg === "function"
    ? { state: () => ({}) as any, updates: {}, render: cfg }
    : {
        state: cfg.state ?? (() => ({}) as any),
        updates: cfg.updates ?? ({} as any),
        render: cfg.render,
      };

export {h, html} from "./h";
