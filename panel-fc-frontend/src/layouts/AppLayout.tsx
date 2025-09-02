import React from 'react';

function AppLayout({ children }: { children: React.ReactNode }) {

    return (
        <div>
            <header>
                <h1>My Application</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>© 2023 My Application</p>
            </footer>
        </div>
    );
}

export default AppLayout;