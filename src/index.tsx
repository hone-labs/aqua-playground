import React from "react";
import ReactDOM from "react-dom";
import Editor from 'react-simple-code-editor';
import Prism from "prismjs";
import { compile, IError, parse } from "aqua-compiler";
import _ from "lodash";
import { JSONTree } from 'react-json-tree';
import * as Space from 'react-spaces';
import { Input, Button, Tabs, Menu } from 'antd';
const { TabPane } = Tabs;
import "./styles/styles.less";

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
    errors: any[];
}
 
class App extends React.Component<{}, IAppState> {
    
    state = { 
        code: code, 
        compiled: "" ,
        ast: {},
        errors: [],
    };

    componentDidMount() {
        this.compileCode();    
    }

    private compileCode() {
        const errors: any[] = [];

        let compiled: string = "";

        try {
            compiled = compile(this.state.code, (err: IError) => {
                errors.push(err);
            });
        }    
        catch (err) {
            //
            // Possible compile errors.
            //
            console.error(`Error compiling Aqua code.`);
            console.error(err);
        }

        this.setState({
            compiled: compiled,
            ast: parse(this.state.code, () => {}),
        });
        this.setState({
            errors: errors,
        });
    }

    render() {
        return (
            <Space.ViewPort>
                {/* <Space.Top
                    size="150px"
                    >
                    <h1>Aqua language playground</h1>
                </Space.Top> */}
                <Space.Fill>
                    <Space.Left 
                        size="50%"
                        className="pl-2 pt-2 overflow-hidden"
                        >
                        <Tabs type="card">
                            <TabPane 
                                tab="Aqua"
                                className="p-1 overflow-y-auto"
                                >
                                <Editor
                                    style={{
                                        height: "100%",
                                    }}
                                    value={this.state.code}
                                    onValueChange={code => {
                                        this.setState({ code: code });
                                        _.debounce(() => this.compileCode(), 100)();
                                    }}
                                    highlight={code => Prism.highlight(code, Prism.languages.js, "javascript")}
                                    padding={10}
                                    />
                            </TabPane>
                        </Tabs>
                    </Space.Left>
                    <Space.Right
                    size="50%"
                        className="pl-2 pt-2 overflow-hidden"
                        >
                        <Tabs type="card">
                            <TabPane 
                                tab="TEAL"
                                key="1"
                                className="p-1 overflow-y-auto"
                                >
                                <pre className="font-mono text-xs">
                                    {this.state.compiled}                    
                                </pre>
                            </TabPane>
                            <TabPane 
                                tab="Abstract syntax tree"
                                key="2"
                                className="p-1 overflow-y-auto"
                                >
                                <pre className="font-mono text-xs">
                                    <JSONTree 
                                        data={this.state.ast} 
                                        theme={theme}
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
                                        {error.msg}
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