sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Messaging",
    "sap/ui/model/Sorter",
], (Controller, ResourceModel, MessageToast, JSONModel, Filter, FilterOperator, Messaging, Sorter) => {
    "use strict";

    return Controller.extend("view.navigation.tasks.ui5.ui5viewnavigationtask.controller.Home", {
        onInit() {
            this.oView = this.getView();
            this._isOpen = false;

            // initial data for the sort, filter, group and column visibility features of the table
            this._initialData = {
                columns: [
                    { visible: true, name: "passOrFail", label: "Status" },
                    { visible: true, name: "tableLength", label: "ID" },
                    { visible: true, name: "fullName1", label: "Name" },
                    { visible: true, name: "phno1", label: "Phone" },
                    { visible: true, name: "email1", label: "Email" },
                    // { visible: true, name: "addressString1", label: "Address" }
                ],
                sort: [
                    { sorted: true, name: "tableLength", label: "ID", descending: true },
                    { sorted: false, name: "fullName1", label: "Name", descending: false },
                    { sorted: false, name: "phno1", label: "Phone", descending: false },
                    { sorted: false, name: "email1", label: "Email", descending: false },
                    // { sorted: false, name: "addressString1", label: "Address", descending: false }
                ],
                group: [
                    { grouped: false, name: "passOrFail", label: "Status" },
                ],
                filter: [
                    { name: "fullName1", label: "Name" },
                    { name: "phno1", label: "Phone" },
                    { name: "email1", label: "Email" },
                    { name: "passOrFail", label: "Status" }
                ]
            };

            // attaching pattern matched event to the route to get the data passed from the form view when navigated back to home after editing and saving the details of the selected item
            this._router = sap.ui.core.UIComponent.getRouterFor(this);
            this._router.getRoute("RouteHome").attachPatternMatched(this.onHomeRouteMatched, this);

            Messaging.registerObject(view, true);
        },

        onHomeRouteMatched(event) {
            
        },

        // press event handler for the sort, filter, group and column visibility button which opens the pop up panel
        // and also sets the initial data for these features in the pop up
        onOpenSortPanel(event) {
            const popUp = this.oView.byId("p13nPopup");
            if (!this._isOpen) {
                this._setInitialData();
                this._isOpen = true;

                popUp.attachClose((oEvent) => {
                    if (oEvent.getParameter("reason") === "Ok") {
                        this.parseP13nState();
                    }
                });
            }
            popUp.open(event.getSource());
        },

        // function to set the initial data for the sort, filter, group and column visibility features in the pop up
        // used in onOpenSortPanel function
        _setInitialData() {
            const view = this.getView();

            const selectionPanel = view.byId("columnsPanel");
            const sortPanel = view.byId("sortPanel");
            const groupPanel = view.byId("groupPanel");

            selectionPanel.setP13nData(this._initialData.columns);
            sortPanel.setP13nData(this._initialData.sort);
            groupPanel.setP13nData(this._initialData.group);
        },

        // function to reset the current selections of the sort, filter, group and column visibility features to the initial state
        reset() {
            this._setInitialData();
            this.parseP13nState();
        },

        // function to get the p13n data and map it to the columns of the table
        parseP13nState() {
            const table = this.getView().byId("innerTable");
            const binding = table.getBinding("items");
            const view = this.getView();

            const aColumnState = view.byId("columnsPanel").getP13nData();
            const aSortState = view.byId("sortPanel").getP13nData();
            const aGroupState = view.byId("groupPanel").getP13nData();

            const columnMap = {
                "fullName1": "nameColumn",
                "phno1": "phoneColumn",
                "email1": "emailColumn",
                "passOrFail": "statusColumn",
                "tableLength": "idColumn"
            }

            aColumnState.forEach((columnState) => {
                const colId = columnMap[columnState.name];
                const col = view.byId(colId);
                if (col) {
                    col.setVisible(columnState.visible);
                }
            });

            if (!binding) return;

            const tableSorters = [];
            
            aGroupState.forEach((groupState) => {
                if (groupState.grouped) {
                    tableSorters.push(new Sorter(groupState.name, false, true));
                }
            });

            aSortState.forEach((sortState) => {
                if (sortState.sorted) {
                    tableSorters.push(new Sorter(sortState.name, sortState.descending));
                }
            });

            binding.sort(tableSorters);
        },

        // function for Go button of filter bar to apply the filters on the table
        onSearch() {
            const table = this.getView().byId("innerTable");
            let tableFilters = this.getView().byId('filterBar').getFilterGroupItems();
            const filters = [];
            tableFilters.forEach((filter) => {
                if (filter.getName() !== "passOrFail" && filter.getName() !== "sortPanelPopUp") {
                    let query = filter.getControl().getValue();
                    const colFilter = new Filter(filter.getName(), FilterOperator.Contains, query);
                    filters.push(colFilter);
                }
            })
            let selectedOption = this.getView().byId("statusSelect").getSelectedKey();
            filters.push(new Filter("passOrFail", FilterOperator.Contains, selectedOption));
            const binding = table.getBinding("items");
            binding.filter(filters);
        },

        onRowPress(event) {
            const router = sap.ui.core.UIComponent.getRouterFor(this);            
            const selectedUserDataID = event.getSource().getBindingContext("userDetails").getObject().tableLength;
            router.navTo("RouteForm", {
                selectedUserID: selectedUserDataID
            });
        }
    });
});