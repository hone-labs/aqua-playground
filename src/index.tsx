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
 
//
// Example queries that can be put in the query editor.
//
const examples = [
    require(`./examples/first-example`).default,
    require(`./examples/app-global-get-ex`).default,
    require(`./examples/function-returns-tuple`).default,
];

class App extends React.Component<{}, IAppState> {
    
    state = { 
        code: examples[0].text, 
        compiled: "" ,
        ast: {},
        errors: [],
    };

    componentDidMount() {
        this.compileCode();    
    }

    //
    // Compiles the Aqua code and displays the result.
    //
    private compileCode() {
        const errors: any[] = [];

        const compiled = compile(this.state.code, (err: IError) => {
            errors.push(err);
        });

        this.setState({
            compiled: compiled,
            ast: parse(this.state.code, () => {}),
            errors: errors,
        });
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
                        size="200px"
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