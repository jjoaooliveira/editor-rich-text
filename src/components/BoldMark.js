import React from "react";

const BoldMark = props => {
    return (
        <strong {...props.attributes}>
            {props.children}
        </strong>
    )
}

export default BoldMark