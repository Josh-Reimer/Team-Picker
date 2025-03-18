if ('serviceWorker' in navigator) {
    // Register Service Worker on page load (if not registered before)
    window.addEventListener('load', async () => {
        const container = navigator.serviceWorker;
        container.addEventListener(
            'controllerchange',
            () => console.log(`Service Worker is changed (installed or removed).`)
        );
        if (container.controller === null) {
            console.log(`Register new SW for the app.`);
            await container.register('service-worker.js');
            console.log(`Service Worker is registered.`);
        } else console.log(`Service Worker is already registered.`);
    });
}