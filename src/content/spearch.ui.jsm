var EXPORTED_SYMBOLS = [];


Components.utils.import('chrome://spearch/content/spearch.jsm');
Components.utils.import('chrome://spearch/content/spearch.pref.jsm');
Components.utils.import('chrome://spearch/content/spearch.query.jsm');
Components.utils.import('chrome://spearch/content/spearch.str.jsm');


spearch.ui =
{
   editEngine: function ()
   {
      var queryWidget = spearch.ui.getQueryWidget();
      var engineWidget = spearch.ui.getEngineWidget();
      var qry = queryWidget.value;
      var newQuery = "";

      var bangPos = qry.indexOf("!", 0);
      var spacePos = -1;
      var newQuery = "";

      if (engineWidget.parentNode.hidden === true)
      {
         if (bangPos !== -1)
         {
            spacePos = spearch.str.indexOfSpace(qry, bangPos);
            if (spacePos === -1)
            {
               spacePos = qry.length;
            }
            queryWidget.selectionStart = bangPos + 1;
            queryWidget.selectionEnd = spacePos;
         }
         else
         {
            newQuery = "!";
            if (qry[0] !== ' ')
            {
               newQuery += ' ';
            }
            newQuery += qry;

            queryWidget.value = newQuery;
            queryWidget.selectionStart = 1;
            queryWidget.selectionEnd = 1;
         }
      }
      else
      {
         newQuery = "!" + engineWidget.value;
         newQuery += qry;

         engineWidget.parentNode.hidden = true;

         queryWidget.focus();
         queryWidget.value = newQuery;
         queryWidget.selectionStart = 1;
         queryWidget.selectionEnd = 1 + engineWidget.value.length;

      }
   },

   getEngineWidget: function ()
   {
      return spearch.document.getElementById("spearch-engine");
   },

   getQueryWidget: function ()
   {
      return spearch.document.getElementById("spearch-query");
   },

   getRawQuery: function ()
   {
      var rawQuery = spearch.ui.getQueryWidget().value;
      var engineWidget = spearch.ui.getEngineWidget();

      if (engineWidget.hidden === false && engineWidget.value.length !== 0)
      {
         rawQuery = "!" + engineWidget.value + " " + rawQuery;
      }
      return rawQuery;
   },

   isEditingEngine: function ()
   {
      var queryWidget = spearch.ui.getQueryWidget();
      var query = queryWidget.value;
      var bangPos = query.indexOf("!");
      var spacePos = 0;
      if (bangPos !== -1)
      {
         spacePos = query.indexOf(" ", bangPos);
         if (spacePos === -1)
         {
            return true;
         }
         else
         {
            return queryWidget.selectionStart <= spacePos;
         }
      }
      return false;
   },

   movePreviousWord: function () {
      var spearch_input = spearch.ui.getQueryWidget();

      if (spearch_input.selectionStart === 0) {
         spearch_input.selectionEnd = 0;
      } else {
         var start_at = spearch_input.selectionStart;
         if (start_at > 0 && spearch_input.value[start_at - 1] === " ") {
            start_at -= 2;
         }
         var space_at = spearch_input.value.lastIndexOf(" ", start_at);
         var word_start = (space_at !== -1) ? space_at + 1 : 0;

         space_at = spearch_input.value.indexOf(" ", word_start);
         var word_end = (space_at !== -1) ? space_at : spearch_input.value.length;

         spearch_input.selectionStart = word_start;
         spearch_input.selectionEnd = word_end;
      }
   },

   moveNextWord: function ()
   {
      var spearch_input = spearch.ui.getQueryWidget();
      var qry_len = spearch_input.value.length;

      var start_at = spearch_input.selectionEnd;

      var space_at = spearch_input.value.indexOf(" ", start_at);
      var word_start = 0;

      if (spearch_input.selectionEnd !== 0)
      {
         word_start = (space_at !== -1) ? space_at + 1 : spearch_input.value.length;
      }

      space_at = spearch_input.value.indexOf(" ", word_start);
      var word_end = (space_at !== -1) ? space_at : spearch_input.value.length;

      spearch_input.selectionStart = word_start;
      spearch_input.selectionEnd = word_end;
   },

   onKeyPress: function (e)
   {
      if (e)
      {
         if (e.keyCode === 8)
         {
            if (spearch.ui.getEngineWidget().parentNode.hidden === false && spearch.ui.getQueryWidget().value === "")
            {
               spearch.ui.removeEngine();
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
      }
      return true;
   },

   onKeyUp: function (e)
   {
      // enter
      if (e.keyCode === 13)
      {
         if (e.altKey)
         {
            spearch.ui.submitInNewTab();
         }
         else
         {
            spearch.ui.submit();
         }
      }
      else if (e.shiftKey)
      {
         // b
         if (e.keyCode === 66)
         {
            spearch.ui.movePreviousWord();
         // e
         }
         else if (e.keyCode === 69)
         {
            spearch.ui.editEngine();
         // w
         }
         else if (e.keyCode === 87)
         {
            spearch.ui.moveNextWord();
         }
      }
   },

   onInput: function (e)
   {
      var query = spearch.ui.getRawQuery();
      var queryWithoutEngine = spearch.ui.getQueryWidget().value;
      var engineName = spearch.query.getEngineName(queryWithoutEngine);
      var engineImageUrl = "";

      if (engineName !== "")
      {
         if (spearch.pref.hasEngine(engineName))
         {
            engineImageUrl = spearch.pref.getEngineImage(engineName);
            spearch.ui.setImage(engineImageUrl);
            spearch.ui.getQueryWidget().value = spearch.query.removeEngine(queryWithoutEngine);
            spearch.ui.getQueryWidget().searchParam = engineName;
            spearch.ui.getEngineWidget().value = engineName;
            spearch.ui.getEngineWidget().parentNode.hidden = false;
         }
         else
         {
            //spearch.ui.getEngineWidget().value = "";
            //spearch.ui.getEngineWidget().hidden = true;
            spearch.ui.getQueryWidget().searchParam = "";
         }
      }
   },

   onSearchButtonClick: function (e)
   {
      if (e)
      {
         if (e.button === 1)
         {
            spearch.ui.submitInNewTab();
         }
         else if (e.button === 0)
         {
            spearch.ui.submit();
         }
      }
   },

   removeEngine: function ()
   {
      spearch.ui.getQueryWidget().searchParam = "";
      spearch.ui.getEngineWidget().value = "";
      spearch.ui.getEngineWidget().parentNode.hidden = true;
   },

   setImage: function (imageUrl)
   {
      if (imageUrl === "")
      {
         imageUrl = "chrome://mozapps/skin/places/defaultFavicon.png";
      }
      //spearch.ui.getQueryWidget().getElementsByTagName("image")[0].setAttribute("src", imageUrl);
   },

   submit: function () {
      var url = spearch.query.renderUrl(spearch.ui.getRawQuery());
      spearch.getBrowser().loadURI(url);
   },

   submitInNewTab: function () {
      var url = spearch.query.renderUrl(spearch.ui.getRawQuery());
      spearch.getBrowser().selectedTab = spearch.getBrowser().addTab(url);
   },

   updateImage: function () {
      var query = spearch.ui.getRawQuery();
      var engineName = spearch.query.getEngineName(query);
      var engineImageUrl = spearch.pref.getEngineImage(engineName);
      spearch.ui.setImage(engineImageUrl);
   }
};

