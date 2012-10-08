var EXPORTED_SYMBOLS = [];


Components.utils.import('chrome://spearch/content/spearch.jsm');
Components.utils.import('chrome://spearch/content/spearch.pref.jsm');
Components.utils.import('chrome://spearch/content/spearch.query.jsm');
Components.utils.import('chrome://spearch/content/spearch.str.jsm');


spearch.ui =
{
   onKeyDown: function (engineElement, queryElement, e)
   {
      // <return>
      if (e.keyCode === 8)
      {
         if (engineElement.parentNode.hidden === false && queryElement.value === "")
         {
            spearch.ui.removeEngine(engineElement, queryElement);
         }
      }
      else if (e.keyCode !== 16 && e.shiftKey)
      {
         switch (e.keyCode)
         {
            case 66:
            case 69:
            case 87:
               return false;
         }
      }
      return true;
   },

   onKeyUp: function (browser, engineElement, queryElement, e)
   {
      // enter
      if (e.keyCode === 13)
      {
         if (e.altKey)
         {
            spearch.ui.submitInNewTab(browser, engineElement.value, queryElement.value);
         }
         else
         {
            spearch.ui.submit(browser, engineElement.value, queryElement.value);
         }
         return false;
      }
      return true;
   },

   onInput: function (engineElement, queryElement, e)
   {
      var rawQuery = queryElement.value;
      var engineName = spearch.query.getEngineName(rawQuery);

      if (engineName.length > 0)
      {
         if (engineName === "_")
         {
            queryElement.value = spearch.query.removeEngine(rawQuery);
            spearch.ui.removeEngine(engineElement, queryElement);
         }
         else if (spearch.pref.hasEngine(engineName) === true)
         {
            queryElement.value = spearch.query.removeEngine(rawQuery);
            queryElement.searchParam = engineName;

            engineElement.value = engineName;
            engineElement.parentNode.hidden = false;
         }
      }
   },

   removeEngine: function (engineElement, queryElement)
   {
      queryElement.searchParam = "";
      engineElement.value = "";
      engineElement.parentNode.hidden = true;
   },

   submit: function (browser, engine, query)
   {
      var url = spearch.query.renderUrl(engine, query);
      browser.loadURI(url);
   },

   submitInNewTab: function (browser, engine, query)
   {
      var url = spearch.query.renderUrl(engine, query);
      browser.selectedTab = browser.addTab(url);
   },
};

dump(JSON.stringify(spearch.ui));
