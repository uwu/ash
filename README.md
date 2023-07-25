# Ash

A JS/TS UI framework that looks vaguely like Elm from a distance.

Ash believes in one simple thing:
the UI code need not be concerned with the precise detail of updating your state.
The UI should simply say what has happened, and other code can deal with the specifics.

## A brief intro via example

Ash is component-based, and you create an example component like this:

```ts
const CounterBtn = ash.comp({
    state: (props) => 0,
    updates: {
        incr: (state) => state + 1
    },
    render: (props, state, update) =>
        ash.html`<button onClick=${update.incr}>
            Increment from ${state}
        </button>`
});

CounterBtn.mount(document.querySelector("#root"));
```

Every component has a state. The initial value of this is set in the component definition.

You output your UI as DOM nodes, but the `ash.html` helper allows you to easily build DOM nodes,
and template in useful things.
It is using [`developit/htm`](https://github.com/developit/htm), by the way!!

Ash will not update parents of your component when they are re-rendered.

Each component has a set of updates that you can run.
These directly operate on the state, based on what was passed to it.
They produce the new state which the UI is rendered from.

## Stateless components and direct mutations

Stateless components are simpler.
They are built either by omitting `state` and `updates`, or just passing a function to `ash.comp`.

```js
const OneSimpleComponent = ash.comp({
    render: (props) => ash.html`<div>Hi!</div>`
});

const AnotherSimpleComponent = ash.comp((props) => ash.html`<div>Bye!</div>`);
```

The upside of Ash is that it lets you decouple your state updating logic from the places where
those updates are triggered.
Sometimes you really don't need this, so in those cases,
you can use the secret fourth function passed to your render func.

If your state is an object, you can mutate it, then just call `mutate`,
or you can, for any state type, pass the new one to `mutate`.

This will replace the state and re-render directly.

```js
const SimpleComponent = ash.comp({
    state: (props) => 0,
    render: (props, state, _, mutate) =>
        ash.html`<button onClick=${() => mutate(state + 1)}>${state}</button>`
})
```

Worth noting that Ash knows the difference between `mutate()` and `mutate(undefined)`,
so you can use `undefined` as a state safely,
without fear of Ash assuming that you've already mutated an object state :)

This imperative programming style may be more comfortable to some,
and is nice for simple components,
but removes the benefit of keeping your precise update logic away from the view.