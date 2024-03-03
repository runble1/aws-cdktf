import { App } from "cdktf";
import { AppSyncApi } from "../lib/appsync/api";

const app = new App();
new AppSyncApi(app, "AppSyncApi");
app.synth();
