import {Child, Component, ComponentConfig, Elem} from "./types";
import htm from "htm/mini";

export const comp = <
    TProps extends object = {},
    TState = {},
    TUpdates extends Record<string, (props: TProps, state: TState, ...p: unknown[]) => TState> = {}
>(cfg: ComponentConfig<TUpdates, TState>): Component<TUpdates, TState> =>
    typeof cfg === "function"
        ? {state: () => ({}) as any, updates: {}, render: cfg}
        : {
            state: cfg.state ?? (() => ({}) as any),
            updates: cfg.updates ?? {} as any,
            render: cfg.render
        };

export function h<TProps extends object, TState>(type: string | Component<unknown, TState, TProps>, props: TProps, ...children: Child[]): Elem<TState, TProps> {
    const realType =
        typeof type !== "string"
        ? type
        : {state: {} as any, updates: {}, render: (props: object) => {
                    const elem = document.createElement(type);
                    for (const [prop, val] of Object.entries(props)) {
                        if (prop.startsWith("on")) {
                            const evName = prop[2].toLowerCase() + prop.slice(3);
                            elem.addEventListener(evName, val);
                        }
                        else if (prop === "style") {
                            if (typeof val === "string")
                                elem.style.cssText = val;
                            else Object.assign(elem.style, val);
                        }
                        else {
                            elem.setAttribute(prop, val);
                        }
                    }
                    return elem;
                }};

    return {
        comp: realType,
        state: undefined!,
        mount: undefined!
    };
}

export const html = htm.bind(h);

export function mount<TProps>(node: Node, comp: Component<unknown, unknown, TProps>, props: TProps) {
    // TODO: this is where the magic happens!
}