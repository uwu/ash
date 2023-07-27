// utility
type Optional<T, TKeys extends string | number | symbol> = Partial<T> & Omit<T, TKeys>;

// removes the `props` and `state` from an update function
type ParamsFromUpdate<TUpdates> = TUpdates extends (props: any, state: any, ...p: infer TP) => any ? TP : never;

// removes the `props` and `state` from every function in the updates obj
type ProcessUpdates<TIn extends object> = {
	[p in keyof TIn]: (...args: ParamsFromUpdate<TIn[p]>) => ReturnType<TIn[p]>;
};

export type Component<TUpdates extends object, TState, TProps> = {
	state(props: TProps): TState;
	updates: TUpdates;
	render(
		props: ProcessedProps<TProps>,
		state: TState,
		update: ProcessUpdates<TUpdates>,
		mutate: (s?: TState) => void,
	): Node;
	mount?: (props: ProcessedProps<TProps>, state: TState) => undefined | (() => void);
	unmount?: (props: ProcessedProps<TProps>, state: TState) => void;
};

export type ComponentConfig<TUpdates extends object, TState, TProps> =
	| Optional<Component<TUpdates, TState, TProps>, "state" | "updates">
	| Component<TUpdates, TState, TProps>["render"];

type OneChild = Node | string | number | boolean | null | undefined;
export type Child = OneChild | OneChild[];

export type ProcessedProps<T> = T & { children: Node[] };
