import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import * as polka from "polka";
import { TokenManager } from "./TokenModel";
/*express -> polka*/

export function auth() {
  const app = polka();
  app.get("/auth/:token", async (req, res) => {
    const { token } = req.params; /*:token -> stored in token inside req.param*/
    console.log(!token);
    if (!token) {
      /*if token is null*/
      res.end(`<h1>Something went wrong</h1>`);
    }
      console.log(token);
      await TokenManager.setToken(token);
      res.end(`<h1>Login successful</h1>`);
      /*we don't excepting any more request we are going to close the port */
      (app as any).server.close();
  });

  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(apiBaseUrl)
      );
    }
  });
}
