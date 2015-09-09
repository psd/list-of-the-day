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


/* add a card, with pagination */
var count = 0;
var page, row;

function add_card(item, kind, bodies) {

    var body = bodies[item['public-body']] || {};

    var card, middle, tags, footer, p;

    /* pagination */
    if (0 === (count % 8)) {
      page = d3.select("body").append("div").attr("class", "page");
    }

    if (0 === (count % 2)) {
      row = page.append("div").attr("class", "row");
    }
    count++;

  card = row.append("div")
    .attr("class", "card " + kind);

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
    .attr("class", "public-body " + item['public-body'] + (body.crest ? " crest" : "" ));

  if (body.crest) {
    p.append("img")
      .attr("src", "crests/" + body.crest + ".png");
  }

  p.append("a")
    .attr("href", body.website)
    .text(body.name);
}

function add_cards(url, kind, bodies) {
  d3.tsv(url, function(lists) {

    lists.forEach(function (item) {

      add_card(item, kind, bodies);
    });
  });
}

function get_bodies(callback) {
  d3.json(register_url('public-body'), function(data) {
    var bodies = register_index('public-body', data);
    build_css(bodies);
    callback(bodies);
  });
}

get_bodies(function (bodies) {
  add_cards(lists_url, "list", bodies);
});
