//www.youtube.com/watch?v=a5DX5pQ9p5M
import * as vscode from "vscode";
import { auth } from "./auth";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenModel";


export function activate(context: vscode.ExtensionContext) {
  /*using global_state we are going to set the value*/
  TokenManager.globalState = context.globalState;

  /*sidebar*/
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vscode-todo-sidebar" /*should match the id of the view*/,
      sidebarProvider
    )
  );
  /*sidebar*/

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-todo.refreshWebviews", async () => {
      HelloWorldPanel.kill();
      HelloWorldPanel.createOrShow(context.extensionUri);
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vscode-todo-sidebar-view"
      );
      setTimeout(() => {
        vscode.commands.executeCommand(
          " workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );

  /* create status bar */
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "${file-code} Add Todo"; /*setting up the status bar name*/
  item.command = "vscode-todo.addTodo";
  item.show();
  /* create status bar */

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-todo.addTodo", () => {
      const { activeTextEditor } = vscode.window;
      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active window");
        return;
      }
      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );
      /*sending text message to webview*/
      sidebarProvider._view?.webview.postMessage({
        type: "new-todo",
        value: text,
      });
      vscode.window.showInformationMessage("Text:" + text);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-todo.auth", () => {
      /* webview panel >> view */
      // HelloWorldPanel.createOrShow(context.extensionUri);
      auth();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-todo.helloWorld", () => {
      /* webview panel >> view */
      vscode.window.showInformationMessage(
        `Token:` + TokenManager.getToken()
      );
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-todo.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "What is favorite animal ?",
        "good",
        "bad"
      );
      if (answer === "bad") {
        vscode.window.showInformationMessage("Sorry to hear that !! ");
      } else {
        console.log({ answer });
      }
    })
  );
}

export function deactivate() {}
