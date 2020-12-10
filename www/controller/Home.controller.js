sap.ui.define(
  [
    'ctx/controller/BaseController',
    'ctx/utils/Helpers',
    'sap/ui/core/Fragment',
    'sap/ui/model/json/JSONModel',
  ],
  function (BaseController, Helpers, Fragment, JSONModel) {
    'use strict';
    return BaseController.extend('ctx.controller.Home', {
      onInit: function () {
        const svgLogo = sap.ui.require.toUrl('ctx/img/logo.svg');
        this.getView().setModel(
          new JSONModel({
            svgLogo: svgLogo,
          }),
          'homeModel',
        );
      },
      onCreate: function () {
        const oView = this.getView();
        const oList = this.byId('empresas');
        const oBinding = oList.getBinding('items');

        const oContext = oBinding.create(
          {
            nombre: '',
            rubro: '',
          },
          {
            groupId: 'empresasGroup',
          },
        );

        // create dialog lazily
        if (!this._createDialog) {
          this._createDialog = Fragment.load({
            id: oView.getId(),
            name: 'ctx.view.fragments.CreateEmpresas',
            controller: this,
          });
        }

        this._createDialog.then((oDialog) => {
          oDialog.setBindingContext(oContext); // Set newly created context
          oView.addDependent(oDialog); // Add dialog to the view
          oDialog.open();
        });
      },
      onCrear: function (oEvent) {
        this.getView().getModel().submitBatch('empresasGroup');
        this._createDialog.then((oDialog) => {
          oDialog.close();
        });
      },
      onItemPress: function (oEvent) {
        var sPath = oEvent.getSource().getBindingContext().getPath();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo('detail', {
          path: window.encodeURIComponent(sPath),
        });
      },
    });
  },
);
