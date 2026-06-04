sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller) => {
    "use strict";
    
    return Controller.extend("view.navigation.tasks.ui5.ui5viewnavigationtask.controller.Form", {
        onInit() {
            this.oView = this.getView();
            this._router = sap.ui.core.UIComponent.getRouterFor(this);
            this._router.getRoute("RouteForm").attachPatternMatched(this.onFormRouteMatched, this);
        },

        onFormRouteMatched(event) {
            const selectedUserID = event.getParameter("arguments").selectedUserID;
            const userDetailsModel = this.oView.getModel("userDetails");
            const allUsers = userDetailsModel.getProperty("/Table");
            let matchedUser;
            allUsers.forEach(user => {
                if (user.tableLength === Number(selectedUserID)) {
                    matchedUser = user;
                }
            }); 
            userDetailsModel.setProperty("/selectedObjectData", matchedUser);
        },

        onBack() {
            this._router.navTo("RouteHome");
            this.oView.getModel('userDetails').setProperty("/editable", false);
            this.oView.byId('saveButton').setVisible(false);
        },
        
        onEdit() {
            this.oView.getModel('userDetails').setProperty("/editable", true);
            this.getView().byId("saveButton").setVisible(true);
            this.getView().byId("cancelButton").setVisible(true);
        },
        
        onCancel() {
            const router = sap.ui.core.UIComponent.getRouterFor(this);
            this.oView.byId('cancelButton').setVisible(false);
            this.oView.byId('saveButton').setVisible(false);
            this.oView.getModel('userDetails').setProperty("/editable", false);
            router.navTo("RouteHome");
        },

        onSave() {
            const router = sap.ui.core.UIComponent.getRouterFor(this);
            this.oView.getModel('userDetails').setProperty("/editable", false);
            const updatedUserData = this.oView.getModel('userDetails').getProperty("/selectedObjectData");
            const updatedUserID = updatedUserData.tableLength;
            const allUsers = this.oView.getModel('userDetails').getProperty("/Table");
            allUsers.forEach(user => { 
                if (user.tableLength === updatedUserID) {
                    Object.assign(user, updatedUserData);
                } 
            });
            this.oView.byId('saveButton').setVisible(false);
            router.navTo("RouteHome");
        }
    });
});