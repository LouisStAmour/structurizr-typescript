import { Workspace } from "./core/model/workspace";
import { StructurizrClient } from "./client/api/structurizrClient";
import { InteractionStyle } from "./core/model/interactionStyle";
import { Location } from "./core/model/location";

var workspace = new Workspace();
workspace.name = "Monkey Factory";

var user = workspace.model.addPerson("User", "uses the system")!;

var admin = workspace.model.addPerson("Admin", "administers the system and manages user")!;

admin!.interactsWith(user!, "manages rights");

var factory = workspace.model.addSoftwareSystem("Monkey Factory", "Oversees the production of stuffed monkey animals")!;
factory.location = Location.Internal;
var ingress = factory.addContainer("ingress", "accepts incoming telemetry data", "IoT Hub")!;
var storage = factory.addContainer("storage", "stores telemetry data", "Table Storage")!;
var frontend = factory.addContainer("frontend", "visualizes telemetry data", "React")!;
ingress.uses(storage, "store telemetry", "IoT Hub routing");
frontend.uses(storage, "load telemetry data", "Table Storage SDK");

var crm = workspace.model.addSoftwareSystem("CRM system", "manage tickets")!;
crm.location = Location.External;
factory.uses(crm, "Create tickets", "AMQP", InteractionStyle.Asynchronous);

user.uses(factory, "view dashboards");
admin.uses(factory, "configure users");
admin.uses(crm, "work on tickets");

var systemContext = workspace.views.createSystemContextView(factory, "factory-context", "The system context view for the monkey factory");
systemContext.addNearestNeighbours(factory);

var containerView = workspace.views.createContainerView(factory, "factory-containers", "Container view for the monkey factory");
containerView.addAllContainers();
containerView.addNearestNeighbours(factory);

var client = new StructurizrClient("a2b0e864-e698-43b5-b677-3246b4602f60", "d0198ab0-1159-4cd8-b204-fc74b1d58c0d");
client.putWorkspace(18991, workspace).then((c) => {
    console.log("done", c);
}).catch(e => {
    console.log("error", e);
});