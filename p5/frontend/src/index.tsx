import App from './app.tsx';

import { createRoot } from 'react-dom/client';
import * as React from 'react';
import { StrictMode } from 'react';

function init() {
    // @ts-ignore
    const root = createRoot(document.getElementById('root'));
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
// Render your React component instead

init();
