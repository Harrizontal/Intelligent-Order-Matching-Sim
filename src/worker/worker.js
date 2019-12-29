export default () => {
    /* eslint-disable-next-line no-restricted-globals */
    // self.addEventListener('message', e => {
    //     if (!e) return;
    //     postMessage("Testing")
    // })

    
    self.onmessage = (e) => { /* eslint-disable-line no-restricted-globals */
        postMessage("hello")
    }
}