# Coding Guidelines

This document specifies guidelines to be used for any code written in this project.

## Vue SFC

Vue SFCs must be in this format:

```vue
<template>
    <div class="crewlink-COMPONENT-NAME">
        
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        // any props here
    })
    
    // other code
</script>

<style lang="scss">
    @use '@/assets/mixins.scss' as m;
    
    .acquisit-COMPONENT-NAME {
        
    }
</style>
```

`COMPONENT-NAME` must be replaced with the component's name in kebap-case format, e.g. `my-new-component`.

- Indent the contents of `<template>`, `<script>` and `<style>` with 1 tab
- Prefer `ref()` over `reactive`
- Use options-style for props
- Ensure every prop is typed properly
- Ensure props have sensible defaults if they're optional
- Use `kebap-base` for event names
- Use `defineEmits()` for custom events
- Prefer `computed()` over methods for derived state
- Prefer `watch` and explicit management over `watchEffect`
- Keep template logic minimal - move complex logic to script

## Component Organization

- Component files use `PascalCase` filenames (e.g. `MyComponent.vue`)
- Component names in templates use `kebap-case` (e.g. `<my-component>`)
- Components in `/src/components/`
- Full views used by the router in `/src/views/`

## Testing

- No testing necessary

## HTML / Vue Template

The HTML tag and its first attribute must be in the same line. Each following attribute must be on its own line.
The self-closing tag (if applicable) must be on the same line as the last attribute.

The attributes should be sorted in this order:
1. Regular and v-bind attributes
2. Events

Leave empty lines between blocks of elements.
Indent with tabs.

For example:

```html
<some-component attribute1="value1"
                :attribute2="someVar"
                @some-event="doSomething" />

<div>
    <some-other-component attribute="value2" />
    <some-other-component attribute="value3" />
</div>
```

## TypeScript

- `kebap-case` for files and component names
- `PascalCase` interfaces, types, enums and classes
- `camelCase` for variables, functions and methods
- Opening brackets must be in the same line as the block opener (see examples below).
- Block keywords like `if`, `while`, `function` must be followed by a space
- Blocks must be separated by an empty line
- No semicolons unless necessary
- Typings in all arguments and return types
- Functions must be declared as arrow function, i.e. `const name = (args) => { code }`
- Prefer interfaces to types
- Use const whenever possible
- Spaces between operators
- Indent according to .editconfig
- No TSX
- Imports:
	- Vue imports first
	- Third-party libraries and AcquisitUI second
	- Local imports last
	- Group related imports
	- Use separate `import type {}` and `import {}` declarations

**Examples:**
```typescript
/**
 * Calculates something
 * 
 * @param {SomeType}        someArgument        Explanation of this argument
 * @param {SomeOtherType}   someOtherArgument   Another explanation of this argument
 */
export const someFunction = (someArgument: SomeType, someOtherArgument: SomeOtherType): SomeReturnType => {
    if (someArgument.count > 0) {
        // do something
    }

    const x = 90
    const y = 254
    let z = 0

    while (someOtherArgument.isAvailable()) {
        z += x + y
    }

    return someCall(x, y, z)
}
```

## CSS

- Use nesting
- No CSS frameworks
- Semantic class names
- No IDs anywhere
- Must be compatible with browsers reaching as far back as 2023
- Indent with 1 tab

## Accessibility

- Try to use best practices for screen readers everywhere

## Performance

- The whole application should always be as fast as possible
- No click should lead to more than 400ms reaction time
- Use lazy loading if it improves performance
- Split code up to improve loading times

## Documentation

- Write TSDoc for functions and interfaces
- Do not include @param and @return if their meanings are obvious from their types
- Only write comments if they help explain **why** something works the way it does
