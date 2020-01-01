import { Mongo } from "meteor/mongo";

Meteor.methods({
  "weatherModules.insert": function({ moduleId, description }) {
    let insertedModule = weatherModules.insert(
      {
        moduleId,
        description
      },
      (error, result) => {
        if (error) console.log(error);
      }
    );
    return insertedModule;
  },
  "weatherModules.remove": function(module) {
    return weatherModules.remove(module);
  },
  "weatherModules.update": function(module, description) {
    return weatherModules.update(module._id, { $set: { description } });
  }
});

export const weatherModules = new Mongo.Collection("weatherModule");
