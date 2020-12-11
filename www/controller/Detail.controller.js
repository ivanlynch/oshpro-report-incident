sap.ui.define(
  ['ctx/controller/BaseController', 'sap/ui/core/Fragment'],
  function (BaseController, Fragment) {
    'use strict';
    return BaseController.extend('ctx.controller.Detail', {
      onInit: function () {
        this.getRouter()
          .getRoute('detail')
          .attachPatternMatched(this._onObjectMatched, this);
      },
      _onObjectMatched: function (oEvent) {
        const sPath = window.decodeURIComponent(
          oEvent.getParameter('arguments').path,
        );
        this.getView().bindElement(sPath);
      },
      onCreateEmpleado: function () {
        const oView = this.getView();
        const oList = this.byId('empleadosList');
        const oBinding = oList.getBinding('items');

        const oContext = oBinding.create(
          {
            name: '',
          },
          {
            groupId: 'empleadosGroup',
          },
        );

        // create dialog lazily
        if (!this._createEmpleadoDialog) {
          this._createEmpleadoDialog = Fragment.load({
            id: oView.getId(),
            name: 'ctx.view.fragments.CreateEmpleados',
            controller: this,
          });
        }

        this._createEmpleadoDialog.then((oDialog) => {
          oDialog.setBindingContext(oContext);
          oView.addDependent(oDialog);
          oDialog.open();
        });
      },
      onCrear: function (oEvent) {
        this.getView().getModel().submitBatch('empleadosGroup');
        this._createEmpleadoDialog.then((oDialog) => {
          oDialog.close();
        });
      },
    });
  },
);
