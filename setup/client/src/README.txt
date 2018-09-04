## include files here that will add (or overwrite) the default files in the src/ directory.

Typically, this will include:

router/index.js  # custom routing (ensure each component referenced is also defined in the corresponding component directory)

components/Setup.vue # automatic main page with links to specified list of default components (corresponding to routes AND other defined components)


