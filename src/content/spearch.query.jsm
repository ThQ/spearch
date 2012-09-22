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
         var engine_end_pos = spearch.str.indexOfSpace(query, bangPos);
         if (engine_end_pos === -1)
         {
            engine_end_pos = query.length;
         }
         return query.substring(bangPos, engine_end_pos);
      }
      return "";
   },

   removeEngine: function (query)
   {
      query = query.trim();
      var newQuery = query;
      var bangPos = query.indexOf("!", 0);
      var spacePos = 0;

      if (bangPos !== -1)
      {
         spacePos = spearch.str.indexOfSpace(query, bangPos);
         newQuery = query.substring(0, bangPos);
         if (spacePos !== -1)
         {
             newQuery += query.substring(spacePos, query.length);
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

