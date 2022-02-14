import React from "react";
import ReactDOM from "react-dom";
import Editor from 'react-simple-code-editor';
const { highlight, languages } = require('prismjs/components/prism-core');
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { compile, parse } from "aqua-compiler";
import _ from "lodash";
import { JSONTree } from 'react-json-tree';
 
const code = `function onRegister() {
    return 1;
}

function main() {
    return onRegister();
}

return main();
`;

console.log(parse); //fio:

interface IAppState {
    code: string;
    compiled: string;
    ast: any;
}
 
class App extends React.Component<{}, IAppState> {
    
    state = { 
        code: code, 
        compiled: "" ,
        ast: {},
    };

    componentDidMount() {
        this.compileCode();    
    }

    private compileCode() {
        this.setState({
            compiled: compile(this.state.code),
            ast: parse(this.state.code, () => {}),
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
                    <div className="overflow-auto" style={{ height: "50%" }}>
                        <JSONTree 
                            data={this.state.ast} 
                            />
                    </div>
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