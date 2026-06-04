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
            console.log(event.getParameter('arguments'));
            const userDetailsModel = this.oView.getModel("userDetails");
            const selectedUserID1 = event.getParameter("arguments").selectedUserID1;
            const selectedUserID2 = event.getParameter("arguments").selectedUserID2;
            const addRowQueryParam = window.decodeURI(event.getParameter("arguments")["?query"]?.add);
            if (addRowQueryParam === "true") {
                const userDetailsModel = this.oView.getModel("userDetails");
                userDetailsModel.setProperty("/selectedObjectData", {
                    fullName: "",
                    phno: "",
                    email: "",
                    id1: Number(selectedUserID1),
                    id2: Number(selectedUserID2),
                    dob: null,
                    passOrFail: ""
                });
                userDetailsModel.setProperty("/editable", true);
                this.oView.byId("submitButton").setVisible(true);
                this.oView.byId("editButton").setVisible(false);
                return;
            }
            const allUsers = userDetailsModel.getProperty("/Table");
            console.log(allUsers);
            let matchedUser;
            allUsers.forEach(user => {
                if (user.id1 === Number(selectedUserID1) && user.id2 === Number(selectedUserID2)) matchedUser = user;
            }); 

            // console.log(this.oView.getModel('userDetails').getData());
            console.log(matchedUser);
            userDetailsModel.setProperty("/selectedObjectData", matchedUser);
            console.log(userDetailsModel.getProperty("/selectedObjectData"));
            userDetailsModel.setProperty("/editable", false);
            this.oView.byId("submitButton").setVisible(false);
            this.oView.byId("editButton").setVisible(true);
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
            const model = this.oView.getModel("userDetails");
            this.oView.byId('cancelButton').setVisible(false);
            this.oView.byId('saveButton').setVisible(false);
            model.setProperty("/editable", false);
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
        },

        onSubmit() {
            const router = sap.ui.core.UIComponent.getRouterFor(this);
            const newUserData = this.oView.getModel('userDetails').getProperty("/selectedObjectData");
            const allUsers = this.oView.getModel('userDetails').getProperty("/Table");
            allUsers.forEach(user => {
                if (user.id1 === newUserData.id1 && user.id2 === newUserData.id2) {
                    alert("User with same ID already exists. Please change the ID and try again.");
                    return;
                } 
            });
            allUsers.push(newUserData);
            this.oView.getModel('userDetails').setProperty("/Table", allUsers);
            this.oView.byId('submitButton').setVisible(false);

            console.log(this.oView.getModel('userDetails').getData());

            router.navTo("RouteHome");
        }
    });
});