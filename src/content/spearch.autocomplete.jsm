var EXPORTED_SYMBOLS = [];


Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("chrome://spearch/content/spearch.jsm");


// https://developer.mozilla.org/en-US/docs/How_to_implement_custom_autocomplete_search_component

spearch.autocomplete = {};


//-----------------------------------------------------------------------------
// spearch.autocomplete.ResultsListener
//-----------------------------------------------------------------------------

spearch.autocomplete.ResultListener = function (engineName, ac_search, listener)
{
   this.discarded = false;
   this.results = "";
   this.engineName = engineName;
   this.ac_search = ac_search;
   this.listener = listener;
}

spearch.autocomplete.ResultListener.prototype =
{
   onStartRequest: function (request, ctx)
   {
   },

   onDataAvailable: function (request, context, inputStream, offset, count)
   {
      var sin = Components.classes["@mozilla.org/scriptableinputstream;1"]
                .createInstance(Components.interfaces.nsIScriptableInputStream);
      sin.init(inputStream);
      this.results += sin.read(count);
   },

   onStopRequest: function (request, ctx, status)
   {
      var resultsObj = JSON.parse(this.results);
      var result = null;
      var results = [];
      var i = 0;
      for (i; i < resultsObj[1].length && i < 5; ++i)
      {
         result = [];
         result[0];
         result[1] = resultsObj[1][i];
         results.push(result);
      }

      if (this.listener && this.discarded === false)
      {
         var autocomplete_result = new spearch.autocomplete.ResultProvider(this.engineName, results);
         this.listener.onSearchResult(this.ac_search, autocomplete_result);
      }
   }
};


//-----------------------------------------------------------------------------
// spearch.autocomplete.ResultProvider
//-----------------------------------------------------------------------------

// Implements nsIAutoCompleteResult
// https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIAutoCompleteResult

spearch.autocomplete.ResultProvider = function (engineName, results)
{
   this._engineName = engineName;
   this._results = results;
}

spearch.autocomplete.ResultProvider.prototype =
{
   _results: [],

   get searchString()
   {
    return "";
   },

   get searchResult()
   {
      return Components.interfaces.nsIAutoCompleteResult.RESULT_SUCCESS;
   },

   get defaultIndex()
   {
      return 0;
   },

   get errorDescription()
   {
    return "";
   },

   get matchCount ()
   {
      return this._results.length;
   },

   getValueAt: function(index)
   {
      return this._results[index][1];
   },

   getCommentAt: function(index)
   {
      return '';
   },

   getStyleAt: function(index)
   {
      return null;
   },

   getImageAt: function (index)
   {
      return this._results[index][0];
   },

   removeValueAt: function (index, removeFromDb)
   {
   },

   getLabelAt: function (index)
   {
      return this._results[index][1];
   },

   QueryInterface: XPCOMUtils.generateQI([ Components.interfaces.nsIAutoCompleteResult ])
};


//-----------------------------------------------------------------------------
// spearch.autocomplete.SearchProvider
//-----------------------------------------------------------------------------

// Implements nsIAutoCompleteSearch
// https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIAutoCompleteSearch

spearch.autocomplete.SearchProvider = function ()
{
}

spearch.autocomplete.SearchProvider.prototype =
{
   acResultListener : null,
   classID:           Components.ID('38a4d320-003c-11e2-a21f-0800200c9a66'),
   classDescription : "Spearch AutoComplete",
   contractID :       '@mozilla.org/autocomplete/search;1?name=spearch-autocomplete',

   startSearch: function (query, engineName, previousResult, listener)
   {
      var engines = {};
      var i = 0;
      var suggs = [];
      var ioChan = null;
      var acResultProvider = null;
      var acUrl = "";

      /*
      if (spearch.ui.isEditingEngine())
      {
         engines = spearch.pref.getEngines();

         i = 0;
         for (engineName in engines)
         {
            if (engineName[0] != '$')
            {
               suggs[i] = [];
               suggs[i][0] = "";
               suggs[i][1] = '!' + engineName + ' ' + query;
               ++i;
            }
         }

         acResultProvider = new spearch.autocomplete.ResultProvider(engineName, suggs);
         listener.onSearchResult(this, acResultProvider);
      }
      else
      {
*/
         if (engineName === "")
         {
            engineName = "$default";
         }

         if (spearch.pref.hasEngine(engineName))
         {
            acUrl = spearch.pref.getEngine(engineName).ac_url;
            acUrl = acUrl.replace("%s", query);

            this.acResultListener = new spearch.autocomplete.ResultListener(engineName, this, listener);

            ioChan = Components.classes["@mozilla.org/network/io-service;1"]
                     .getService(Components.interfaces.nsIIOService)
                     .newChannel(acUrl, null, null);
            ioChan.asyncOpen(this.acResultListener, null);
         }
      //}
   },

   stopSearch: function()
   {
      if (this.acResultListener !== NULL)
      {
         this.acResultListener.discard();
      }
   },

   QueryInterface: XPCOMUtils.generateQI([ Components.interfaces.nsIAutoCompleteSearch ])
};
