const NODE_ENV = process.env.NODE_ENV;

const IS_DEV = NODE_ENV === "development";
const IS_PRD = NODE_ENV === "production";
const IS_TEST = NODE_ENV === "test";

module.exports = {
  IS_DEV,
  IS_PRD,
  IS_TEST,
};
