(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['ingredient'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<article class=\"ingredient\">\r\n    <p class=\"name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":20},"end":{"line":2,"column":28}}}) : helper)))
    + "</p>\r\n    <p class=\"category\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"category") || (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"category","hash":{},"data":data,"loc":{"start":{"line":3,"column":24},"end":{"line":3,"column":36}}}) : helper)))
    + "</p>\r\n    <p class=\"amount\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"amount") || (depth0 != null ? lookupProperty(depth0,"amount") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"amount","hash":{},"data":data,"loc":{"start":{"line":4,"column":22},"end":{"line":4,"column":32}}}) : helper)))
    + " "
    + alias4(((helper = (helper = lookupProperty(helpers,"measurement") || (depth0 != null ? lookupProperty(depth0,"measurement") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"measurement","hash":{},"data":data,"loc":{"start":{"line":4,"column":33},"end":{"line":4,"column":48}}}) : helper)))
    + "</p>\r\n</article>\r\n";
},"useData":true});
})();