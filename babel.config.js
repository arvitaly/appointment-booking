module.exports =
  process.env.NODE_ENV === "test"
    ? {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          "@babel/preset-typescript",
        ],
      }
    : {
        presets: ["next/babel"],
        plugins: [],
      };
