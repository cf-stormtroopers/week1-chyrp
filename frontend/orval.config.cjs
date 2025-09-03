module.exports = {
  "cf1-backend": {
    input: "./openapi.json",
    output: {
      target: "./src/api/generated.ts",
      client: "swr",
      baseUrl: "http://100.109.46.43:8007"
    },
  },
};
