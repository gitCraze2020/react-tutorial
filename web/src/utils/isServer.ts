export const isServer = () => typeof window === "undefined"; // returns false when server side rendering (code is executed on server)