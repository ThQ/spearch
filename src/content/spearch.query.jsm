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

   renderUrl: function (query)
   {
      query = query.trim();
      var url_template = spearch.pref.getEngines()["$default"].url;

      if (query[0] === "!")
      {
         var next_space = query.indexOf(" ");
         if (next_space === -1)
         {
            next_space = query.length;
         }

         var engine_name = query.substring(1, next_space);
         if (spearch.pref.getEngines().hasOwnProperty(engine_name))
         {
            url_template = spearch.pref.getEngines()[engine_name].url;
            query = query.substring(next_space + 1);
         }
      }
      return url_template.replace("%s", query);
   }
};

