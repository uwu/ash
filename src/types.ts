// utility
type Optional<T, TKeys extends string | number | symbol> = Partial<T> & Omit<T, TKeys>;

export type Component<TUpdates, TState = {}, TProps = {}> = {
    state(props: TProps): TState,
    updates: TUpdates,
    render(props: TProps, state: TState, update: TUpdates, mutate: (s?: TState) => void): Node;
};

export type ComponentConfig<TUpdates, TState = {}> =
    | Optional<Component<TUpdates, TState>, "state" | "updates">
    | Component<TUpdates, TState>["render"];

type OneChild = Node | string | number | boolean | null | undefined;
export type Child = OneChild | OneChild[];

export type Elem<TState, TProps> = {
    comp: Component<unknown, TState, TProps>,
    mount: Node,
    state: TState,
}