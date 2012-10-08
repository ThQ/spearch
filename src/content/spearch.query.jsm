var EXPORTED_SYMBOLS = [];


Components.utils.import('chrome://spearch/content/spearch.jsm');
Components.utils.import('chrome://spearch/content/spearch.str.jsm');


spearch.query =
{
   getEngineName: function (query)
   {
      var bangPos = query.indexOf("!", 0);

      if (bangPos !== -1)
      {
         bangPos += 1;
         var spacePos = spearch.str.indexOfSpace(query, bangPos);
         if (spacePos !== -1)
         {
            return query.substring(bangPos, spacePos);
         }
      }
      return "";
   },

   removeEngine: function (query)
   {
      var newQuery = query;
      var bangPos = query.indexOf("!", 0);
      var spacePos = 0;

      if (bangPos !== -1)
      {
         spacePos = spearch.str.indexOfSpace(query, bangPos);
         if (spacePos !== -1)
         {
             newQuery = query.substring(0, bangPos);
             newQuery += query.substring(spacePos + 1, query.length);
         }
      }
      return newQuery;
   },

   renderUrl: function (engineName, query)
   {
      query = (query) ? query.trim() : "";
      var urlTemplate = spearch.pref.getEngines()["$default"].url;

      if (engineName && engineName.length !== 0 && spearch.pref.hasEngine(engineName))
      {
         urlTemplate = spearch.pref.getEngines()[engineName].url;
      }
      return urlTemplate.replace("%s", query);
   }
};

