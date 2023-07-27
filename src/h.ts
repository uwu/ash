import { Child, Component, ProcessedProps } from "./types";
import htm from "htm/mini";

const childToNode = (child: Child) => {
	if (Array.isArray(child)) throw new Error("childToNode shouldn't be given an array.");
	if (child instanceof Node) return child;
	return new Text(child + "");
};

function componentH<TProps extends object, TState>(
	type: Component<object, TState, TProps>,
	props: ProcessedProps<TProps>,
): Node {
	let needsRerender = true;
	let state = type.state(props);
	let domnode: Node;
	let extraUnmount: undefined | (() => void);

	const updateHandlers = {} as Record<string, Function>;

	for (const update in type.updates) {
		const originalHandler = (type.updates as Record<string, Function>)[update];

		updateHandlers[update] = ((...args: unknown[]) => {
			state = originalHandler(props, state, ...args);
			needsRerender = true;
			queueMicrotask(render);
		}) as any;
	}

	const mutate = (...args: [] | [TState]) => {
		if (args.length) state = args[0];
		needsRerender = true;
		queueMicrotask(render);
	};

	function render() {
		if (!needsRerender) return;
		needsRerender = false;

		if (domnode) {
			extraUnmount?.();
			type.unmount?.(props, state, updateHandlers, mutate as any);
		}

		const newNodeRaw = type.render(props, state, updateHandlers, mutate as any);

		// TODO: i am not a fan of this, and intend to add proper support for returning multiple elements later.
		const newNode = Array.isArray(newNodeRaw) ? newNodeRaw[0] : newNodeRaw;

		if (domnode) {
			const sibling = domnode.nextSibling;
			const parent = domnode.parentNode!;
			parent.removeChild(domnode);
			parent.insertBefore(newNode, sibling);
		}

		domnode = newNode;

		extraUnmount = type.mount?.(props, state, updateHandlers, mutate as any);
	}

	render();

	return domnode!;
}

export function h<TProps extends object, TState>(
	type: string | Component<object, TState, TProps>,
	props: TProps,
	...children: Child[]
): Node {
	const processedChildren = (children || (props as any).children || []).flat(Infinity).map(childToNode);

	if (typeof type === "string") {
		const elem = document.createElement(type);

		for (const prop in props) {
			const val = props[prop] as any;

			if (prop === "children") {
			} else if (prop.startsWith("on")) {
				const evName = prop[2].toLowerCase() + prop.slice(3);
				elem.addEventListener(evName, val);
			} else if (prop === "style") {
				if (typeof val === "string") elem.style.cssText = val;
				else Object.assign(elem.style, val);
			} else {
				elem.setAttribute(prop, val);
			}
		}

		elem.append(...processedChildren);

		return elem;
	}

	return componentH(type, { ...props, children: processedChildren });
}

export const html = htm.bind(h);
