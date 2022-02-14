import React from "react";
import ReactDOM from "react-dom";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { compile } from "aqua-compiler";
import _ from "lodash";
 
const code = `function onRegister() {
    return 1;
}

function main() {
    return onRegister();
}

return main();
`;

interface IAppState {
    code: string;
    compiled: string;
}
 
class App extends React.Component<{}, IAppState> {
    
    state = { 
        code: code, 
        compiled: "" 
    };

    componentDidMount() {
        this.compileCode();    
    }

    private compileCode() {
        this.setState({
            compiled: compile(this.state.code),
        });
    }

    render() {
        return (
            <div className="flex flex-row">
                <div className="p-5" style={{ width: "50%" }}>
                    <Editor
                        value={this.state.code}
                        onValueChange={code => {
                            this.setState({ code: code });
                            _.debounce(() => this.compileCode(), 500)();
                        }}
                        highlight={code => highlight(code, languages.js)}
                        padding={10}
                    />
                </div>
                <div style={{ width: "50%" }}>
                    <pre className="font-mono text-xs">
                        {this.state.compiled}                    
                    </pre>
                </div>
            </div>
        );                
    }
}

ReactDOM.render(<App />, document.getElementById("root"));