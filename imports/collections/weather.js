import { Mongo } from "meteor/mongo";

// No client methods required, the Ui doesn't change the weather values.

export const weathers = new Mongo.Collection("weather");
