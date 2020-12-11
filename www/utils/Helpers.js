sap.ui.define(
  "ctx/utils/Helpers",
  (function (Helpers) {
    return {
      generateGuid: function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (sMatch) {
            // generate a random integer between 0 (inclusive) and 16 (exclusive)
            var iRandom = (Math.random() * 16) | 0;
            // - x & 0x3 is equivalent to x % 3
            // - x | 0x8 is equivalent to x + 8
            var sGuid = sMatch === "x" ? iRandom : (iRandom & 0x3) | 0x8;
            return sGuid.toString(16);
          }
        );
      },
    };
  })() // IIFE - Inmediate Invokation Function Expression
);
