import React from "react";

const Head = props => {
    switch(props.element.level) {
        case 1:
            return (
                <h1 {...props.attributes}>
                    {props.children}
                </h1>
            )
        case 2:
            return (
                <h2 {...props.attributes}>
                    {props.children}
                </h2>
            )

        default: {
            return
        }
    }
}

export default Head