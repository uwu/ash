import { Component, ComponentConfig } from "./types";

export const comp = <
  TProps extends object,
  TState,
  TUpdates extends Record<string, (props: TProps, state: TState, ...p: any[]) => TState>,
>(
  cfg: ComponentConfig<TUpdates, TState, TProps>,
): Component<TUpdates, TState, TProps> =>
  typeof cfg === "function"
    ? { state: () => undefined, updates: {}, render: cfg }
    : {
        state: cfg.state ?? (() => ({}) as any),
        updates: cfg.updates ?? ({} as any),
        render: cfg.render,
      };

export {h, html} from "./h";
