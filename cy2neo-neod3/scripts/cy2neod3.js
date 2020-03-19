function Cy2NeoD3(config, graphId, tableId, sourceId, execId, urlSource, renderGraph, cbResult) {
    var neod3 = new Neod3Renderer();
	var neo = new Neo(urlSource);
	$("#"+execId).click(function(evt) {
		try {
			evt.preventDefault();
			var query = "  MATCH (n)-[r]->(m)\nRETURN n,r,m\nLIMIT 50;\n"
			console.log("Executing Query",query);
			var execButton = $(this).find('i');
			execButton.toggleClass('fa-play-circle-o fa-spinner fa-spin')
			neo.executeQuery(query,{},function(err,res) {
				execButton.toggleClass('fa-spinner fa-spin fa-play-circle-o')
				res = res || {}
				var graph=res.graph;
				if (renderGraph) {
					if (graph) {
						var c=$("#"+graphId);
						c.empty();
						console.log(graph);
						var graph = {nodes: [{id: "1", labels: [], name:'Andy'}], links: []}
						neod3.render(graphId, c ,graph);
						renderResult(tableId, res.table);
					} else {
						if (err) {
							console.log(err);
							if (err.length > 0) {
								sweetAlert("Cypher error", err[0].code + "\n" + err[0].message, "error");
							} else {
								sweetAlert("Ajax " + err.statusText, "Status " + err.status + ": " + err.state(), "error");
							}
						}
					}
				}
				if(cbResult) cbResult(res);
			});
		} catch(e) {
			console.log(e);
			sweetAlert("Catched error", e, "error");
		}
		return false;
	});
}
