Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
Components.utils.import('chrome://spearch/content/spearch.jsm');
Components.utils.import('chrome://spearch/content/spearch.autocomplete.jsm');

const NSGetFactory = XPCOMUtils.generateNSGetFactory([ spearch.autocomplete.SearchProvider ]);
