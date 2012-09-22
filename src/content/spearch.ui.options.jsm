Components.utils.import('chrome://spearch/content/spearch.jsm');
Components.utils.import("chrome://spearch/content/spearch.ui.jsm");


spearch.ui.options = {

  addEmptyEngine: function () {
    var tree_children = spearch.ui.options.getEngineTreeChildren();
    var name_cell = document.createElement("treecell");

      var url_cell = document.createElement("treecell");
      var acUrlCell = document.createElement("treecell");

      var row = document.createElement("treerow");
      row.appendChild(name_cell);
      row.appendChild(url_cell);
      row.appendChild(acUrlCell);

      var item = document.createElement("treeitem");
      item.appendChild(row);

      tree_children.appendChild(item);
      name_cell.focus();
  },

  // Get the engine XUL tree
  getEngineTree: function () {
    return document.getElementById("spearch-engine-tree");
  },

  getEngineTreeChildren: function () {
    return spearch.ui.options.getEngineTree().getElementsByTagName("treechildren")[0];
  },

  // Load the engines from the preferences to the engine tree
  loadEngines: function () {
    var engines = spearch.pref.getEngines();
    var tree_children = spearch.ui.options.getEngineTreeChildren();

    for (var engine_name in engines) {
      var name_cell = document.createElement("treecell");
      name_cell.setAttribute("label", engine_name);

      var url_cell = document.createElement("treecell");
      url_cell.setAttribute("label", engines[engine_name]["url"]);

      var acUrlCell = document.createElement("treecell");
      if (engines[engine_name].hasOwnProperty("ac_url"))
      {
         acUrlCell.setAttribute("label", engines[engine_name].ac_url);
      }

      var row = document.createElement("treerow");
      row.appendChild(name_cell);
      row.appendChild(url_cell);
      row.appendChild(acUrlCell);

      var item = document.createElement("treeitem");
      item.appendChild(row);

      tree_children.appendChild(item);
    }
  },

   removeSelectedEngines: function ()
   {
      var tree = spearch.ui.options.getEngineTree();
      var tree_children = spearch.ui.options.getEngineTreeChildren();

      var rangeCount = tree.view.selection.getRangeCount();

      for (var i = 0; i < rangeCount; i++)
      {
         var start = {};
         var end = {};
         tree.view.selection.getRangeAt(i, start, end);

         for (var c = start.value; c <= end.value; c++)
         {
            tree_children.removeChild(tree.view.getItemAtIndex(c));
         }
      }
   },

   syncEnginesToPreference: function ()
   {
      var engines = {};
      var tree_children = spearch.ui.options.getEngineTreeChildren();

      for (var i = 0; i < tree_children.children.length; ++i)
      {
         var item = tree_children.children[i];
         var row = item.children[0];

         var engineName = row.children[0].getAttribute("label");
         var engineUrl = row.children[1].getAttribute("label");
         var engineAcUrl = row.children[2].getAttribute("label");

         if (engineUrl != "" && engineName != "")
         {
            engines[engineName] = {"url": engineUrl, "ac_url": engineAcUrl};
         }
      }
      return JSON.stringify(engines);
   }
};
