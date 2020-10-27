module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    // "plugin:prettier/recommended",
    "eslint:recommended",
    "prettier",
    "prettier/vue"
  ],
  rules: {
    "vue/script-indent": ["warn", 2],
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    indent: "off",
    semi: "warn"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
