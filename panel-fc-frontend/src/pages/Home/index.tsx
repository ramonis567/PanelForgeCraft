import AppLayout from '../../layouts/AppLayout';

function Home() {
    return (
        <AppLayout>
            <h1>Home Page</h1>
            <div className="text-[var(--color-danger)] bg-[var(--color-alt-bg)]">
                Se isto não ficar vermelho, Tailwind não está rodando.
            </div>
        </AppLayout>
    );
}

export default Home;
