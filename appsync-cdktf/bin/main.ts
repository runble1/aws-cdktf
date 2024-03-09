import { App } from "cdktf";
import { MyInfrastructureStack } from "../lib/app";

const app = new App();
new MyInfrastructureStack(app, "MyInfrastructureStack");
app.synth();
