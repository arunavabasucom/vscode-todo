import * as _vscode from "vscode";
declare global {
  const ts_vscode: {
    postMessage: ({ type: string, value: any }) => void;
  };

  //ts_vscode: any;
}
