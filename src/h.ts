import {Child, Component, Elem, ProcessedProps} from "./types";
import htm from "htm/mini";
import {render} from "./mount";

const htmlElementComponent = (type: string) => ({
	state: {} as any,
	updates: {},
	render: (props: ProcessedProps<Record<string, any>>) => {
		const elem = document.createElement(type);

		for (const prop in props) {
			const val = props[prop];

			if (prop === "children") {
				elem.append(...val as Node[]);
			}
			else if (prop.startsWith("on")) {
				const evName = prop[2].toLowerCase() + prop.slice(3);
				elem.addEventListener(evName, val);
			} else if (prop === "style") {
				if (typeof val === "string") elem.style.cssText = val;
				else Object.assign(elem.style, val);
			} else {
				elem.setAttribute(prop, val);
			}
		}

		return elem;
	},
});

const childToNode = (child: Child) => {
	if (Array.isArray(child)) throw new Error("childToNode shouldn't be given an array.");
	if (child instanceof Node) return child;
	return new Text(child + "");
}

export function h<TProps extends object, TState>(
	type: string | Component<object, TState, TProps>,
	props: TProps,
	...children: Child[]
): Elem<TState, TProps> {
	const realType =
		typeof type !== "string"
			? type
			: htmlElementComponent(type);

	const processedChildren = (children || (props as any).children || []).flat(Infinity).map(childToNode);

	const elem = {
		comp: realType,
		state: undefined!,
		mount: undefined!,
		props: {...props, children: processedChildren},
		needsRerender: true, // this is instantly set false by render()
	};

	render(elem);

	return elem;
}

export const html = htm.bind(h);