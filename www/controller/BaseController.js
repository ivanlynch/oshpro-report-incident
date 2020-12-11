sap.ui.define(
  ['sap/ui/core/mvc/Controller', 'sap/ui/core/UIComponent', "sap/ui/core/routing/History"],
  function (Controller, UIComponent, History) {
    'use strict';
    return Controller.extend('ctx.controller.BaseController', {
      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel('i18n').getResourceBundle();
      },
      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo('overview', {}, true);
        }
      },
    });
  },
);
