sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";
    
    return Controller.extend("view.navigation.tasks.ui5.ui5viewnavigationtask.controller.Form", {
        onInit() {
            this.oView = this.getView();
            const modelData = {
                selectedObjectData: {}
            }

            this._router = sap.ui.core.UIComponent.getRouterFor(this);
            
            this._router.getRoute("RouteForm").attachPatternMatched(this.onFormRouteMatched, this);
        },

        onFormRouteMatched(event) {
            // const selectedObjectDataReceivedInString = window.decodeURIComponent(event.getParameter("arguments").selectedObject);
            // const selecctedObjectDataRecivedInObject = JSON.parse(selectedObjectDataReceivedInString);
            // this.oView.getModel('userDetails').setProperty("/selectedObject", selecctedObjectDataRecivedInObject);
        },

        onBack() {
            this._router.navTo("RouteHome");
            this.oView.getModel('userDetails').setProperty("/editable", false);
        },

        onEdit() {
            this.oView.getModel('userDetails').setProperty("/editable", true);
            this.getView().byId("saveButton").setVisible(true);
        },

        onSave() {
            const router = sap.ui.core.UIComponent.getRouterFor(this);

            this.oView.getModel('userDetails').setProperty("/editable", false);
            
            const updatedObjectData = this.oView.getModel('userDetails').getProperty("/selectedObjectData");
            console.log("Save = " + updatedObjectData);
            // this._router.navTo("RouteHome", { 
            router.navTo("RouteHome", { 
                updatedObjectData: window.encodeURIComponent(JSON.stringify(updatedObjectData)) 
            });
        }
  });
});