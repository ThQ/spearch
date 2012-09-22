var EXPORTED_SYMBOLS = [];

Components.utils.import('chrome://spearch/content/spearch.jsm');


spearch.str = {

   indexOfNonSpace: function (str, start_at)
   {
      var i;

      for (i = start_at; i < str.length; ++i)
      {
         if (str[i] !== ' ' && str[i] !== '\t')
         {
            return i;
         }
      }
      return -1;
   },

   indexOfSpace: function (str, start_at)
   {
      var i;

      for (i = start_at; i < str.length; ++i)
      {
         if (str[i] === ' ' || str[i] === '\t')
         {
            return i;
         }
      }
      return -1;
   }
};
