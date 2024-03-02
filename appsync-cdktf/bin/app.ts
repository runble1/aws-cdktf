#!/usr/bin/env node
import { App } from "cdktf";
import { MyAppSyncStack } from "../lib/appsync";

const app = new App();
new MyAppSyncStack(app, "MyAppSync");
app.synth();
