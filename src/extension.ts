//www.youtube.com/watch?v=a5DX5pQ9p5M&t=3632s
import * as vscode from "vscode";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-todo" is now active!');

  // registering a command
  // context.subscriptions.push(
  //   vscode.commands.registerCommand("vscode-todo.helloWorld", () => {
  //     vscode.window.showInformationMessage("Hello World from vscode_todo!");
  //   })
  // );
 const sidebarProvider = new SidebarProvider(context.extensionUri);

  // context.subscriptions.push(
  //   vscode.window.registerWebviewViewProvider(
  //     "vscode-todo-sidebar" /*should match the id of the view*/,
  //     sidebarProvider
  //   )
  // );
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        "vscode-todo-sidebar", /*should match the id of the view*/
        sidebarProvider
      )
    );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-todo.refreshWebviews", () => {
      HelloWorldPanel.kill();
      HelloWorldPanel.createOrShow(context.extensionUri);
      setTimeout(() => {
        vscode.commands.executeCommand(
          " workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-todo.helloWorld", () => {
      /* webview panel >> view */
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
