"use client";

import React from "react";
import AddToolbar from "./AddToolbar";
import ActionsToolbar from "./ActionsToolbarModern";
import FullToolbar from "./FullToolbar";

export default function Toolbar(props) {
    const { mode = "full" } = props;

    if (mode === "add") return <AddToolbar {...props} />;
    if (mode === "actions") return <ActionsToolbar {...props} />;
    return <FullToolbar {...props} />;
}
