import AppLayout from "../../layouts/AppLayout";

function PanelDesignPage() {
    return(
        <AppLayout>
            <header className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4">
                <span className="font-medium text-gray-800">
                    Painel atual
                </span>
            </header>
            <h1>Panel Design Page</h1>
            <p>Welcome to the Panel Design Page!</p>
        </AppLayout>
    );
}

export default PanelDesignPage;
