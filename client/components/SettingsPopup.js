import React, { useState } from "react";
import Popup from "reactjs-popup";
import { withTracker } from "meteor/react-meteor-data";
import { weatherModules } from "../../imports/collections/weatherModule";
import { Meteor } from "meteor/meteor";

const SettingsPopup = props => {
  const [newModuleId, setNewModuleId] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");

  // Adds a new module to the list
  const onAddModuleClick = event => {
    event.preventDefault();
    Meteor.call("weatherModules.insert", {
      moduleId: newModuleId,
      description: newModuleDescription
    });
    // Clear values to create next module
    setNewModuleId("");
    setNewModuleDescription("");
  };
  // Removes a module from the list
  const onRemoveModuleClick = (event, currentModule) => {
    event.preventDefault();
    Meteor.call("weatherModules.remove", currentModule);
  };
  // Renames an existing module
  const onRenameModuleChange = (event, currentModule) => {
    Meteor.call("weatherModules.update", currentModule, event.target.value);
  };
  // Changes the identifier for a new module to add (not yet saved)
  const onNewModuleIdChange = event => {
    setNewModuleId(event.target.value);
  };
  // Changes the description for a new module to add (not yet saved)
  const onNewModuleDescriptionChange = event => {
    setNewModuleDescription(event.target.value);
  };

  return (
    <Popup
      trigger={
        <div className="SettingsPopupTrigger">
          <i className="fas fa-lg fa-cog"></i>
        </div>
      }
      modal
    >
      <form className="ui form">
        <h2 className="ui dividing header">Settings</h2>
        <div className="content">
          {props.weatherModules && props.weatherModules.length != 0 && (
            <div className="ui info message">
              <p>Please set a name for each module.</p>
            </div>
          )}
          <div>
            {props.weatherModules.map(currentModule => {
              return (
                <div className="fields" key={currentModule.moduleId}>
                  <div className="inline field">
                    <label>Module #{currentModule.moduleId}</label>
                    <input
                      type="text"
                      name="description"
                      value={currentModule.description}
                      onChange={event => {
                        onRenameModuleChange(event, currentModule);
                      }}
                    />
                  </div>
                  <button
                    className="ui button"
                    onClick={() => {
                      onRemoveModuleClick(event, currentModule);
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          <div className="ui divider"></div>
          <div className="ui grid middle aligned">
            <div className="eleven wide column">
              <div className="fields">
                <div className="field">
                  <label>Identifier</label>
                  <input
                    type="text"
                    name="new_id"
                    value={newModuleId}
                    onChange={onNewModuleIdChange}
                  />
                </div>
                <div className="field">
                  <label>Description </label>
                  <input
                    type="text"
                    name="new_description"
                    value={newModuleDescription}
                    onChange={onNewModuleDescriptionChange}
                  />
                </div>
              </div>
            </div>
            <div className="five wide column AddModule">
              <button className="ui button" onClick={onAddModuleClick}>
                Add module
              </button>
            </div>
          </div>
        </div>
      </form>
    </Popup>
  );
};

export default withTracker(props => {
  // Do all your reactive data access in this method.
  // Note that this subscription will get cleaned up when your component is unmounted
  Meteor.subscribe("weatherModules");

  return { weatherModules: weatherModules.find({}).fetch() };
})(SettingsPopup);
