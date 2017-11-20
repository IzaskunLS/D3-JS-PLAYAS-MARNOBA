// Definimos las dimensiones
var margin = { top: 10, right:20, bottom: 20, left: 20 },
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

// Se inserta el svg
var svg = d3.select("svg")
    //se le asignar los atributos de tama?o
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom) 
    //se le asigna una posicion en el marco
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("font-family", "Amatic SC")
    .attr("font-size", "15")
    .attr("text-anchor", "middle"); 

var color = d3.scaleOrdinal(d3.schemeCategory20);

var pack = d3.pack()
    .size([width, height])
    .padding(1.5);

//Tratamiento del fichero para mostrar el grafico
d3.csv("MARNOBA_Muestreos.csv", 
       function(error, classes) {
                    if (error) throw error;
                     
                    //Se crea la estructura jerarquica con los objetos necesarios 
                    //para las burbujas, etiquetas, ....
                    var root = d3.hierarchy({children: classes})
                        .sum(function(d) { return d.N_item; })
                        .each(function(d) {
                          if (id = d.data.ItemMarnoba) {
                            var id, i = id.lastIndexOf();
                            d.id = id;
                            d.N_item  = d.data.N_item
                            d.package = d.data.CategoriaMarnoba;
                            d.class = d.data.ItemMarnoba;
                          }
                        });
                    //Se crean los nodos que recogen la información y que llevarán
                    //forma de burbuja. Un nodo por ItemMarnoba
                    var node = svg.selectAll(".node")
                      .data(pack(root).leaves())
                      .enter().append("g")
                      .attr("class", "node")
                      .attr("transform", 
                            function(d) { 
                        								return "translate(" + d.x 
                                                            + "," 
                                                            + d.y + ")";
                                        });
                    //Tooltip nos mostrara la información en detalle cuando 
                   //pasemos el ratón sobre la burbuja
                    var div = d3.select("#tooltip");
  
                    node.append("circle")
                    		//características base de la burbuja.
                        //El color se correspondera con la categoria Marnoba
                        .attr("id", function(d) { return d.id; })
                        .attr("r", function(d) { return d.r; })
                        .style("fill", function(d) { return color(d.package); })
                        //Acciones a realizar cuando el ratón se situa
                        //sobre la burbuja
                        .on("mouseover", function(d) {
                              // Black stroke when mouse over circle
                              d3.select(this)  
                                  .transition().duration(200)
                                  .attr("r", function(d) { return d.r + 1; })
                                  .style("stroke", "black")
                                  .style("stroke-width", 2);
                              div.transition().duration(100)
                                  .style("opacity", 1);
                              div.html("<strong>" 
                                       + d.package 
                                       + "</strong> Subcategoria: <strong>" 
                                       + d.class 
                                       + "</strong> Objetos: <strong>" 
                                       + d.N_item + "</strong>")
                                  .style("left", w/2 + "px")
                                  .style("top", 0 + "px");
                          })
                        //Acciones a realizar cuando el ratón se mueve
                        //sobre la burbuja
                         .on("mousemove", function(d) {
                              div.transition()
                                 .duration(100)
                                 .style("opacity", 1);
                              div.html("<strong>" 
                                       + d.package
                                       + "</strong> subcategoria <strong>"
                                       + d.class + "</strong> Objetos <strong>" 
                                       + d.N_item+ "</strong>")
                                  .style("left", w/2 + "px")
                                  .style("top", 0 + "px");
                          })
                        //Acciones a realizar cuando el ratón sale de la burbuja
                        //Esta recupera sus propiedades iniciales.
                         .on("mouseout", function(d) {
                            d3.select(this)                                
                                .transition().duration(200)
                                .attr("r", function(d){ return d.r; })
                                .style("stroke", 
                                       function(d) { return color(d.package); })
                                .style("stroke-width", 1);
                            div.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });


                    //Etiqueta de cada burbuja con el nombre del item 
                    //al que corresponde
                    node.append("text")
                        .attr("clip-path", 
                              function(d) { return "url(#clip-" + d.id + ")"; })
                        .selectAll("tspan")
                        .data(function(d) { 
                                       return d.class.split(/(?=[A-Z][^A-Z])/g);
                                          })
                        .enter().append("tspan")
                        .attr("x", 0)
                        .attr("y", function(d, i, nodes) { 
                                    return 13 + (i - nodes.length / 2 - 0.5) * 10;
                                                         })
                        .text(function(d) { return d; });

                    
  
                    
                  });



