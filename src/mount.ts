import {Component, Elem} from "./types";
import {h} from "./h";

const updateHandler = <TState, TUpdates extends object>(elem: Elem<TState, unknown, TUpdates>): TUpdates => {
	const updateHandlers = {} as TUpdates;

	for (const update in elem.comp.updates) {
		const originalHandler = elem.comp.updates[update] as Function;

		updateHandlers[update] = ((...props: unknown[]) => {
			elem.state = originalHandler(elem.state, ...props);
			elem.needsRerender = true;
			queueMicrotask(() => render(elem));
		}) as any;
	}

	return updateHandlers;
};

const mutate = <TState>(elem: Elem<TState, unknown>) => (...args: [] | [TState])  => {
	if (args.length) elem.state = args[0];
	elem.needsRerender = true;
	queueMicrotask(() => render(elem));
}

export function render(elem: Elem<unknown, unknown>) {
	if (!elem.needsRerender) return;
	elem.needsRerender = false;

	const newMount = elem.comp.render(elem.props, elem.state, updateHandler(elem), mutate(elem) as any);

	if (elem.mount) {
		const sibling = elem.mount.nextSibling;
		const parent = elem.mount.parentNode!;
		parent.removeChild(elem.mount);
		parent.insertBefore(newMount, sibling);
	}

	elem.mount = newMount;
}

export function mount<TProps extends object>(node: Node, comp: Component<object, unknown, TProps>, props: TProps) {
	const elem = h(comp, props);
	render(elem);
	node.appendChild(elem.mount);

	return () => elem.mount?.parentNode?.removeChild(elem.mount);
}