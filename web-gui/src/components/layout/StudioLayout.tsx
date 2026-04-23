import React from "react";

interface StudioLayoutProps {
    toolbar: React.ReactNode;
    settings: React.ReactNode;
    preview: React.ReactNode;
    timeline: React.ReactNode;
    header: React.ReactNode;
}

const styles = {
    main_container: "h-screen w-screen flex flex-col bg-studio text-foreground overflow-hidden font-sans",
    header: "h-12 border-b border-border bg-sidebar/50 flex items-center px-4 shrink-0 shadow-sm z-10",
    work_container: "flex-1 flex overflow-hidden",
    left_panel: "w-16 border-r border-border bg-sidebar flex flex-col items-center py-4 shrink-0 shadow-xl z-10",
    workspace: "flex-1 relative overflow-hidden flex items-center justify-center bg-black/40",
    right_panel: "w-80 border-l border-border bg-panel overflow-y-auto shrink-0 shadow-2xl z-10",
    footer: "h-40 border-t border-border bg-sidebar shrink-0 z-10",
}

export const StudioLayout = ({
    toolbar, settings, preview, timeline, header
}: StudioLayoutProps) => {
    return (
        <div className={styles.main_container}>
            <header className={styles.header}>
                {header}
            </header>
            <div className={styles.work_container}>
                <aside className={styles.left_panel}>
                    {toolbar}
                </aside>
                <main className={styles.workspace}>
                    {preview}
                </main>
                <aside className={styles.right_panel}>
                    {settings}
                </aside>
            </div>
            <footer className={styles.footer}>
                {timeline}
            </footer>
        </div>
    )
}
