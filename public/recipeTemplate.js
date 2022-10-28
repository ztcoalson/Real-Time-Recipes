(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['recipe'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<article class=\"recipe\">\r\n<div class=\"recipe-picture\">\r\n    <img class=\"url\" src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":3,"column":26},"end":{"line":3,"column":33}}}) : helper)))
    + "\" alt=\"\" />\r\n</div>\r\n<div class=\"recipe-content\">\r\n    <p class=\"recipe-name\">\r\n        "
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":7,"column":8},"end":{"line":7,"column":16}}}) : helper)))
    + "\r\n    </p>\r\n    <p class=\"recipe-servings\">\r\n        "
    + alias4(((helper = (helper = lookupProperty(helpers,"servings") || (depth0 != null ? lookupProperty(depth0,"servings") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"servings","hash":{},"data":data,"loc":{"start":{"line":10,"column":8},"end":{"line":10,"column":20}}}) : helper)))
    + "\r\n    </p>\r\n    <p class=\"recipe-tags\">\r\n        "
    + alias4(((helper = (helper = lookupProperty(helpers,"tags") || (depth0 != null ? lookupProperty(depth0,"tags") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tags","hash":{},"data":data,"loc":{"start":{"line":13,"column":8},"end":{"line":13,"column":16}}}) : helper)))
    + "\r\n    </p>\r\n</div>\r\n</article>\r\n\r\n";
},"useData":true});
})();