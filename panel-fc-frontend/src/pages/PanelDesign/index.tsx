import AppLayout from "../../layouts/AppLayout";

function PanelDesignPage() {
    return(
        <AppLayout>
            <header className="h-16 rounded-xl bg-[var(--color-surface-2)] border-b border-gray-200 flex items-center px-4 mb-2">
                <span className="font-medium text-gray-800 flex justify-between gap-3 w-full">
                    <h1 className="text-2xl text-[var(--color-bg)]">{}</h1>
                    <h1 className="text-2xl text-[var(--color-bg)]">Panel View</h1>
                </span>
            </header>
            
            <h1>Panel Design Page</h1>
            <p>Welcome to the Panel Design Page!</p>
        </AppLayout>
    );
}

export default PanelDesignPage;
