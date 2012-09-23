var EXPORTED_SYMBOLS = [];


Components.utils.import('chrome://spearch/content/spearch.jsm');


spearch.pref =
{
   getEngine: function (engineName)
   {
      if (spearch.pref.hasEngine(engineName) === true)
      {
         return spearch.pref.getEngines()[engineName];
      }
      return null;
   },

   getEngines: function ()
   {
      return spearch.pref.getObject("engines");
   },

   getEngineImage: function (engineName)
   {
      var engineUrl = "";
      var engineUrlObj = null;
      var engineUri = null;

      if (spearch.pref.hasEngine(engineName))
      {
         engineUrl = spearch.pref.getEngine(engineName).url;
         if (engineUrl !== "")
         {
            engineUrlObj = Components.classes["@mozilla.org/network/io-service;1"]
                            .getService(Components.interfaces.nsIIOService)
                            .newURI(engineUrl, null, null);
         }
         return engineUrlObj.scheme + "://" + engineUrlObj.host + "/favicon.ico";
      }
      return "";
   },

   getPrefManager: function ()
   {
      return Components.classes["@mozilla.org/preferences-service;1"]
               .getService(Components.interfaces.nsIPrefService)
               .getBranch("extensions.spearch.");
   },

   getObject: function (name)
   {
      return JSON.parse(spearch.pref.getString(name));
   },

   getString: function (name)
   {
      return spearch.pref.getPrefManager().getCharPref(name);
   },

   hasEngine: function (engineName)
   {
      dump("[" + engineName + "]" + spearch.pref.getEngines()[engineName] + "\n");
      return (engineName in spearch.pref.getEngines());
   }
};

