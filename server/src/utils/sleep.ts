// used in development to demonstrate slow loading data and browser fetching delay behavior while waiting
// for either server side rendering or browser side rendering
// note also that if you inspect the page source, the "{ !data ? (
//             <div>Loading...</div>
//             )" content will show when browser side rendering
// whereas in ssr, the page source will show the final results instead
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
