sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller) => {
    "use strict";
    
    return Controller.extend("view.navigation.tasks.ui5.ui5viewnavigationtask.controller.NotFound", {
        onInit() {
            this.oView = this.getView();
        },

        onNavBack() {
            const router = sap.ui.core.UIComponent.getRouterFor(this);
            router.navTo("RouteHome");
        }
    });
});