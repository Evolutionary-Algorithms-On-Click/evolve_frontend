"use client";

import { useEffect, useState } from "react";

export default function ExecutionHistory() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const cacheData = localStorage.getItem("executionHistory");
        if (cacheData) {
            setData(JSON.parse(cacheData));
        }

        console.log(cacheData);
    }, []);

    return (
        <div>
            <h1>Execution History</h1>
        </div>
    );
}
