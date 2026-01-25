import NotebookEditor from "./_components/NotebookEditor";

export default async function Page({ params }) {
    // In Next.js App Router, `params` may be a resolved value that should be awaited
    const p = await params;
    const { problemID, notebookID } = p || {};

    return (
        <main>
            <NotebookEditor notebookId={notebookID} problemId={problemID} />
        </main>
    );
}
