export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1 overflow-auto bg-background text-foreground">
            {children}
        </main>
    );
}