"use client";

import useKernelSocket from "./useKernelSocket";

export default function useNotebookExecution(session, updateCellRef) {
    const { connected, sendExecute } = useKernelSocket(session);

    async function runCell(cell, startSessionRef) {
        // start session if available
        if (!session && startSessionRef?.current) {
            const s = await startSessionRef.current();
            if (s) {
                // no direct setter here; caller is expected to update session state
            }
        }

        if (!session?.current_kernel_id || !connected || !sendExecute) {
            updateCellRef.current?.({
                ...cell,
                outputs: [
                    {
                        type: "error",
                        ename: "ConnectionError",
                        evalue: "WebSocket not connected or session not started",
                        traceback: [],
                    },
                ],
            });
            return;
        }

        updateCellRef.current?.({
            ...cell,
            _isRunning: true,
            outputs: [],
            execution_count: null,
        });

        try {
            const handleOutputUpdate = (outputs, execution_count) => {
                updateCellRef.current?.({
                    ...cell,
                    outputs,
                    execution_count,
                    _isRunning: true,
                });
            };

            const result = await sendExecute(cell.source, handleOutputUpdate);
            updateCellRef.current?.({ ...cell, ...result, _isRunning: false });
        } catch (e) {
            console.error("WS execute failed", e);
            updateCellRef.current?.({
                ...cell,
                outputs: [
                    {
                        type: "error",
                        ename: "ClientError",
                        evalue: String(e),
                        traceback: [],
                    },
                ],
                _isRunning: false,
            });
        }
    }

    async function runAll(cells, startSessionRef) {
        const snapshot = [...(cells || [])];
        for (const c of snapshot) {
            if (c.cell_type === "code") {
                // eslint-disable-next-line no-await-in-loop
                await runCell(c, startSessionRef);
            }
        }
    }

    return { runCell, runAll };
}
