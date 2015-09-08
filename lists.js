var lists_url = 'lists.tsv?';

function register_url(name) {
  // return 'http://' + name + ' .openregister.org/all.json',
  return name + '.json';
};

function register_index(name, data) {

  var index = {};
  data.entries.forEach(function (item) {
    index[item.entry[name]] = item.entry;
  });
  return index;
}


function build_css(bodies) {
  var styleSheet = document.styleSheets[document.styleSheets.length -1];

  Object.keys(bodies).forEach(function (key) {
    body = bodies[key];
    if (body['official-colour']) {
      styleSheet.insertRule("." + key + "{" +
        "border-left: 2px solid " + body['official-colour'] + ";" +
        "padding-left: 6px;" +
        "}",
        styleSheet.cssRules.length);
    }
  });
}

d3.json(register_url('public-body'), function(data) {

  var bodies = register_index('public-body', data);
  build_css(bodies);

  d3.tsv(lists_url, function(lists) {

    var page, row, card, middle, tags, footer, p;
    var count = 0;

    lists.forEach(function (item) {

      var body_id = item['public-body'];
      var body = bodies[body_id] || {};

      if (0 === (count % 8)) {
        page = d3.select("body").append("div").attr("class", "page");
      }

      if (0 === (count % 2)) {
        row = page.append("div").attr("class", "row");
      }
      count++;

      card = row.append("div")
        .attr("class", "card");

      card.append("h2")
        .text(item.title);

      middle = card.append("div")
        .attr("class", "middle");

      tags = middle.append("div")
        .attr("class", "tags");

      middle.append("a")
        .attr("class", "url")
        .attr("href", item.url)
        .text(item.url);

      if (item.fields) {
        item.fields.split(";").forEach(function (field) {
          tags.append("span")
            .attr("class", "tag")
            .text(field);
        });
      }

      footer = card.append("div")
        .attr("class", "footer");

      p = footer.append("p")
        .attr("class", "public-body " + body_id + (body.crest ? " crest" : "" ));

      if (body.crest) {
        p.append("img")
          .attr("src", "crests/" + body.crest + ".png");
      }

      p.append("a")
        .attr("href", body.website)
        .text(body.name);
    });
  });
});
