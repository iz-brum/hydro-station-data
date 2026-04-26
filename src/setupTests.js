// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Ensure Testing Library / React know we're in an act environment (helps avoid some warnings)
try {
    // enable React 18 act environment when available
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
} catch (e) {
    // ignore on older environments
}

// Temporarily suppress the specific deprecation warning about ReactDOMTestUtils.act
// while we upgrade testing-library / react versions. This prevents noisy failing CI logs.
const __originalConsoleError = console.error;
console.error = function (...args) {
    try {
        const msg = args[0];
        if (typeof msg === 'string') {
            // match common variants of the deprecation warning
            if (msg.includes('ReactDOMTestUtils.act') || msg.includes('ReactDOMTestUtils.act is deprecated')) {
                return;
            }
        }
    } catch (e) {
        // fallthrough
    }
    return __originalConsoleError.apply(console, args);
};

