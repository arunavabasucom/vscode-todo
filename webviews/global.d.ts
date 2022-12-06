import * as _vscode from "vscode";
declare global {
  const ts_vscode: {
    postMessage: ({ type: string, value: any }) => void;
  };
  const apiBaseUrl: string;
  // const accessToken:string;
  //ts_vscode: any;
}
