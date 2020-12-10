/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    www: '/',
    src: '/_dist_',
  },
  plugins: [

  ],
  install: [
    /* ... */
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    port: 8080,
    hostname: 'devspace.metana.io'
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
    /* ... */
  },
};
