serve:	public-body.json
	http-server .

public-body.json:
	curl -s 'http://public-body.openregister.org/all.json?_pageSize=2000' | jsonlint > public-body.json

init:
	bower install d3.promise --save
