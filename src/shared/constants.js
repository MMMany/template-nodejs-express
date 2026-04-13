const NODE_ENV = process.env.NODE_ENV;

export const IS_DEV = NODE_ENV === "development";
export const IS_PRD = NODE_ENV === "production";
export const IS_TEST = NODE_ENV === "test";
