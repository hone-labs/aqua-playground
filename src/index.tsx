import React from "react";
import ReactDOM from "react-dom";
import Editor from 'react-simple-code-editor';
const { highlight, languages } = require('prismjs/components/prism-core');
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism.css";
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

const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633',
};

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
                        style={{ height: "50%" }}
                        value={this.state.code}
                        onValueChange={code => {
                            this.setState({ code: code });
                            _.debounce(() => this.compileCode(), 5000)();
                        }}
                        highlight={code => highlight(code, languages.js)}
                        padding={10}
                    />
                    <div
                        style={{ height: "50%" }}
                        >
                        <JSONTree 
                            data={this.state.ast} 
                            theme={theme}
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