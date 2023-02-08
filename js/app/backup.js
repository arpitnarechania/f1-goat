function ellipseView() {

            var id = "#ellipsoidEraView";
            var majorArcGap = 150;
            var minorArcGap = 30;
            var noOfArcs = 3;
            var noOfEras = 13;

            var width = $(id).parent().width();
            var height = 800;
            var svgContainer = d3.select(id)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            for (var i = 0; i < noOfArcs; i++) {

                g = svgContainer.append("g");

                g.append("ellipse")
                    .attr("class", "main-arc major-arc")
                    .attr("cx", width)
                    .attr("cy", height)
                    .style("stroke-width", "1px")
                    .style("stroke", "red")
                    .attr("rx", width * 0.70 + i * majorArcGap)
                    .attr("ry", height * 0.55 + i * majorArcGap);

                g.append("ellipse")
                    .attr("class", "main-arc minor-arc")
                    .attr("cx", width)
                    .attr("cy", height)
                    .style("stroke-width", "1px")
                    .style("stroke", "red")
                    .attr("rx", width * 0.70 + i * majorArcGap + minorArcGap)
                    .attr("ry", height * 0.55 + i * majorArcGap + minorArcGap);
            }

            for (var i = 0; i < noOfEras; i++) {
                g = svgContainer.append("g");

                g.append("line")
                    .style("stroke", "black")
                    .style("stroke-width", "1px")
                    .style("stroke-opacity", "0.1")
                    .attr("x1", i * 110)
                    .attr("y1", height - i * 110)
                    .attr("x2", 450 + width / (noOfEras) + (i + 1) * 60)
                    .attr("y2", height);

            }

        }


        function toDegrees(angle) {
            return angle * (180 / Math.PI);
        }

        function toRadians(angle) {
            return angle * (Math.PI / 180);
        }

        function circularArc() {
            var id = "#ellipsoidEraView";

            var majorArcGap = 75;
            var minorArcGap = 10;
            var noOfArcs = 3;
            var noOfEras = 13;
            var degRadScale = d3.scale.linear().domain([0, noOfEras]).range([180, 0]);

            var width = $(id).parent().width();
            console.log($(id).parent().width());
            var height = 800;
            var svgContainer = d3.select(id)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            for (var i = 0; i < noOfArcs; i++) {

                g = svgContainer.append("g");

                g.append("circle")
                    .attr("class", "main-arc major-arc")
                    .attr("cx", width / 2)
                    .attr("cy", height)
                    .style("stroke-width", "1px")
                    .style("stroke", "red")
                    .attr("r", width / 2 * 0.50 + i * majorArcGap);

                g.append("circle")
                    .attr("class", "main-arc minor-arc")
                    .attr("cx", width / 2)
                    .attr("cy", height)
                    .style("stroke-width", "1px")
                    .style("stroke", "red")
                    .attr("r", width / 2 * 0.50 + i * majorArcGap + minorArcGap);
            }


            for (var i = 0; i < noOfEras; i++) {
                g = svgContainer.append("g");
                g.append("line")
                    .style("stroke", "black")
                    .style("stroke-width", "1px")
                    .style("stroke-opacity", "0.1")
                    .attr("x1", width / 2)
                    .attr("y1", height)
                    // .attr("x2", 0)
                    // .attr("y2", height)
                    // .attr("transform","rotate(-45)")
                    .attr("x2", function(d) {
                        r = width / 2 * 0.50 + i * majorArcGap + minorArcGap;
                        // console.log(i);
                        // return 800;
                        console.log("x" + toRadians(degRadScale(i)));
                        return r * Math.cos(toRadians(degRadScale(i)));
                    })
                    .attr("y2", function(d) {
                        r = width / 2 * 0.50 + i * majorArcGap + minorArcGap;
                        // console.log(i);
                        // return 800;
                        console.log("y" + toRadians(degRadScale(i)));
                        return r * Math.sin(toRadians(degRadScale(i)));
                    });

            }
        }


        function circle() {
            var id = "#eras";
            var width = $(id).parent().width();
            var height = 800;
            var maxRadius = width / 2;
            var minRadius = width / 2 - 50;

            var svg = d3.select(id)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height + ")");

            var arc = d3.svg.arc()
                .innerRadius(minRadius)
                .outerRadius(maxRadius)
                .startAngle(-Math.PI / 2)
                .endAngle(Math.PI / 2);

            svg.append("path")
                .attr("class", "arc")
                .attr("d", arc);
        }