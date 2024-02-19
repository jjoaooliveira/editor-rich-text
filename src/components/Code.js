import React from "react";

const Code = props => {
    return (
        <pre {...props.attributes} className="code-container" style={{border: "1px solid black"}}>
            <code>{props.children}</code>
        </pre>
    )
}

export default Code