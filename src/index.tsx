import React from "react";
import ReactDOM from "react-dom";
import { IError, Compiler, ICompilerResult, ISymbolTable } from "aqua-compiler";
import _ from "lodash";
import { JSONTree } from 'react-json-tree';
import * as Space from 'react-spaces';
import { Input, Button, Tabs, Menu } from 'antd';
const { TabPane } = Tabs;
import MonacoEditor, { monaco } from 'react-monaco-editor';
import "./styles/styles.less";

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
    compilerResult?: ICompilerResult;
    errors: IError[];
}

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    diagnosticCodesToIgnore: [ 2552, 1108, 2364, 2304, 1134, 2300, 2391, 7044, 1005, 1138, 1003, 1128, 2695, 1434, 7028, 7027, 7043, ],
});
 
//
// Example queries that can be put in the query editor.
//
const examples = [
    require(`./examples/first-example`).default,
    require(`./examples/app-global-get-ex`).default,

    require(`./examples/function-returns-one-integer`).default,
    require(`./examples/function-returns-no-value`).default,
    require(`./examples/function-returns-tuple`).default,
    require(`./examples/bad-function`).default,
    require(`./examples/program-captures-one-value-from-function`).default,
    require(`./examples/program-captures-tuple-from-function`).default,
    require(`./examples/program-returns-functions-result`).default,

    require(`./examples/tuple-initializer`).default,
    require(`./examples/tuple-assignment`).default,

];

class App extends React.Component<{}, IAppState> {

    constructor(props: {}) {
        super(props);

        this.state = { 
            code: examples[0].text, 
            errors: [],
        };
    }
    
    componentDidMount() {
        this.compileCode();    
    }

    //
    // Compiles the Aqua code and displays the result.
    //
    private compileCode() {
        const compiler = new Compiler({ outputComments: true });
        const result = compiler.compile(this.state.code)

        this.setState({
            compilerResult: result,
            errors: compiler.errors,
        });
    }
    
    //
    // Transforms a symbol table for display.
    //
    private transformSymbolTable(symbolTable: ISymbolTable) {
        const symbols: any = {};
        for (const symbol of symbolTable.getSymbols()) {
            symbols[symbol.name] = Object.assign({}, symbol);

            if (symbol.scope) {
                symbols[symbol.name].scope = this.transformSymbolTable(symbol.scope);
            }
        }

        return symbols;
    }

    render() {
        return (
            <Space.ViewPort>
                <Space.Top
                    size="70px"
                    >
                    <div className="pl-4 p-2">
                        <h1 className="text-2xl">Aqua language playground</h1>
                        <h2 className="text-lg">An interactive editor for the Aqua language</h2>
                    </div>
                </Space.Top>
                <Space.Fill>
                    <Space.Left 
                        size="300px"
                        className="pl-2 pt-2 overflow-hidden"
                        >
                        <Tabs type="card">
                            <TabPane 
                                tab="Examples"
                                className="overflow-y-auto"
                                >
                                <Menu 
                                    mode="vertical"
                                    >
                                    {examples.map(example => (
                                        <Menu.Item
                                            className="border-0 border-b border-solid border-gray-300"
                                            key={example.name}
                                            onClick={() => {
                                                this.setState(
                                                    {
                                                        code: example.text,
                                                    }, 
                                                    () => this.compileCode()
                                                );
                                            }}
                                            >
                                            {example.name}
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            </TabPane>
                        </Tabs>
                    </Space.Left>
                    <Space.Fill
                        className="pl-2 pt-2 overflow-hidden"
                        >
                        <Tabs type="card">
                            <TabPane 
                                tab="Aqua"
                                className="p-1 overflow-y-auto"
                                >
                                <MonacoEditor
                                    language="typescript"
                                    value={this.state.code}
                                    onChange={code => {
                                        this.setState({ code: code });
                                        _.debounce(() => this.compileCode(), 100)();
                                    }}
                                    options={{
                                        minimap: {
                                            enabled: false,
                                        },
                                        contextmenu: false,
                                        automaticLayout: true,
                                    }}
                                    />
                            </TabPane>
                        </Tabs>
                    </Space.Fill>
                    <Space.Right
                        size="40%"
                        className="pl-2 pt-2 overflow-hidden"
                        >
                        <Tabs type="card">
                            <TabPane 
                                tab="TEAL"
                                key="1"
                                className="p-1 overflow-y-auto"
                                >
                                <pre className="font-mono text-xs">
                                    {this.state.compilerResult?.output || ""}                    
                                </pre>
                            </TabPane>
                            <TabPane 
                                tab="Symbols"
                                key="2"
                                className="p-1 overflow-y-auto"
                                >
                                <pre className="font-mono text-xs">
                                    <JSONTree 
                                        data={this.state.compilerResult?.symbolTable !== undefined ? this.transformSymbolTable(this.state.compilerResult.symbolTable) : {}} 
                                        theme={theme}
                                        hideRoot={true}
                                        />
                                </pre>
                            </TabPane>
                            <TabPane 
                                tab="AST"
                                key="3"
                                className="p-1 overflow-y-auto"
                                >
                                <pre className="font-mono text-xs">
                                    <JSONTree 
                                        data={this.state.compilerResult?.ast || {}} 
                                        theme={theme}
                                        hideRoot={true}
                                        />
                                </pre>
                            </TabPane>
                            <TabPane 
                                tab="Code emitter"
                                key="4"
                                className="p-1 overflow-y-auto"
                                >
                                <pre className="font-mono text-xs">
                                    <JSONTree 
                                        data={this.state.compilerResult?.codeEmitter || {}} 
                                        theme={theme}
                                        hideRoot={true}
                                        />
                                </pre>
                            </TabPane>
                        </Tabs>
                    </Space.Right>
                </Space.Fill>
                <Space.Bottom
                    size="250px"
                    >
                    <Tabs type="card" size="small" className="p-2">
                        <TabPane 
                            tab="Errors"
                            className="p-2"
                            >
                            {this.state.errors.map((error: IError, index) => {
                                return (
                                    <div key={index}>
                                        {error.message} (line: {error.line}, column: {error.column})
                                    </div>
                                );
                            })}
                        </TabPane>
                    </Tabs>
                </Space.Bottom>
            </Space.ViewPort>
        );                
    }
}

ReactDOM.render(<App />, document.getElementById("root"));