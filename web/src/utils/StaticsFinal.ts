/**
 * Freezes the annotated class, making every static 'final'.
 * Usage:
 * @StaticsFinal
 * class MyClass {
 *      public static SOME_STATIC: string = "SOME_STATIC";
 *      //...
 * }
 */


// NOTE THIS IS NOT A USED FEATURE AT THE MOMENT
export function StaticsFinal(target: any) {
    Object.freeze(target);
};
