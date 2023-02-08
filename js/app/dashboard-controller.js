angular.module('vroom-vroom')
    .controller('DashboardCtrl', ['$scope', 'DATA_URL', 'DataService', '$timeout', function($scope, DATA_URL, DataService, $timeout) {
        $scope.showCompareView = false;
        $scope.showTimeseriesCharts = false;
        $scope.showSearch = false;

        function innerCircleOnClick(d, i) {
            if (Object.keys(selectedDriverInfo).length == 4 || d.driverId in selectedDriverInfo) {

                d3.selectAll(".driver-bubble").filter(function(p) {
                    return p.driverId == d.driverId
                }).attr("fill", function() {
                    return "white";
                });

                d3.selectAll(".driver-text").filter(function(p) {
                    return p.driverId == d.driverId
                }).attr("fill", "black");

                if (d.driverId in selectedDriverInfo) {
                    $scope.removeDriverFromCompareList(d.driverId);

                }

                $timeout(function(){$scope.$apply();});
                return;
            }

           /* console.log("is the code not coming here");*/
            $scope.selectedDriverInfo[d.driverId] = {
                driver: d,
                name: driver_id_name_mapping[d.driverId],
                inputOrder: compareOrder++
            };
            selectedDriverInfo = $scope.selectedDriverInfo;
            /*console.log("im here with selecteddriverinfo");
            console.log(selectedDriverInfo);*/
           /* console.log("ehjfbrejhf");
            console.log($scope.selectedDriverInfo);*/


            $scope.showCompareView = Object.keys(selectedDriverInfo).length > 0;
            $timeout(function(){$scope.$apply();});


            randomElement = comparisonColorsForDrivers.randomElement();
            driver_id_color_mapping[d.driverId] = randomElement;

           /* console.log(comparisonColorsForDrivers);
            console.log(driver_id_color_mapping);*/
            var index = comparisonColorsForDrivers.indexOf(randomElement);
            if (index > -1) {
                comparisonColorsForDrivers.splice(index, 1);
            }

            d3.selectAll(".driver-text").filter(function(p) {
                return p.driverId == d.driverId
            }).attr("fill", "white");

            d3.selectAll(".driver-bubble").filter(function(p) {
                return p.driverId == d.driverId
            }).attr("fill", function(d) {
                /* if(comparisonColorsForDrivers.length <= 0){
                     return "white";
                 }*/
                console.log(randomElement);
                return randomElement;
            });

            /* d3.selectAll(".driver-bubble").filter( function(p){
                return p.driverId == d.driverId
            }).attr("fill", "#D0021B");
*/

        }

        function getEra(year) {
            return {
                1977: [1977, 1982],
                1978: [1977, 1982],
                1979: [1977, 1982],
                1980: [1977, 1982],
                1981: [1977, 1982],
                1982: [1982, 1988],
                1983: [1982, 1988],
                1984: [1982, 1988],
                1985: [1982, 1988],
                1986: [1982, 1988],
                1987: [1982, 1988],
                1988: [1988, 1993],
                1989: [1988, 1993],
                1990: [1988, 1993],
                1991: [1988, 1993],
                1992: [1988, 1993],
                1993: [1993, 1994],
                1994: [1994, 1999],
                1995: [1994, 1999],
                1996: [1994, 1999],
                1997: [1994, 1999],
                1998: [1994, 1999],
                1999: [1999, 2004],
                2000: [1999, 2004],
                2001: [1999, 2004],
                2002: [1999, 2004],
                2003: [1999, 2004],
                2004: [2004, 2008],
                2005: [2004, 2008],
                2006: [2004, 2008],
                2007: [2004, 2008],
                2008: [2008, 2013],
                2009: [2008, 2013],
                2010: [2008, 2013],
                2011: [2008, 2013],
                2012: [2008, 2013],
                2013: [2013, 2019],
                2014: [2013, 2019],
                2015: [2013, 2019],
                2016: [2013, 2019],
                2017: [2013, 2019],
                2018: [2013, 2019],
                2019: [2019, 2020]
            }[year];

        }

        feature_display_mapping = {
            "Overall": "greatest_of_all_time",
            "Poles": "isPolePosition_sum",
            "Podium Finish": "isPodiumFinish_sum",
            "Podium Start": "isPodiumStart_sum",
            "Wins": "isWin_sum",
            "Points": "points_sum",
            "Pit Stops": "pit_time_count",
            "Races": "raceId_count",
            "Laps": "laps_sum",
        };

        var comparisonColorsForDrivers = ["#236FA3", "#349032", "#FF6B6B", "#FD9144"];

        Array.prototype.randomElement = function() {
            return this[Math.floor(Math.random() * this.length)]
        };

        var eraDifficultyDomain = [0 ,1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var eraDifficultyColorRange = ["#FF9C00", "#FF6F00", "#FF4D00", "#FF4400", "#FB1D00", "#E51800", "#DA1500", "#BA0D00", "#9A0600", "#810000", "#830000"];


        $scope.featureType = "normalized";

        compareOrder = 0;

        $scope.feature_display_mapping = feature_display_mapping;

        era_feature_mapping = {
            "overall": "Overall",
            "alcohol": "Alcohol (Fuel)",
            "gasoline": "Gasoline (Fuel)",
            "naturally_aspirated": "Naturally Aspirated Engine",
            "super_or_turbo_charged": "Turbocharger",
            "revolution_limit": "Revolutions",
            "cylinders": "Cylinders",
        }

        var selectedDriverInfo = {};
        $scope.selectedDriverInfo = selectedDriverInfo;
        $scope.comparisonSlots = [1, 2, 3, 4];
        var ranking_mapping = {};
        var driver_id_year_points_mapping = {};
        var all_years_data = [];
        var driver_name_id_mapping = {};
        var driver_id_name_mapping = {};
        var driver_id_color_mapping = {};
        var driver_id_initials_mapping = {};
        var year_era_mapping = {
            1977: 1977,
            1978: 1977,
            1979: 1977,
            1980: 1977,
            1981: 1977,
            1982: 1982,
            1983: 1982,
            1984: 1982,
            1985: 1982,
            1986: 1982,
            1987: 1982,
            1988: 1988,
            1989: 1988,
            1990: 1988,
            1991: 1988,
            1992: 1988,
            1993: 1993,
            1994: 1994,
            1995: 1994,
            1996: 1994,
            1997: 1994,
            1998: 1994,
            1999: 1999,
            2000: 1999,
            2001: 1999,
            2002: 1999,
            2003: 1999,
            2004: 2004,
            2005: 2004,
            2006: 2004,
            2007: 2004,
            2008: 2008,
            2009: 2008,
            2010: 2008,
            2011: 2008,
            2012: 2008,
            2013: 2013,
            2014: 2013,
            2015: 2013,
            2016: 2013,
            2017: 2013,
            2018: 2013,
            2019: 2019,
        };

        var f1ErasInformation = {
            1977: {
                name: "Ground Effect Era",
                description: "Ground effect (cars) In car design, ground effect is a series of aerodynamic effects which have been exploited to create downforce, particularly in racing cars. ",
                "img": "data/images/era/1977.png",
            },
            1982: {
                name: "1.5L Turbo-Charged Engines Era",
                description: "The power achieved by the turbocharged cars could finally match the 640 hp produced by the supercharged 1937 Mercedes-Benz W125, without a huge consumption of special fuel.",
                "img": "data/images/era/1982.png",
            },
            1988: {
                name: "3.5L Naturally Aspirated Engines, Active Suspension and Electronic Driver Aids Era",
                description: "In 1989, turbos were banned and new regulations allowing only naturally aspirated engines up to 3.5 litres were put in their place. ",
                "img": "data/images/era/1988.png",
            },
            1993: {
                name: "Safety, Rules and Regulations Era",
                description: "The FIA reacted swiftly and harshly to race deaths with major changes to be enforced from that year onwards, and it was the beginning of the FIA’s push to increase safety in Formula One. ",
                "img": "data/images/era/1993.png",
            },
            1994: {
                name: "3L Engines Era",
                description: "The downgraded 3-litre formula had no effect of the domination of the Renault V10. The FIA mandated a much larger minimum size cockpit area, along with driver’s head protection, to ensure the driver’s head was less exposed.",
                "img": "data/images/era/1994.png",
            },
            1999: {
                name: "V10 Engine and Road Car Manufacturer Team Era",
                description: "After the banning of turbocharged engines in 1989, V10 became the most popular engine configuration in Formula One, because it offered the best compromise between power and fuel consumption.",
                "img": "data/images/era/1999.png",
            },
            2004: {
                name: "2.4L V8 Engines",
                description: "The engines had to be 90° V8 of 2.4 litres maximum capacity with a circular bore of 98 mm (3.9 in) maximum, which implies a 39.8 mm (1.57 in) stroke at maximum bore.",
                "img": "data/images/era/2004.png",
            },
            2008: {
                name: "Cost Cutting measures and departure of Factory teams Era",
                description: "2009 saw the introduction of many new rules and regulations to encourage overtaking. Engines were revving up to 20,000 rpm and were finally limited to 18,000 rpm.",
                "img": "data/images/era/2008.png",
            },
            2013: {
                name: "1.6L turbocharged V6 hybrid engines Era",
                description: "All cars entering any Formula One championship race must run with 1.6-litre single turbocharged 6-cylinder engines with a rev limit of 15,000 rpm and maximum fuel flow of 100 kg/hr.",
                "img": "data/images/era/2013.png",
            },
            2019: {
                name: "1.6L turbocharged V6 hybrid engines Era",
                description: "All cars entering any Formula One championship race must run with 1.6-litre single turbocharged 6-cylinder engines with a rev limit of 15,000 rpm and maximum fuel flow of 100 kg/hr. ",
                "img": "data/images/era/2013.png",
            }
        }

        var id = "#eras";
        var selectedDrivers = [];
        var width = $(id).parent().width();
        var height = $(document).height() - 100;
        $("#searchDriverContainer").css("height",height/2-80);
        var globalConfig = {
            size: width,
            clipWidth: width,
            clipHeight: height,
            erasList: [1977, 1982, 1988, 1993, 1994, 1999, 2004, 2008, 2013, 2019],
            yearsList: [1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
            maxValue: 2019,
            minValue: 1977,
            lowThreshhold: 1990,
            highThreshhold: 2010,
            feature: "greatest_of_all_time",
            eraFeature: "overall_processed",
            noOfDataPoints: 5,
            minAngle: -135,
            maxAngle: 90,
            ringInset: 20,
            ringWidth: 20,
            majorTicks: 40,
            dataRadius: 11,
            labelInset: 15,
            rotateLabels: true,
            transitionTime: 1000,
            transitionExitTime: 1000,
            easingFunction: "sin",
            labelFormat: d3.format('g'),

            majorTickLabelsOpacity: 0.9,
            minorTickLabelsOpacity: 0.5,

            majorYearTickOpacity: 0.7,
            minorYearTickOpacity: 0.3,
            tickYearUnselectedOpacity: 0.2,

            circleFillColor: "#FFFFFF",
            circleStrokeOpacity: 0.8,

            circleFillOpacity: 0.9,
            circleFillOpacitySelected: 0.9,
            circleFillOpacityUnselected: 0.1,

            circleStrokeColor: "#000000",
            circleStrokeColorSelected: "#FF0000",
            circleStrokeColorUnselected: "#000000",

            circleTextColor: "#000000",

            svgTextColor: "#FFF",
            svgBackgroundColor: "#15151E",
        };

        var nested_data;

        function redraw(config, value) {
            globalConfig[config] = value;
            f1DashboardInstance.update(globalConfig, nested_data);
        }

        var F1Dashboard = function(containerId, width, height) {

            // AN NOTE: Are defaults, can be overridden when initializing the object
            var config = {
                lowThreshholdColor: '#B22222',
                defaultColor: 'steelblue',
                highThreshholdColor: '#008000',
                labelFormat: d3.format(',g'),
                labelInset: 15,
                rotateLabels: true
            };

            var arcColorFn;
            var range = undefined;
            var r = 600;
            var value = [];
            var container;
            var svg = undefined;
            var arc = undefined;
            var scale = undefined;
            var ticks = undefined;
            var tickData = undefined;
            var catColorScale2 = d3.scale.category20c();
            catColorScale = d3.scale.category20c();
            var numberOfCircleSlots = undefined;

            function deg2rad(deg) {
                return deg * Math.PI / 180;
            }

            function newAngle(d) {
                var ratio = scale(d);
                var newAngle = config.minAngle + (ratio * range);
                return newAngle;
            }

            function configure(configuration) {
                var prop = undefined;
                for (prop in configuration) {
                    config[prop] = configuration[prop];
                }

                range = config.maxAngle - config.minAngle;
                // r = config.size / 2;
                r = 600;

                config.level1Gap = config.ringWidth + (config.dataRadius * 2) * config.noOfDataPoints;
                config.level2Gap = config.ringWidth + 2 * config.level1Gap;

                // a linear scale that maps domain values to a percent from 0..1
                scale = d3.scale.linear()
                    .range([0, 1])
                    .domain([config.minValue, config.maxValue]);

                var colorDomain = config.erasList.map(scale),
                    colorRange = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#b15928'];
                arcColorFn = d3.scale.threshold().domain(colorDomain).range(colorRange)

                eraDifficultyScale = d3.scale.ordinal().domain(eraDifficultyDomain).range(eraDifficultyColorRange);

                ticks = scale.ticks(config.majorTicks);
                numberOfCircleSlots = ticks.slice(0, -1);

                tickData = config.erasList
                    .map(function(d) {
                        return scale(d);
                    });

                outermostArc = d3.svg.arc()
                    .innerRadius(r - config.ringInset - 1)
                    .outerRadius(r - config.level2Gap - config.ringInset)
                    .startAngle(function(d, i) {
                        var ratio = i > 0 ? tickData[i - 1] : 0;
                        return deg2rad(config.minAngle + (ratio * range));
                    })
                    .endAngle(function(d, i) {
                        var ratio = tickData[i]; //d * (i+1);
                        return deg2rad(config.minAngle + (ratio * range));
                    });

                tickYearData = config.yearsList
                    .map(function(d) {
                        return scale(d);
                    });

                level1Arc = d3.svg.arc()
                    .innerRadius(r - config.ringWidth - config.ringInset)
                    .outerRadius(r - config.ringInset)
                    .startAngle(function(d, i) {
                        var ratio = i > 0 ? tickYearData[i - 1] : 0;
                        return deg2rad(config.minAngle + (ratio * range));
                    })
                    .endAngle(function(d, i) {
                        var ratio = tickYearData[i]; //d * (i+1);
                        return deg2rad(config.minAngle + (ratio * range));
                    });


                level2Arc = d3.svg.arc()
                    .innerRadius(r - config.level1Gap - config.ringWidth - config.ringInset)
                    .outerRadius(r - config.level1Gap - config.ringInset)
                    .startAngle(function(d, i) {
                        var ratio = i > 0 ? tickYearData[i - 1] : 0;
                        return deg2rad(config.minAngle + (ratio * range));
                    })
                    .endAngle(function(d, i) {
                        var ratio = tickYearData[i]; //d * (i+1);
                        return deg2rad(config.minAngle + (ratio * range));
                    });

                level3Arc = d3.svg.arc()
                    .innerRadius(r - config.level2Gap - config.ringInset + config.ringWidth)
                    .outerRadius(r - config.level2Gap - config.ringInset)
                    .startAngle(function(d, i) {
                        var ratio = i > 0 ? tickYearData[i - 1] : 0;
                        return deg2rad(config.minAngle + (ratio * range));
                    })
                    .endAngle(function(d, i) {
                        var ratio = tickYearData[i]; //d * (i+1);
                        return deg2rad(config.minAngle + (ratio * range));
                    });
            }

            function centerTranslation() {
                return 'translate(' + r + ',' + r + ')';
            }

            function isRendered() {
                return (svg !== undefined);
            }

            function initSVG(width, height) {
                $scope.showSearch = true;
                $timeout(function(){$scope.$apply();});
                config.clipWidth = width;
                config.clipHeight = height;
                container = d3.select(containerId);

                svg = container.append('svg:svg')
                    .attr('class', 'mainGauge')
                    .attr('width', config.clipWidth)
                    .attr('height', config.clipHeight/2)
                    .attr("viewBox", "0 0 2100 1100")
                    .attr("preserveAspectRatio", "xMidYMid meet");

                g = svg.append('g')
                    .attr("transform", "translate(320,0)")

                //bubble rectangle
                g.append("line")
                    .attr("x1", 1270)
                    .attr("y1", 360)
                    .attr("x2", 1750)
                    .attr("y2", 360)
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("stroke", "gray");

                g.append("line")
                    .attr("x1", 1270)
                    .attr("y1", 1040)
                    .attr("x2", 1750)
                    .attr("y2", 1040)
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("stroke", "gray");

                //parameter set rectangle
                g.append("text")
                    .attr("transform", "translate(1600,1005)")
                    .attr("fill", "white")
                    .style("font-size", "1.5em")
                    .style("font-family", "F1 Font")
                    .text("Parameters Set");

                var featureGaugeInstanceG = g
                    .append("g")
                    .attr("transform", "translate(1350,700)")
                    .attr("width", 500)
                    .attr("height", 350);

                var featureGaugeInstance = featureGauge.arcslider()
                    .radius(130)
                    .events(false)
                    .indicator(featureGauge.defaultGaugeIndicator);

                featureGaugeInstance.axis().orient("out")
                    .normalize(true)
                    .ticks(9)
                    .tickSubdivide(0)
                    .tickSize(10, 8, 10)
                    .tickPadding(5)
                    .scale(d3.scale.linear()
                        .domain([0, 160])
                        .range([-3 * Math.PI / 4, Math.PI / 2]));

                featureGaugeInstanceG.append("g")
                    .attr("id", "featureGauge")
                    .attr("class", "featureGauge")
                    .call(featureGaugeInstance);

                d3.selectAll("#featureGauge text").on("click", function(d, i) {
                    d3.selectAll("#featureGauge text")
                        .attr("fill", "white");

                    d3.select(this)
                        .attr("fill", "red");

                    featureGaugeInstance.value(d);
                    globalConfig.feature = feature_display_mapping[Object.keys(feature_display_mapping)[i]];

                    selectedDriverInfo = {};
                    $scope.selectedDriverInfo = {};
                    comparisonColorsForDrivers = ["#236FA3", "#349032", "#FF6B6B", "#FD9144"];
                    driver_id_color_mapping = {};

                    $timeout(function(){$scope.$apply();});

                    loadNewDataset();
                });

                featureGaugeInstance.value(0);


                //technological set
                g.append("line")
                    .attr("x1", 1270)
                    .attr("y1", 700)
                    .attr("x2", 1750)
                    .attr("y2", 700)
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("stroke", "gray");

                g.append("text")
                    .attr("transform", "translate(1500,590)")
                    .attr("fill", "white")
                    .style("font-size", "1em")
                    .style("font-family", "F1 Font")
                    .text("0");

                g.append("text")
                    .attr("transform", "translate(1750,590)")
                    .attr("fill", "white")
                    .style("font-size", "1em")
                    .style("font-family", "F1 Font")
                    .text("10");

                g.selectAll('legend-rect')
                    .data(eraDifficultyDomain)
                    .enter()
                    .append("rect")
                    .attr("width", "25px")
                    .attr("height", "25px")
                    .attr("transform", function(d, i) {
                        return "translate(" + (1500 + i * 25) + "," + 600 + ")"
                    })
                    .attr("fill", function (d, i) {
                        return eraDifficultyColorRange[i];
                    });

                g.append("text")
                    .attr("transform", "translate(1570,665)")
                    .attr("fill", "white")
                    .style("font-size", "1.5em")
                    .style("font-family", "F1 Font")
                    .text("Technological Set");

                var featureGaugeInstanceG2 = g
                    .append("g")
                    .attr("transform", "translate(1350,380)")
                    .attr("width", 500)
                    .attr("height", 360);

                var featureGaugeInstance2 = eraGauge.arcslider()
                    .radius(120)
                    .events(false)
                    .indicator(eraGauge.defaultGaugeIndicator);

                featureGaugeInstance2.axis().orient("out")
                    .normalize(true)
                    .ticks(7)
                    .tickSubdivide(0)
                    .tickSize(10, 8, 10)
                    .tickPadding(5)
                    .scale(d3.scale.linear()
                        .domain([0, 120])
                        .range([-3 * Math.PI / 4, Math.PI / 2]));

                featureGaugeInstanceG2.append("g")
                    .attr("id", "eraGauge")
                    .attr("class", "featureGauge")
                    .call(featureGaugeInstance2);


                featureGaugeInstance2.value(0);

                d3.selectAll("#eraGauge text").on("click", function(d, i) {
                    d3.selectAll("#eraGauge text")
                        .attr("fill", "white");

                    d3.select(this)
                        .attr("fill", "red");

                    featureGaugeInstance2.value(d);
                    globalConfig.eraFeature = Object.keys(era_feature_mapping)[i] + "_processed";
                    loadNewDataset();
                });

                centerTx = centerTranslation();

                outermostArcG = g.append('g')
                    .attr('class', 'arc')
                    .attr('transform', centerTx);

                yearTicksG = g.append("g")
                    .attr('transform', centerTx);

                level1ArcsG = g.append('g')
                    .attr('class', 'arc')
                    .attr('transform', centerTx);

                level2ArcsG = g.append('g')
                    .attr('class', 'arc')
                    .attr('transform', centerTx);

                level3ArcsG = g.append('g')
                    .attr('class', 'arc')
                    .attr('transform', centerTx);

                outerTicksG = g.append('g')
                    .attr('class', 'label')
                    .attr('transform', centerTx);

                innerTicksG = g.append('g')
                    .attr('class', 'label')
                    .attr('transform', centerTx);

                innerArcCirclesG = g.append('g')
                    .attr('transform', centerTx);

                outerArcCirclesG = g.append('g')
                    .attr('transform', centerTx);

                infoCardG = g.append('g')
                    .attr("class", "infocard")

                profilePicDef = infoCardG.append('svg:defs');
                profilePicDef.append("svg:pattern")
                    .attr("id", "infocardImgContainer")
                    .attr("width", 120)
                    .attr("height", 120)
                    .attr("patternUnits", "userSpaceOnUse")
                    .append("svg:image")
                    .attr("id", "infocardImg")
                    .attr("width", 120)
                    .attr("height", 120)
                    .attr("x", 0)
                    .attr("y", 0);

                infoCardG.append("circle")
                    .attr("class", "infocard-container")
                    .attr('transform', centerTx)
                    .style("stroke-opacity", 0.6)
                    .style("stroke", "#aaa")

                infoCardG.append("circle")
                    .attr("class", "infocard-circle")
                    .attr("r", 60)
                    .attr("cy", 60)
                    .attr("cx", 60)
                    .attr("transform", "translate(" + (r - 60) + "," + (r - 220) + ")")
                    .style("fill", "white")
                    .style("stroke", "#aaa")
                    .style("stroke-width", "1px")
                    .style("stroke-opacity", 0.6)

                var table = infoCardG.append("foreignObject")
                    .attr("width", r - 200)
                    .attr("height", 200)
                    .attr("class", "tableForeignObject")
                    .append("xhtml:" + containerId.replace("#", "")) //append body to foreign object(this is missing in your code)

                table.append("table")
                    .attr("class", "infocard-table")
                    .style("color", config.svgTextColor)
                    .style("width", r - 200)
                    .style("height", 200)

                goatG = g.append('g')
                    .attr("class", "goatContainer")

                goatDefsG = goatG.append('svg:defs');

                featureBubbleRow1G = g.append("g").attr("class", "featureBubbleRow1");
                featureBubbleRow2G = g.append("g").attr("class", "featureBubbleRow2");

                goatQuestionG = g.append("g");

                Object.keys(driver_id_name_mapping).forEach(function(id) {
                    $('<li id="' + id + '" class="vocab-word" style="padding:2px;">' + driver_id_initials_mapping[id]+ " - " + driver_id_name_mapping[id] + '</li>').appendTo('.list');
                });
                $(".list").on('click', '.vocab-word', function() {
                    innerCircleOnClick({ driverId: this.id });
                });

                $('#searchDriver').hideseek();

                var goatQuestion = goatQuestionG.append("foreignObject")
                    .attr("width", r)
                    .attr("height", 200)
                    .attr("class", "questionForeignObject")
                    .attr("transform", "translate(" + (r) + "," + (r + 30) + ")")
                    // .style("border","1px solid red")
                    .append("xhtml:" + containerId.replace("#", "")) //append body to foreign object(this is missing in your code)

                goatQuestion.append("div")
                    .attr("class", "goatTextContainer")
                    .style("margin-left", r - 500 + "px")
                    .style("text-align", "right")
                    .html("<h1 style='font-size:42px'><br><b>G</b>reatest <b>O</b>f <br> <b>A</b>ll <b>T</b>ime</h1>")

                raceTicksG = g.append("g")
                    .attr('transform', centerTx);

            }

            function drawFeatureBubbles(row1Data, row2Data) {

                var featureBubbleRow1Circles = featureBubbleRow1G.selectAll('.feature-bubble-1')
                    .data(row1Data, function(d, i) {
                        return d.key + "-" + d.value + new Date()
                    });

                featureBubbleRow1Circles.exit()
                    // .transition()
                    // .attr("opacity", 0)
                    // .duration(config.transitionExitTime)
                    .remove();

                var featureBubbleRow1CirclesEnter = featureBubbleRow1Circles
                    .enter()
                    .append('g')
                    .attr("class", "feature-bubble-1")
                    .attr('transform', function(d, i) {
                        return 'translate(' + (1310 + i * 130) + ',120)';
                    })
                // .on("mouseover", featureBubbleRow1Mouseover)
                // .on("mouseout", featureBubbleRow1Mouseout);

                featureBubbleRow1CirclesEnter
                    .append('circle')
                    .attr("class", "feature-bubble-circle-1")
                    .attr("r", 45)
                    .attr("fill", null)
                    .attr("stroke", "white")

                featureBubbleRow1CirclesEnter.append("text")
                    .attr("class", "feature-bubble-label-1-1")
                    .style("font-size", "1.1em")
                    .style("font-family", "F1 Font")
                    .attr("dy", "-70px")
                    .attr("fill", "white")
                    .attr("text-anchor", "middle")
                    .text(function(d) {
                        return d.key
                    });

                featureBubbleRow1CirclesEnter.append("text")
                    .attr("class", "feature-bubble-text-1-2")
                    .style("font-size", "1.5em")
                    .style("font-family", "F1 Font")
                    .attr("dy", "9px")
                    .attr("fill", "white")
                    .attr("text-anchor", "middle")
                    .text(function(d) {
                        return d.value
                    });

                featureBubbleRow1CirclesEnter
                    .attr('transform', function(d, i) {
                        return 'translate(' + (1310 + i * 130) + ',120)';
                    });


                var featureBubbleRow2Circles = featureBubbleRow2G.selectAll('.feature-bubble-2')
                    .data(row2Data, function(d, i) {
                        return d.key + "-" + d.value + new Date()
                    });

                featureBubbleRow2Circles
                    .exit()
                    // .transition()
                    // .attr("opacity", 0)
                    // .duration(config.transitionExitTime)
                    .remove();

                var featureBubbleRow2CirclesEnter = featureBubbleRow2Circles
                    .enter()
                    .append('g')
                    .attr("class", "feature-bubble-2")
                    .attr('transform', function(d, i) {
                        return 'translate(' + (1310 + i * 130) + ',280)';
                    })

                featureBubbleRow2CirclesEnter
                    .append('circle')
                    .attr("class", "feature-bubble-circle-2")
                    .attr("r", 45)
                    .attr("fill", null)
                    .attr("stroke", "white");

                featureBubbleRow2CirclesEnter.append("text")
                    .attr("class", "feature-bubble-label-2-1")
                    .style("font-size", "1.1em")
                    .style("font-family", "F1 Font")
                    .attr("dy", "-70px")
                    .attr("fill", "white")
                    .attr("text-anchor", "middle")
                    .text(function(d) {
                        return d.key
                    });

                featureBubbleRow2CirclesEnter.append("text")
                    .attr("class", "feature-bubble-text-2-2")
                    .style("font-size", "1.5em")
                    .style("font-family", "F1 Font")
                    .attr("dy", "9px")
                    .attr("fill", "white")
                    .attr("text-anchor", "middle")
                    .text(function(d) {
                        return d.value
                    });

                featureBubbleRow2CirclesEnter
                    .attr('transform', function(d, i) {
                        return 'translate(' + (1310 + i * 130) + ',280)';
                    })

                featureBubbleRow1CirclesEnter.select(".feature-bubble-text-1-1").text(function(d) {
                    return d.value
                });
                featureBubbleRow1CirclesEnter.select(".feature-bubble-text-1-2").text(function(d) {
                    return d.value
                });
                featureBubbleRow2CirclesEnter.select(".feature-bubble-text-2-1").text(function(d) {
                    return d.value
                });
                featureBubbleRow2CirclesEnter.select(".feature-bubble-text-2-2").text(function(d) {
                    return d.value
                });

            }

            function renderCircuitData(year) {

                raceTicksG.html("");

                raceTicksG
                .append("circle")
                .attr("r",250)
                .attr("fill", config.svgBackgroundColor);

                var raceTicks = raceTicksG.selectAll('.races')
                    .data(masterCircuitData[year], function(d) {
                        return d.circuit
                    });

                var raceTicksEnter = raceTicks.enter()
                    .append('g')
                    .attr("transform", function(d,i){
                        return "translate(0," + (21 - masterCircuitData[year].length)*21/2 + ") rotate(90)"   
                    });

                raceTicksEnter
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", -15)
                    .attr("width", 21)
                    .attr("height", 210)
                    .attr("class", "races")
                    .attr("stroke-width", "1px")
                    .attr("stroke", "white")
                    .attr("stroke-opacity", 0.3)
                    .attr("fill", config.svgBackgroundColor)
                    .attr("transform", function(d, i) {
                        return "translate(" + (-220 + i * 21) + "," + (-95) + ")"
                    });

                raceTicksEnter
                    .append("text")
                    .attr("fill", "white")
                    .attr("transform", function(d, i) {
                        return "translate(" + (-205 + i * 21) + ",95) rotate(-90)"
                    })
                    .style("font-size", "0.9em")
                    .style("font-family", "F1 Font")
                    .attr("text-anchor", "start")
                    .text(function(d) {
                        return d.race.split(" ")[0] + " GP";
                    });

                raceTicksEnter
                    .append("text")
                    .attr("fill", "white")
                    .attr("transform", function(d,i){
                        return "translate(" + (-(21 - masterCircuitData[year].length)*21/2) + "," + 200 + ") rotate(-90)";
                    })
                    .style("font-size", "2em")
                    .style("font-family", "F1 Font")
                    .attr("text-anchor", "start")
                    .text(function (d) {
                        return d.year;
                    });

                raceTicksEnter
                    .append("circle")
                    .attr("cx", 0)
                    .attr("cx", 0)
                    .attr("r", 8)
                    .attr("fill", "#C98910")
                    .attr("transform", function(d, i) {
                        return "translate(" + (-210 + i * 21) + ",-95) rotate(-90)"
                    });

                raceTicksEnter
                    .append("circle")
                    .attr("cx", 0)
                    .attr("cx", 0)
                    .attr("r", 8)
                    .attr("fill", "#A8A8A8")
                    .attr("transform", function(d, i) {
                        return "translate(" + (-210 + i * 21) + ",-77) rotate(-90)"
                    });

                raceTicksEnter
                    .append("circle")
                    .attr("cx", 0)
                    .attr("cx", 0)
                    .attr("r", 8)
                    .attr("fill", "#965A38")
                    .attr("transform", function(d, i) {
                        return "translate(" + (-210 + i * 21) + ",-59) rotate(-90)"
                    });

                raceTicksEnter
                    .append("text")
                    .attr("fill", "white")
                    .style("font-family", "F1 Font")
                    .style("font-size", "0.5em")
                    .attr("dx", "0.3em")
                    .attr("dy", "0.3em")
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d, i) {
                        return "translate(" + (-210 + i * 21) + ",-93) rotate(-90)"
                    })
                    .text(function(d) {
                        return driver_id_initials_mapping[d["1stPlace"]]
                    });

                raceTicksEnter
                    .append("text")
                    .attr("fill", "black")
                    .style("font-family", "F1 Font")
                    .style("font-size", "0.5em")
                    .attr("dx", "0.3em")
                    .attr("dy", "0.3em")
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d, i) {
                        return "translate(" + (-210 + i * 21) + ",-75) rotate(-90)"
                    })
                    .text(function(d) {
                        return driver_id_initials_mapping[d["2ndPlace"]]
                    });

                raceTicksEnter
                    .append("text")
                    .attr("fill", "white")
                    .style("font-family", "F1 Font")
                    .style("font-size", "0.5em")
                    .attr("dx", "0.3em")
                    .attr("dy", "0.3em")
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d, i) {
                        return "translate(" + (-210 + i * 21) + ",-57) rotate(-90)"
                    })
                    .text(function(d) {
                        return driver_id_initials_mapping[d["3rdPlace"]]
                    })
            }

            function update(newConfiguration, data) {

                if (newConfiguration !== undefined) {
                    configure(newConfiguration);
                }

                var yearTicks = yearTicksG.selectAll('.yearTicks')
                    .data(ticks, function(d) {
                        return d
                    });

                yearTicks.enter()
                    .append('line')
                    .attr("class", "yearTicks")
                    .attr('x1', 0)
                    .attr('y1', -config.labelInset)
                    .attr('x2', 0)
                    .attr('y2', r - config.labelInset - config.ringWidth)
                    .attr("stroke-opacity", function(d) {
                        return config.erasList.indexOf(d) === -1 ? config.minorYearTickOpacity : config.majorYearTickOpacity
                    })
                    .attr("stroke-width", "1px")
                    .attr("stroke", "#aaaaaa")
                    .attr('transform', function(d) {
                        var ratio = scale(d),
                            newAngle = config.minAngle + (ratio * range);
                        return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset + config.ringWidth - r) + ')';
                    });

                yearTicks
                    .transition().duration(config.transitionTime)
                    .attr('x1', 0)
                    .attr('y1', -config.labelInset)
                    .attr('x2', 0)
                    .attr('y2', r - config.labelInset - config.ringWidth)
                    .attr("stroke-opacity", function(d) {
                        return config.erasList.indexOf(d) === -1 ? config.minorYearTickOpacity : config.majorYearTickOpacity
                    })
                    .attr("stroke-width", function(d) {
                        return config.erasList.indexOf(d) === -1 ? "1px" : "1px"
                    })
                    .attr("stroke", "#aaaaaa")
                    .attr('transform', function(d) {
                        var ratio = scale(d),
                            newAngle = config.minAngle + (ratio * range);
                        return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset + config.ringWidth - r) + ')';
                    });

                yearTicks.exit()
                    .transition()
                    .duration(config.transitionExitTime)
                    .attr("opacity", 0)
                    .remove();

                var outermostArcs = outermostArcG.selectAll('path')
                    .data(tickData, function(d) {
                        return d
                    });

                outermostArcs.enter()
                    .append('path')
                    .attr("class", "infocard-container-outer")
                    .attr("stroke", "#aaa")
                    .attr("fill-opacity", 0)
                    .attr('d', outermostArc)
                    .on("mouseover", outermostArcsMouseover)
                    .on("mouseout", outermostArcsMouseout)

                outermostArcs
                    .transition().duration(config.transitionTime)
                    .attr("stroke", "#aaa")
                    .attr("fill-opacity", 0)
                    .attr('d', outermostArc);

                outermostArcs.exit()
                    // .transition()
                    // .attr("opacity", 0)
                    // .duration(config.transitionExitTime)
                    .remove();

                var level1Arcs = level1ArcsG.selectAll('path')
                    .data(tickYearData, function(d) {
                        return d
                    });

                level1Arcs.enter()
                    .append('path')
                    .attr("class", "levelArcs level1Arc")
                    .attr('fill', function(d, i) {
                        return eraDifficultyScale(f1YearsInformation[Math.round(scale.invert(d))][config.eraFeature]);
                        // return arcColorFn(d - 0.001);
                    })
                    .attr('d', level1Arc)
                    .on("mouseover", level1ArcMouseover)
                    .on("mouseout", level1ArcMouseout)

                level1Arcs
                    .attr("fill", config.svgBackgroundColor)
                    .transition()
                    .delay(function(d, i) {
                        return i * 10;
                    })
                    .duration(config.transitionTime)
                    .attr('fill', function(d, i) {
                        return eraDifficultyScale(f1YearsInformation[Math.round(scale.invert(d))][config.eraFeature]);
                        // return arcColorFn(d - 0.001);
                    })
                    .attr('d', level1Arc);

                level1Arcs.exit()
                    // .transition()
                    // .attr("opacity", 0)
                    // .duration(config.transitionExitTime)
                    .remove();

                var level2Arcs = level2ArcsG.selectAll('path')
                    .data(tickYearData, function(d) {
                        return d
                    });

                level2Arcs.enter()
                    .append('path')
                    .attr("class", "levelArcs level2Arc")
                    .attr('fill', function(d, i) {
                        return eraDifficultyScale(f1YearsInformation[Math.round(scale.invert(d))][config.eraFeature]);
                        // return arcColorFn(d - 0.001);
                    })
                    .attr('d', level2Arc)
                    .on("mouseover", level2ArcMouseover)
                    .on("mouseout", level2ArcMouseout)

                level2Arcs
                    .attr("fill", config.svgBackgroundColor)
                    .transition()
                    .delay(function(d, i) {
                        return i * 10;
                    })
                    .duration(config.transitionTime)
                    .attr('fill', function(d, i) {
                        return eraDifficultyScale(f1YearsInformation[Math.round(scale.invert(d))][config.eraFeature]);
                        // return arcColorFn(d - 0.001);
                    })
                    .attr('d', level2Arc);

                level2Arcs.exit()
                    // .transition()
                    // .attr("opacity", 0)
                    // .duration(config.transitionExitTime)
                    .remove();

                var level3Arcs = level3ArcsG.selectAll('path')
                    .data(tickYearData, function(d) {
                        return d
                    });

                level3Arcs.enter()
                    .append('path')
                    .attr("class", "levelArcs level3Arc")
                    .attr('fill', function(d, i) {
                        return eraDifficultyScale(f1YearsInformation[Math.round(scale.invert(d))][config.eraFeature]);
                        // return arcColorFn(d - 0.001);
                    })
                    .attr('d', level3Arc)
                    .on("mouseover", level3ArcMouseover)
                    .on("mouseout", level3ArcMouseout)

                level3Arcs
                    .attr("fill", config.svgBackgroundColor)
                    .transition()
                    .delay(function(d, i) {
                        return i * 10;
                    })
                    .duration(config.transitionTime)
                    .attr('fill', function(d, i) {
                        return eraDifficultyScale(f1YearsInformation[Math.round(scale.invert(d))][config.eraFeature]);
                        // return arcColorFn(d - 0.001);
                    })
                    .attr('d', level3Arc);

                level3Arcs.exit()
                    // .transition()
                    // .attr("opacity", 0)
                    // .duration(config.transitionExitTime)
                    .remove();

                var outerTicks = outerTicksG.selectAll('.outer-ticks')
                    .data(ticks, function(d) {
                        return d
                    })

                outerTicks.enter()
                    .append('text')
                    .attr("class", "outer-ticks")
                    .attr('transform', function(d) {
                        var ratio = scale(d);
                        if (config.rotateLabels) {
                            var newAngle = config.minAngle + (ratio * range);

                            return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
                        } else {
                            var newAngle = deg2rad(config.minAngle + (ratio * range)),
                                y = (config.labelInset - r) * Math.cos(newAngle),
                                x = -1 * (config.labelInset - r) * Math.sin(newAngle);

                            return 'translate(' + x + ',' + y + ')';
                        }
                    })
                    // .attr("text-anchor", "middle")
                    .style("font-size", "1.6em")
                    .attr("fill", config.svgTextColor)
                    .attr("opacity", function(d) {
                        return config.erasList.indexOf(d) === -1 ? config.minorTickLabelsOpacity : config.majorTickLabelsOpacity
                    })
                    .text(config.labelFormat);

                outerTicks
                    // .transition().duration(config.transitionTime)
                    .attr('transform', function(d) {
                        var ratio = scale(d);
                        if (config.rotateLabels) {
                            var newAngle = config.minAngle + (ratio * range);

                            return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
                        } else {
                            var newAngle = deg2rad(config.minAngle + (ratio * range)),
                                y = (config.labelInset - r) * Math.cos(newAngle),
                                x = -1 * (config.labelInset - r) * Math.sin(newAngle);

                            return 'translate(' + x + ',' + y + ')';
                        }
                    })
                    // .attr("text-anchor", "middle")
                    .style("font-size", "1.6em")
                    .attr("fill", config.svgTextColor)
                    .attr("opacity", function(d) {
                        return config.erasList.indexOf(d) === -1 ? config.minorTickLabelsOpacity : config.majorTickLabelsOpacity
                    })
                    .text(config.labelFormat)
                    .on("mouseover", yearTickLabelMouseover)
                    .on("mouseout", yearTickLabelMouseout)

                outerTicks.exit()
                    .transition()
                    .attr("opacity", 0)
                    .duration(config.transitionExitTime).remove();

                var innerTicks = innerTicksG.selectAll('.inner-ticks')
                    .data(ticks, function(d) {
                        return d;
                    })

                innerTicks.enter()
                    .append('text')
                    .attr("class", "inner-ticks")
                    .attr('transform', function(d) {
                        var ratio = scale(d);
                        if (config.rotateLabels) {
                            var newAngle = config.minAngle + (ratio * range);
                            return 'rotate(' + newAngle + ') translate(0,' + (-r + config.level2Gap + config.labelInset + config.ringInset) + ')';
                        } else {
                            var newAngle = deg2rad(config.minAngle + (ratio * range)),
                                y = (-r + config.level2Gap + config.labelInset + config.ringInset) * Math.cos(newAngle),
                                x = -1 * (-r + config.level2Gap + config.labelInset + config.ringInset) * Math.sin(newAngle);

                            return 'translate(' + x + ',' + y + ')';
                        }
                    })
                    // .attr("text-anchor", "middle")
                    .style("font-size", "1.2em")
                    .attr("fill", config.svgTextColor)
                    .attr("opacity", function(d) {
                        return config.erasList.indexOf(d) === -1 ? config.minorTickLabelsOpacity : config.majorTickLabelsOpacity
                    })
                    .text(function(d) {
                        return "'" + config.labelFormat(d).slice(-2);
                    });

                innerTicks
                    // .transition().duration(config.transitionTime)
                    .attr('transform', function(d) {
                        var ratio = scale(d);
                        if (config.rotateLabels) {
                            var newAngle = config.minAngle + (ratio * range);
                            return 'rotate(' + newAngle + ') translate(0,' + (-r + config.level2Gap + config.labelInset + config.ringInset) + ')';
                        } else {
                            var newAngle = deg2rad(config.minAngle + (ratio * range)),
                                y = (-r + config.level2Gap + config.labelInset + config.ringInset) * Math.cos(newAngle),
                                x = -1 * (-r + config.level2Gap + config.labelInset + config.ringInset) * Math.sin(newAngle);

                            return 'translate(' + x + ',' + y + ')';
                        }
                    })
                    // .attr("text-anchor", "middle")
                    .style("font-size", "1.2em")
                    .attr("fill", config.svgTextColor)
                    .attr("opacity", function(d) {
                        return config.erasList.indexOf(d) === -1 ? config.minorTickLabelsOpacity : config.majorTickLabelsOpacity
                    })
                    .text(function(d) {
                        return "'" + config.labelFormat(d).slice(-2);
                    })
                    .on("mouseover", yearTickLabelMouseover)
                    .on("mouseout", yearTickLabelMouseout)

                innerTicks.exit()
                    .transition()
                    .attr("opacity", 0)
                    .duration(config.transitionExitTime).remove();

                var getPositionOuterArcCircle = function(j) {
                    return config.ringWidth + config.ringInset + config.dataRadius + config.dataRadius * 2 * j;

                }

                var getPositionInnerArcCircle = function(j) {
                    return config.ringWidth + config.ringInset + config.dataRadius + config.dataRadius * 2 * j;
                }

                for (var j = 0; j < data.length; j++) {
                    year = Math.round(data[j]["key"]);
                    if (Math.round(year) < 1977) {
                        continue;
                    }

                    //                     var innerArcCirclesDefs = innerArcCirclesDefsSvg.selectAll('.inner-circle-def-' + j)
                    //                         .data(data[j]["values"].slice(0, config.noOfDataPoints), function(d, i) { return "inner-" + year + "-" + d.driverId + "-" + j })
                    // 
                    //                     innerArcCirclesDefs.enter()
                    //                         .append("svg:pattern")
                    //                         // .attr("class","inner-circle circle" + j)
                    //                         .attr("id", function(d) { return "inner-circle-def-" + d.driverId })
                    //                         .attr("width", config.dataRadius * 3)
                    //                         .attr("height", config.dataRadius * 3)
                    //                         .attr("patternUnits", "objectBoundingBox")
                    //                         .append("svg:image")
                    //                         .attr("xlink:href", function(d) { return "data/images/profile_pic/" + d.driverId + ".png" })
                    //                         .attr("width", config.dataRadius * 2)
                    //                         .attr("height", config.dataRadius * 2)
                    //                         .attr("x", 0)
                    //                         .attr("y", 0);
                    // 
                    //                     innerArcCirclesDefs.exit().remove();

                    if (config.feature == "greatest_of_all_time") {
                        // filtered_ranked_data = data[j]["values"].filter(function(d){return !isNaN(d.year_rank) });
                        sorted_rank_data = _.orderBy(data[j]["values"], ["year_rank"], ['asc']);
                        filtered_ranked_data = sorted_rank_data.slice(0, config.noOfDataPoints);
                    } else {
                        sorted_rank_data = _.orderBy(data[j]["values"], [config.feature], ['desc']);
                        filtered_ranked_data = sorted_rank_data.slice(0, config.noOfDataPoints);
                    }

                    var innerArcCircles = innerArcCirclesG.selectAll('.inner-circle-' + year)
                        .data(filtered_ranked_data, function(d, i) {
                            return "inner-" + year + "-" + d.driverId
                        })

                    innerArcCircles.exit()
                        .attr("opacity", 1)
                        .transition()
                        .duration(config.transitionExitTime)
                        .ease(config.easingFunction)
                        .attr("opacity", 0)
                        .remove();

                    innerArcCircles.select(".driver-bubble")
                        .transition()
                        .delay(config.transitionExitTime)
                        .duration(config.transitionTime)
                        .ease(config.easingFunction)
                        .attr('transform', function(d, i) {
                            var ratio = scale(year);
                            var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                            return 'rotate(' + newAngle + ') translate(0,' + (getPositionInnerArcCircle(i) - r + config.level1Gap) + ')';
                        })
                        .attr("opacity", config.circleFillOpacity)
                        .attr("stroke", config.circleStrokeColor)
                        .attr("stroke-opacity", config.circleStrokeOpacity)
                        .attr("r", config.dataRadius)
                        .attr("fill", config.circleFillColor)

                    innerArcCircles.select(".driver-text")
                        .transition()
                        .delay(config.transitionExitTime)
                        .duration(config.transitionTime)
                        .ease(config.easingFunction)
                        .attr('transform', function(d, i) {
                            var ratio = scale(year);
                            var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                            return 'rotate(' + newAngle + ') translate(0,' + (getPositionInnerArcCircle(i) - r + config.level1Gap) + ')';
                        })
                        .attr("opacity", config.circleFillOpacity)
                        .attr("fill", config.circleTextColor)
                        .text(function(d) {
                            return d.initials
                        })

                    var elementEnter = innerArcCircles
                        .enter()
                        .append('g')
                        .attr("class", "inner-circle inner-circle-" + year)
                        // .attr('transform', function(d, i) {
                        //     var ratio = scale(year);
                        //     var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                        //     return 'rotate(' + newAngle + ') translate(0,' + (getPositionInnerArcCircle(i) - r + config.level1Gap) + ')';
                        // })
                        .on("mouseover", innerArcCircleMouseover)
                        .on("mouseout", innerArcCircleMouseout)
                        .on("click", innerCircleOnClick);

                    elementEnter.append("circle")
                        .attr("class", "driver-bubble")
                        // .attr("fill", function(d){return "url(#inner-circle-def-" + d.driverId + ")"})
                        .attr("opacity", 0)
                        .attr("stroke-opacity", 0)
                        .transition()
                        .delay(function(d, i) {
                            return i * 250 + config.transitionExitTime + config.transitionTime;
                        })
                        .duration(config.transitionTime / 2)
                        .ease(config.easingFunction)
                        .attr('transform', function(d, i) {
                            var ratio = scale(year);
                            var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                            return 'rotate(' + newAngle + ') translate(0,' + (getPositionInnerArcCircle(i) - r + config.level1Gap) + ')';
                        })
                        .attr("opacity", config.circleFillOpacity)
                        .attr("stroke", config.circleStrokeColor)
                        .attr("stroke-opacity", config.circleStrokeOpacity)
                        .attr("r", config.dataRadius)
                        .attr("fill", config.circleFillColor)

                    elementEnter.append("text")
                        .attr("class", "driver-text")
                        .style("font-size", "0.65em")
                        .attr("dx", function(d) {
                            return -8
                        })
                        .attr("dy", function(d) {
                            return 4
                        })
                        .attr("opacity", 0)
                        .transition()
                        .delay(function(d, i) {
                            return i * 250 + config.transitionExitTime + config.transitionTime;
                        })
                        .duration(config.transitionTime / 2)
                        .ease(config.easingFunction)
                        .attr('transform', function(d, i) {
                            var ratio = scale(year);
                            var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                            return 'rotate(' + newAngle + ') translate(0,' + (getPositionInnerArcCircle(i) - r + config.level1Gap) + ')';
                        })
                        .attr("opacity", config.circleFillOpacity)
                        .attr("fill", config.circleTextColor)
                        .text(function(d) {
                            return d.initials
                        })


                }

                if (config.feature == "greatest_of_all_time") {

                    all_years_data = [];
                    master_data = [];
                    for (var j = 0; j < data.length; j++) {
                        year = Math.round(data[j]["key"]);
                        if (Math.round(year) < 1977) {
                            continue;
                        }

                        sorted_rank_data = _.orderBy(data[j]["values"], ["era_rank"], ['asc']);
                        for (var i = 0; i < sorted_rank_data.length; i++) {
                            master_data.push(sorted_rank_data[i]);
                        }

                        filtered_ranked_data = sorted_rank_data.slice(0, config.noOfDataPoints);
                        for (var i = 0; i < filtered_ranked_data.length; i++) {
                            all_years_data.push(filtered_ranked_data[i]);
                        }
                    }

                    final_master_array = [];
                    _.chain(JSON.parse(JSON.stringify(all_years_data)))
                        .groupBy('era')
                        .map(function(value, key) {
                            sorted_rank_data = _.orderBy(value, ["era_rank"], ['asc']);
                            duplicate_removed_data = _.uniqBy(sorted_rank_data, 'driverId');
                            filtered_ranked_data = duplicate_removed_data.slice(0, config.noOfDataPoints);
                            for (var k = 0; k < filtered_ranked_data.length; k++) {
                                filtered_ranked_data[k]["era_rank"] = k;
                                final_master_array.push(JSON.parse(JSON.stringify(filtered_ranked_data[k])));
                            }
                            return {
                                type: key
                            }
                        })
                        .value();

                    // console.log(final_master_array);
                    final_master_array.forEach(function(row){
                        row.year = parseInt(row.year);
                        row.year = mainDict[parseInt(row.driverId)][parseInt(row.era)];
                    })

                    final_final_master_object = {};
                    _.chain(final_master_array)
                        .groupBy('year')
                        .map(function(value, key) {
                            sorted_rank_data = _.orderBy(value, [config.feature], ['desc']);
                            final_final_master_object[key] = JSON.parse(JSON.stringify(sorted_rank_data));
                            return {
                                type: key
                            }
                        })
                        .value();

                } else {

                    all_years_data = [];
                    master_data = [];
                    for (var j = 0; j < data.length; j++) {
                        year = Math.round(data[j]["key"]);
                        if (Math.round(year) < 1977) {
                            continue;
                        }

                        sorted_rank_data = _.orderBy(data[j]["values"], [config.feature], ['desc']);
                        for (var i = 0; i < sorted_rank_data.length; i++) {
                            master_data.push(sorted_rank_data[i]);
                        }

                        filtered_ranked_data = sorted_rank_data.slice(0, config.noOfDataPoints);
                        for (var i = 0; i < filtered_ranked_data.length; i++) {
                            all_years_data.push(filtered_ranked_data[i]);
                        }
                    }

                    final_master_array = [];
                    _.chain(JSON.parse(JSON.stringify(all_years_data)))
                        .groupBy('era')
                        .map(function(value, key) {
                            sorted_rank_data = _.orderBy(value, [config.feature], ['desc']);
                            duplicate_removed_data = _.uniqBy(sorted_rank_data, 'driverId');
                            filtered_ranked_data = duplicate_removed_data.slice(0, config.noOfDataPoints);
                            for (var k = 0; k < filtered_ranked_data.length; k++) {
                                filtered_ranked_data[k]["era_rank"] = k;
                                final_master_array.push(JSON.parse(JSON.stringify(filtered_ranked_data[k])));
                            }
                            return {
                                type: key
                            }
                        })
                        .value();

                    final_final_master_object = {};
                    _.chain(final_master_array)
                        .groupBy('year')
                        .map(function(value, key) {
                            sorted_rank_data = _.orderBy(value, [config.feature], ['desc']);
                            final_final_master_object[key] = JSON.parse(JSON.stringify(sorted_rank_data));
                            return {
                                type: key
                            }
                        })
                        .value();

                    final_overall_master_array = _.chain(JSON.parse(JSON.stringify(master_data)))
                        .groupBy('driverId')
                        .map(function(value, key) {
                            return {
                                feature_agg: _.sumBy(value, config.feature),
                                key: key
                            }
                        })
                        .value();

                    final_overall_master_array = _.orderBy(final_overall_master_array, ["feature_agg"], ['desc']);
                    final_overall_master_array = _.uniqBy(final_overall_master_array, 'key');
                }

                for (var j = 0; j < data.length; j++) {
                    year = Math.round(data[j]["key"]);
                    if (Math.round(year) < 1977) {
                        continue;
                    }

                    if (!(year in final_final_master_object)) {
                        final_final_master_object[year] = [];
                    }

                    //                     var outerArcCirclesDefs = outerArcCirclesDefsSvg.selectAll('.outer-circle.circle' + j)
                    //                         .data(data[j]["values"].slice(0, config.noOfDataPoints), function(d, i) { return "outer-" + year + "-" + d.driverId + "-" + j })
                    // 
                    //                     outerArcCirclesDefs.enter()
                    //                         .append("svg:pattern")
                    //                         // .attr("class","outer-circle circle" + j)
                    //                         .attr("id", function(d) { return "outer-circle-def-" + d.driverId })
                    //                         .attr("width", config.dataRadius * 3)
                    //                         .attr("height", config.dataRadius * 3)
                    //                         .attr("patternUnits", "objectBoundingBox")
                    //                         .append("svg:image")
                    //                         .attr("xlink:href", function(d) { return "data/images/profile_pic/" + d.driverId + ".png" })
                    //                         .attr("width", config.dataRadius * 2)
                    //                         .attr("height", config.dataRadius * 2)
                    //                         .attr("x", 0)
                    //                         .attr("y", 0);
                    // 
                    //                     outerArcCirclesDefs.exit().remove();

                    var outerArcCircles = outerArcCirclesG.selectAll('.outer-circle-' + year)
                        .data(final_final_master_object[year], function(d, i) {
                            return "outer-" + year + "-" + d.driverId
                        })

                    outerArcCircles.exit()
                        .attr("opacity", 1)
                        .transition()
                        .duration(config.transitionExitTime)
                        .ease(config.easingFunction)
                        // .attr('transform', function(d, i) {
                        //     var ratio = scale(year);
                        //     var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                        //     return 'rotate(' + newAngle + ') translate(0,' + ((config.level2Gap + config.ringInset + config.labelInset) - r) + ')';
                        // })
                        .attr("opacity", 0)
                        .remove();

                    outerArcCircles.select(".driver-bubble")
                        .transition()
                        .delay(config.transitionExitTime)
                        .duration(config.transitionTime)
                        .ease(config.easingFunction)
                        .attr('transform', function(d, i) {
                            var ratio = scale(year);
                            var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                            return 'rotate(' + newAngle + ') translate(0,' + (getPositionOuterArcCircle(d.era_rank) - r) + ')';
                        })
                        .attr("opacity", config.circleFillOpacity)
                        .attr("stroke", config.circleStrokeColor)
                        .attr("stroke-opacity", config.circleStrokeOpacity)
                        .attr("r", config.dataRadius)
                        // .attr("fill", function(d){return "url(#outer-circle-def-" + d.driverId + ")"})
                        .attr("fill", config.circleFillColor)

                    outerArcCircles.select(".driver-text")
                        .transition()
                        .delay(config.transitionExitTime)
                        .duration(config.transitionTime)
                        .ease(config.easingFunction)
                        .attr('transform', function(d, i) {
                            var ratio = scale(year);
                            var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                            return 'rotate(' + newAngle + ') translate(0,' + (getPositionOuterArcCircle(d.era_rank) - r) + ')';
                        })
                        .attr("opacity", config.circleFillOpacity)
                        .attr("fill", config.circleTextColor)
                        .text(function(d) {
                            return d.initials
                        })

                    var elementEnter = outerArcCircles
                        .enter()
                        .append('g')
                        .attr("class", "outer-circle outer-circle-" + year)
                        .on("mouseover", outerArcCircleMouseover)
                        .on("mouseout", outerArcCircleMouseout)
                        .on("click", outerArcCircleClick);

                    elementEnter
                        .append('circle')
                        .attr("class", "driver-bubble")
                        .attr("opacity", 0)
                        .attr("stroke-opacity", 0)
                        .transition()
                        .delay(function(d, i) {
                            return (d.era_rank + 1) * 250 + 1300 + config.transitionExitTime + config.transitionTime;
                        })
                        .duration(config.transitionTime / 2)
                        .ease(config.easingFunction)
                        .attr('transform', function(d, i) {
                            var ratio = scale(year);
                            var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                            return 'rotate(' + newAngle + ') translate(0,' + (getPositionOuterArcCircle(d.era_rank) - r) + ')';
                        })
                        .attr("opacity", config.circleFillOpacity)
                        .attr("stroke", config.circleStrokeColor)
                        .attr("stroke-opacity", config.circleStrokeOpacity)
                        .attr("r", config.dataRadius)
                        // .attr("fill", function(d){return "url(#outer-circle-def-" + d.driverId + ")"})
                        .attr("fill", config.circleFillColor)

                    elementEnter.append("text")
                        .attr("class", "driver-text")
                        .style("font-size", "0.65em")
                        .attr("dx", function(d) {
                            return -8
                        })
                        .attr("dy", function(d) {
                            return 4
                        })
                        .attr("opacity", 0)
                        .transition()
                        .delay(function(d, i) {
                            return (d.era_rank + 1) * 250 + 1300 + config.transitionExitTime + config.transitionTime;
                        })
                        .duration(config.transitionTime / 2)
                        .ease(config.easingFunction)
                        .attr('transform', function(d, i) {
                            var ratio = scale(year);
                            var newAngle = config.minAngle + (ratio * range) + range / config.majorTicks / 2;
                            return 'rotate(' + newAngle + ') translate(0,' + (getPositionOuterArcCircle(d.era_rank) - r) + ')';
                        })
                        .attr("opacity", config.circleFillOpacity)
                        .attr("fill", config.circleTextColor)
                        .text(function(d) {
                            return d.initials
                        })

                }


                if (config.feature == "greatest_of_all_time") {
                    goatDefs = goatDefsG.selectAll(".goat-defs")
                        .data(goatOverallDataList.slice(0, config.noOfDataPoints), function(d, i) {
                            return d.key
                        })

                } else {
                    goatDefs = goatDefsG.selectAll(".goat-defs")
                        .data(final_overall_master_array.slice(0, config.noOfDataPoints), function(d, i) {
                            return d.key
                        })
                }

                var elementEnter = goatDefs
                    .enter()
                    .append('g')
                    .attr('class', "goat-defs")

                elementEnter.append("svg:pattern")
                    .attr("id", function(d, i) {
                        return "goat_avatar" + d.key
                    })
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("patternUnits", "objectBoundingBox")
                    .append("svg:image")
                    .attr("xlink:href", function(d, i) {
                        return "data/images/profile_pic/" + (d.key) + ".png"
                    })
                    .attr("width", 240)
                    .attr("height", 180)
                    .attr("x", -60)
                    .attr("y", -20);

                goatDefs
                    .exit()
                    .remove();


                if (config.feature == "greatest_of_all_time") {
                    goatCircles = goatG.selectAll('.goat-circle')
                        .data(goatOverallDataList.slice(0, config.noOfDataPoints), function(d, i) {
                            return d.key.toString()
                        })

                } else {
                    goatCircles = goatG.selectAll('.goat-circle')
                        .data(final_overall_master_array.slice(0, config.noOfDataPoints), function(d, i) {
                            return d.key.toString()
                        });
                }

                goatCircles
                    .exit()
                    .transition()
                    // .delay(2*config.transitionExitTime + 2*config.transitionTime)
                    .duration(config.transitionExitTime)
                    .ease(config.easingFunction)
                    // .attr("transform", function(d, i) { return "translate(" + (15 * (i + 1)) + "," + (200) + ")" })
                    .attr("opacity", 0)
                    .remove();

                goatCircles
                    .select("circle")
                    .attr("r", 60)
                    .style("fill", "#FFF")
                    .style("fill", function(d, i) {
                        return "url(#goat_avatar" + d.key + ")"
                    })
                    .style("stroke-width", "1px")
                    .style("stroke", "#aaa")
                    .style("stroke-opacity", "0.6")
                    .transition()
                    // .delay(3*config.transitionExitTime + 2*config.transitionTime)
                    .duration(config.transitionTime)
                    .ease(config.easingFunction)
                    .attr("cy", 60)
                    .attr("cx", function(d, i) {
                        return 120 + 160 * (i)
                    })
                    .attr("transform", function(d, i) {
                        return "translate(" + (15 * (i + 1)) + "," + (0) + ")"
                    })
                    .attr("transform", function(d, i) {
                        return "translate(" + (15 * (i + 1)) + "," + (0) + ")"
                    });

                goatCircles
                    .select(".goat-text")
                    .style("font-size", "2em")
                    .attr("text-anchor", "middle")
                    .style("fill", config.svgTextColor)
                    .attr("transform", function(d, i) {
                        return "translate(" + (140 + 175 * i) + ",-15)"
                    })
                    .transition()
                    // .delay(3*config.transitionExitTime + 2*config.transitionTime)
                    .duration(config.transitionTime)
                    .ease(config.easingFunction)
                    .text(function(d, i) {
                        return "# " + (i + 1)
                    });

                goatCircles
                    .select(".goat-text-2")
                    .style("font-size", "1.2em")
                    .attr("text-anchor", "middle")
                    .style("fill", config.svgTextColor)
                    .attr("transform", function(d, i) {
                        return "translate(" + (130 + 180 * i) + ",150)"
                    })
                    // .attr("opacity", 0)
                    .transition()
                    // .delay(3*config.transitionExitTime + 2*config.transitionTime)
                    .duration(config.transitionTime)
                    .ease(config.easingFunction)
                    // .attr("opacity", 1)
                    .text(function(d) {
                        return driver_id_name_mapping[d.key]
                    });

                var elementEnter = goatCircles
                    .enter()
                    .append('g')
                    .attr('class', "goat-circle")
                    .style("cursor", "pointer")
                    .on("mouseover", function(d) {
                        return innerArcCircleMouseover({ driverId: d.key })
                    })
                    .on("mouseout", function(d) {
                        return innerArcCircleMouseout({ driverId: d.key })
                    })
                    .on("click", function(d) {
                        return innerCircleOnClick({ driverId: d.key })
                    })

                elementEnter.append("circle")
                    .attr("class", "goat")
                    .attr("r", 60)
                    .style("fill", function(d, i) {
                        return "url(#goat_avatar" + d.key + ")"
                    })
                    .attr("cy", 60)
                    .attr("cx", function(d, i) {
                        return 120 + 160 * (i)
                    })
                    .attr("transform", function(d, i) {
                        return "translate(" + (15 * (i + 1)) + "," + (0) + ")"
                    })
                    .style("stroke-width", "1px")
                    .attr("opacity", 0)
                    .style("stroke", "#aaa")
                    .style("stroke-opacity", "0.6")
                    .transition()
                    // .delay(3*config.transitionExitTime + 3*config.transitionTime)
                    .duration(config.transitionTime)
                    .ease(config.easingFunction)
                    .attr("opacity", 1);

                elementEnter.append("text")
                    .attr("class", "goat-text")
                    .style("font-size", "2em")
                    .attr("text-anchor", "middle")
                    .style("fill", config.svgTextColor)
                    .attr("transform", function(d, i) {
                        return "translate(" + (140 + 175 * i) + ",-15)"
                    })
                    .transition()
                    // .delay(3*config.transitionExitTime + 3*config.transitionTime)
                    .duration(config.transitionTime)
                    .ease(config.easingFunction)
                    .text(function(d, i) {
                        return "# " + (i + 1)
                    });

                elementEnter.append("text")
                    .attr("class", "goat-text-2")
                    .style("font-size", "1.2em")
                    .attr("text-anchor", "middle")
                    .style("fill", config.svgTextColor)
                    .attr("transform", function(d, i) {
                        return "translate(" + (130 + 180 * i) + ",150)"
                    })
                    .attr("opacity", 0)
                    .transition()
                    // .delay(3*config.transitionExitTime + 3*config.transitionTime)
                    .duration(config.transitionTime)
                    .ease(config.easingFunction)
                    .attr("opacity", 1)
                    .text(function(d) {
                        return driver_id_name_mapping[d.key]
                    });

                showF1Intro();

                d3.select(".goatTextContainer").style("color", config.svgTextColor);

                d3.select(".mainGauge").style("background", config.svgBackgroundColor)

                d3.select(".infocard-container")
                    .attr("r", r - config.level2Gap - config.labelInset - config.ringInset - 30)
                    .style("fill", config.svgBackgroundColor)

                d3.select(".tableForeignObject")
                    .attr("transform", "translate(" + (r - 200) + "," + (r - 75) + ")")

                d3.select(".goatContainer")
                    .attr("transform", "translate(" + (r - 300) + "," + (r * 1.5) + ")")

            }

            function yearTickLabelMouseover(d, i) {
                if(d==2019){
                    return;
                }

                renderCircuitData(d);
                d3.selectAll(".levelArcs")
                    .attr("opacity", config.circleFillOpacityUnselected)

                d3.selectAll(".inner-circle")
                    .attr("opacity", function(p) {
                        return Math.round(p.year) == d ? config.circleFillOpacitySelected : config.circleFillOpacityUnselected
                    })

                d3.selectAll(".outer-circle")
                    .attr("opacity", function(p) {
                        return Math.round(p.year) == d ? config.circleFillOpacitySelected : config.circleFillOpacityUnselected
                    })

                d3.selectAll(".levelArcs").attr("opacity", function(p) {
                    return Math.round(scale.invert(p)) - 1 == d ? config.circleFillOpacitySelected : config.circleFillOpacityUnselected
                });

                d3.selectAll(".yearTicks")
                    .attr("stroke-opacity", function(p) {
                        return (p == 1977 || p == 2019 || p == d || p == d + 1 ? config.majorYearTickOpacity : config.tickYearUnselectedOpacity)
                    })
                    .attr("stroke", function(p) {
                        return (p == 1977 || p == 2019 || p == d || p == d + 1 ? "#aaa" : "#aaa")
                    })
                    .attr("stroke-width", function(p) {
                        return (p == 1977 || p == 2019 || p == d || p == d + 1 ? "2px" : "1px")
                    })

                var htmlstr = "<h3>Season: " + d + "</h3><h4>Era: " + year_era_mapping[d] + "</h4><p>Year Description: " + year_era_mapping[d] + "</p>";
                d3.selectAll(".infocard-table tbody").remove();
                d3.select(".infocard-table")
                    .append('tbody')
                    .append('tr')
                    .append('td')
                    .style("color", config.svgTextColor)
                    .html(htmlstr);

                d3.select("#infocardImg").attr("xlink:href", f1ErasInformation[year_era_mapping[d]]["img"])
                d3.select(".infocard-circle").style("fill", "url(#infocardImgContainer)");
                d3.select(".infocard-container").style("stroke", "#aaa").style("stroke-width", "2px");
                d3.select(".infocard-container-outer").style("stroke", "#aaa").style("stroke-width", "2px");


                row1Data = [{ key: "Continents", value: masterf1YearStats[d]["numcontinents"] }, { key: "Countries", value: masterf1YearStats[d]["numcountries"] }, {
                    key: "Venues",
                    value: masterf1YearStats[d]["numcircuits"]
                }, { key: "Tracks", value: masterf1YearStats[d]["numvenues"] }];
                row2Data = [{ key: "Seasons", value: masterf1YearStats[d]["numyears"] }, { key: "Races", value: masterf1YearStats[d]["numraces"] }, {
                    key: "Constructors",
                    value: masterf1YearStats[d]["numconstructors"]
                }, { key: "Drivers", value: masterf1YearStats[d]["numdrivers"] }];
                drawFeatureBubbles(row1Data, row2Data);
            }

            function yearTickLabelMouseout(d, i) {
                raceTicksG.html("");
                d3.select(".infocard-container").style("stroke", "#aaa").style("stroke-width", "1px");
                d3.select(".infocard-container-outer").style("stroke", "#aaa").style("stroke-width", "1px");
                showF1Intro();
                updateEraBandsMouseout();

                d3.selectAll(".levelArcs").attr("opacity", config.circleFillOpacitySelected);
                d3.selectAll(".inner-circle").attr("opacity", config.circleFillOpacity);
                d3.selectAll(".outer-circle").attr("opacity", config.circleFillOpacity);
            }

            function updateDriverInfocardOnMouseover(d, i) {
                // var htmlstr = "<h3>" + driver_id_name_mapping[d.driverId] + "</h3><h4>Driver Id: " + d.driverId + "</br>Nationality: " + d.nationality + "</br>Date of birth: " + d.dob + "</br>" + "</h4>";
                var htmlstr = "<div style='display:inline-block;width:400px;'>" +
                    "<h3 style='text-align: center'>" + driver_id_name_mapping[d.driverId] + "</h3>" +
                    "<h4 style='text-align: center'># Championships: " + masterCareerData[d.driverId]["numchamps"] + "</h4>" +
                    "<h4 style='text-align: center'>First Race: " + masterCareerData[d.driverId]["firstRace"] + "</h4>" +
                    "<h4 style='text-align: center'>Last Race: " + masterCareerData[d.driverId]["lastRace"] + "</h4>" +
                    // "<h4 style='text-align: center'># Championships: " + masterCareerData[d.driverId]["numchamps"] + "</h4>" +
                    "<br><h4 style='text-align: center'>Teams: " + teamsData[d.driverId].teams.toString().replace(/;/g, ",") + "</h4></div>";
                d3.selectAll(".infocard-table tbody").remove();
                d3.select(".infocard-table").append('tbody')
                    .append('tr')
                    .append('td')
                    .style("color", config.svgTextColor)
                    .html(htmlstr);

                d3.select("#infocardImg").attr("xlink:href", "data/images/profile_pic/" + d.driverId + ".png")
                d3.select(".infocard-circle").style("fill", "url(#infocardImgContainer)");
                d3.select(".infocard-container").style("stroke", "#aaa").style("stroke-width", "1px");
                d3.select(".infocard-container-outer").style("stroke", "#aaa").style("stroke-width", "1px");
            }

            function updateDriverInfocardOnMouseout(d, i) {
                d3.select(".infocard-container").style("stroke", "#aaa").style("stroke-width", "1px");
                d3.select(".infocard-container-outer").style("stroke", "#aaa").style("stroke-width", "1px");
                showF1Intro();
            }

            function updateErasInfocardOnMouseover(d, i) {
                var htmlstr = "<div style='display:inline-block;width:300px;'><h3 style='text-align: center'>" + f1ErasInformation[getEra(config.yearsList[i - 1])[0]]["name"] + "</h3><h4 style='text-align: center'>" + getEra(config.yearsList[i - 1])[0] + " - " + getEra(config.yearsList[i])[0] + "</h4><p style='text-align: center'>" + f1ErasInformation[getEra(config.yearsList[i - 1])[0]]["description"] + "</p>";
                d3.selectAll(".infocard-table tbody").remove();
                d3.select(".infocard-table").append('tbody')
                    .append('tr')
                    .append('td')
                    .style("color", config.svgTextColor)
                    .html(htmlstr);

                d3.select("#infocardImg").attr("xlink:href", f1ErasInformation[getEra(config.yearsList[i - 1])[0]]["img"])
                d3.select(".infocard-circle").style("fill", "url(#infocardImgContainer)");

                d3.select(".infocard-container").style("stroke", eraDifficultyScale(
                    f1ErasInformation[
                        getEra(Math.round(scale.invert(d)))[0]
                    ][config.eraFeature]
                )).style("stroke-width", "2px");

                d3.select(".infocard-container-outer").style("stroke", eraDifficultyScale(
                    f1ErasInformation[
                        getEra(Math.round(scale.invert(d)))[0]
                    ][config.eraFeature]
                )).style("stroke-width", "2px");
                // d3.select(".infocard-container").style("stroke", arcColorFn(d - 0.001)).style("stroke-width", "2px");
            }

            function updateErasInfocardOnMouseout(i) {
                d3.select(".infocard-container").style("stroke", "#aaa").style("stroke-width", "1px");
                d3.select(".infocard-container-outer").style("stroke", "#aaa").style("stroke-width", "1px");
                showF1Intro();
            }

            function updateEraBandsMouseout() {
                d3.selectAll(".yearTicks")
                    .attr("stroke-opacity", function(d) {
                        return config.erasList.indexOf(d) === -1 ? config.minorYearTickOpacity : config.majorYearTickOpacity
                    })
                    .attr("stroke", "#aaa")
                    .attr("stroke-width", "1px");
            }

            function updateEraBandsMouseover(d, i) {
                d3.selectAll(".yearTicks")
                    .attr("stroke-opacity", function(p) {
                        return config.erasList.indexOf(p) === -1 ? config.tickYearUnselectedOpacity : (p == config.erasList[i] || p == config.erasList[i - 1] ? config.majorYearTickOpacity : config.tickYearUnselectedOpacity)
                    })
                    .attr("stroke", function(p) {
                        return config.erasList.indexOf(p) === -1 ? "#aaa" : (p == config.erasList[i] || p == config.erasList[i - 1] ? eraDifficultyScale(f1ErasInformation[scale.invert(d)][config.eraFeature]) : "#aaa")
                    })
                    .attr("stroke-width", function(p) {
                        return config.erasList.indexOf(p) === -1 ? "1px" : (p == config.erasList[i] || p == config.erasList[i - 1] ? "2px" : "1px")
                    })
            }

            function updateInnerOuterCirclesOnLevelMouseout() {
                d3.selectAll(".inner-circle").attr("opacity", config.circleFillOpacity);
                d3.selectAll(".outer-circle").attr("opacity", config.circleFillOpacity);
            }

            function updateInnerOuterCirclesOnLevelMouseover(i) {
                d3.selectAll(".inner-circle")
                    .attr("opacity", function(p) {
                        return (Math.round(p.year) >= Math.round(getEra(config.yearsList[i - 1])[0]) && p.year < Math.round(getEra(config.yearsList[i - 1])[1]) ? config.circleFillOpacitySelected : config.circleFillOpacityUnselected)
                    })
                d3.selectAll(".outer-circle")
                    .attr("opacity", function(p) {
                        return (Math.round(p.year) >= Math.round(getEra(config.yearsList[i - 1])[0]) && p.year < Math.round(getEra(config.yearsList[i - 1])[1]) ? config.circleFillOpacitySelected : config.circleFillOpacityUnselected)
                    })
            }

            function outermostArcsMouseover(d, i) {

                var htmlstr = "<h3>" +
                    f1ErasInformation[config.erasList[i - 1]]["name"] +
                    "</h3><h4>" +
                    config.erasList[i - 1] +
                    " - " +
                    config.erasList[i] +
                    "</h4><p>" +
                    f1ErasInformation[config.erasList[i - 1]]["description"] +
                    "</p>"

                d3.selectAll(".infocard-table tbody").remove();
                d3.select(".infocard-table").append('tbody')
                    .append('tr')
                    .append('td')
                    .style("color", config.svgTextColor)
                    .html(htmlstr);

                d3.select("#infocardImg").attr("xlink:href", f1ErasInformation[getEra(config.yearsList[i - 1])[0]]["img"])
                d3.select(".infocard-circle").style("fill", "url(#infocardImgContainer)");

                d3.select(".infocard-container").style("stroke", eraDifficultyScale(
                    f1ErasInformation[
                        getEra(Math.round(scale.invert(d)))[0]
                    ][config.eraFeature]
                )).style("stroke-width", "2px");

                d3.select(".infocard-container-outer").style("stroke", eraDifficultyScale(
                    f1ErasInformation[
                        getEra(Math.round(scale.invert(d)))[0]
                    ][config.eraFeature]
                )).style("stroke-width", "2px");

                updateEraBandsMouseover(d, i);

                d3.selectAll(".inner-circle")
                    .attr("opacity", function(p) {
                        return (Math.round(p.year) >= getEra(Math.round(scale.invert(d)) - 1)[0] && p.year < getEra(Math.round(scale.invert(d)) - 1)[1] ? config.circleFillOpacitySelected : config.circleFillOpacityUnselected)
                    })
                d3.selectAll(".outer-circle")
                    .attr("opacity", function(p) {
                        return (Math.round(p.year) >= getEra(Math.round(scale.invert(d)) - 1)[0] && p.year < getEra(Math.round(scale.invert(d)) - 1)[1] ? config.circleFillOpacitySelected : config.circleFillOpacityUnselected)
                    })

                d3.selectAll(".levelArcs").attr("opacity", function(p) {
                    if (p > tickData[i - 1] && p <= d) {
                        return config.circleFillOpacitySelected;
                    } else {
                        return config.circleFillOpacityUnselected;
                    }
                });

                var era = getEra(Math.round(scale.invert(d)) - 1)[0];
                row1Data = [{ key: "Continents", value: masterf1EraStats[era]["numcontinents"] }, { key: "Countries", value: masterf1EraStats[era]["numcountries"] }, {
                    key: "Venues",
                    value: masterf1EraStats[era]["numcircuits"]
                }, { key: "Tracks", value: masterf1EraStats[era]["numvenues"] }];
                row2Data = [{ key: "Seasons", value: masterf1EraStats[era]["numyears"] }, { key: "Races", value: masterf1EraStats[era]["numraces"] }, {
                    key: "Constructors",
                    value: masterf1EraStats[era]["numconstructors"]
                }, { key: "Drivers", value: masterf1EraStats[era]["numdrivers"] }];
                drawFeatureBubbles(row1Data, row2Data);

            }

            function outermostArcsMouseout(d, i) {
                updateEraBandsMouseout();
                updateInnerOuterCirclesOnLevelMouseout();
                updateErasInfocardOnMouseout(i);
                d3.selectAll(".levelArcs").attr("opacity", config.circleFillOpacity);
            }

            function level1ArcMouseover(d, i) {
                renderCircuitData(Math.round(scale.invert(d)) - 1);
                // updateErasInfocardOnMouseover(d, i);
                yearTickLabelMouseover(Math.round(scale.invert(d)) - 1, i);
            }

            function level1ArcMouseout(d, i) {
                raceTicksG.html("");
                d3.select(".infocard-container").style("stroke", "#aaa").style("stroke-width", "1px");
                d3.select(".infocard-container-outer").style("stroke", "#aaa").style("stroke-width", "1px");
                showF1Intro();
                updateEraBandsMouseout();
                d3.selectAll(".levelArcs").attr("opacity", config.circleFillOpacitySelected);
                d3.selectAll(".inner-circle").attr("opacity", config.circleFillOpacity);
                d3.selectAll(".outer-circle").attr("opacity", config.circleFillOpacity);
            }

            function level2ArcMouseover(d, i) {
                renderCircuitData(Math.round(scale.invert(d)) - 1);
                // updateErasInfocardOnMouseover(d, i);
                yearTickLabelMouseover(Math.round(scale.invert(d)) - 1, i);
            }

            function level2ArcMouseout(d, i) {
                raceTicksG.html("");
                d3.select(".infocard-container").style("stroke", "#aaa").style("stroke-width", "1px");
                d3.select(".infocard-container-outer").style("stroke", "#aaa").style("stroke-width", "1px");
                showF1Intro();
                updateEraBandsMouseout();
                d3.selectAll(".levelArcs").attr("opacity", config.circleFillOpacitySelected);
                d3.selectAll(".inner-circle").attr("opacity", config.circleFillOpacity);
                d3.selectAll(".outer-circle").attr("opacity", config.circleFillOpacity);
            }

            function level3ArcMouseover(d, i) {
                renderCircuitData(Math.round(scale.invert(d)) - 1);
                // updateErasInfocardOnMouseover(d, i);
                yearTickLabelMouseover(Math.round(scale.invert(d)) - 1, i);
            }

            function level3ArcMouseout(d, i) {
                raceTicksG.html("");
                d3.select(".infocard-container").style("stroke", "#aaa").style("stroke-width", "1px");
                d3.select(".infocard-container-outer").style("stroke", "#aaa").style("stroke-width", "1px");
                showF1Intro();
                updateEraBandsMouseout();
                d3.selectAll(".levelArcs").attr("opacity", config.circleFillOpacitySelected);
                d3.selectAll(".inner-circle").attr("opacity", config.circleFillOpacity);
                d3.selectAll(".outer-circle").attr("opacity", config.circleFillOpacity);
            }

            function showFeatureBubbleForDriver(d) {
                filtered_data = rawData.filter(function(p) {
                    return p.driverId == d.driverId
                });
                var computedFeatures = d3v4.nest()
                    .key(function(d) {
                        return d.driverId;
                    })
                    .rollup(function(v) {
                        return {
                            "Wins": d3v4.sum(v, function(d) {
                                return d[feature_display_mapping["Wins"]];
                            }),
                            "Points": d3v4.sum(v, function(d) {
                                return d[feature_display_mapping["Points"]];
                            }),
                            "Poles": d3v4.sum(v, function(d) {
                                return d[feature_display_mapping["Poles"]];
                            }),
                            "Races": d3v4.sum(v, function(d) {
                                return d[feature_display_mapping["Races"]];
                            }),
                            "Podium Start": d3v4.sum(v, function(d) {
                                return d[feature_display_mapping["Podium Start"]];
                            }),
                            "Podium Finish": d3v4.sum(v, function(d) {
                                return d[feature_display_mapping["Podium Finish"]];
                            }),
                            "Pit Stops": d3v4.sum(v, function(d) {
                                return d[feature_display_mapping["Pit Stops"]];
                            }),
                            "Laps": d3v4.sum(v, function(d) {
                                return d[feature_display_mapping["Laps"]];
                            }),
                        };
                    })
                    .object(filtered_data);

                row1Data = [{ key: "Wins", value: computedFeatures[d.driverId]["Wins"] }, {
                    key: "Points",
                    value: computedFeatures[d.driverId]["Points"]
                }, { key: "Poles", value: computedFeatures[d.driverId]["Poles"] }, {
                    key: "Races",
                    value: computedFeatures[d.driverId]["Races"]
                }];
                row2Data = [{
                    key: "Podium Start",
                    value: computedFeatures[d.driverId]["Podium Start"]
                }, { key: "Podium Finish", value: computedFeatures[d.driverId]["Podium Finish"] }, {
                    key: "Pit Stops",
                    value: computedFeatures[d.driverId]["Pit Stops"]
                }, { key: "Laps", value: computedFeatures[d.driverId]["Laps"] }];
                drawFeatureBubbles(row1Data, row2Data);
            }

            function innerArcCircleMouseover(d, i) {

                updateDriverInfocardOnMouseover(d, i);

                d3.selectAll(".inner-circle").attr("opacity", function(p) {
                    if (p.driverId == d.driverId) {
                        return config.circleFillOpacitySelected;
                    } else if (driver_id_color_mapping[p.driverId] !== undefined) {
                        return config.circleFillOpacitySelected;
                    } else
                        return config.circleFillOpacityUnselected;
                });
                d3.selectAll(".outer-circle").attr("opacity", function(p) {
                    if (p.driverId == d.driverId) {
                        return config.circleFillOpacitySelected;
                    } else if (driver_id_color_mapping[p.driverId] !== undefined) {
                        return config.circleFillOpacitySelected;
                    } else
                        return config.circleFillOpacityUnselected;
                });

                /*d3.selectAll(".driver-bubble").filter( function(p){
                    return p.driverId == d.driverId
                }).attr("fill","#FFC600");*/


                showFeatureBubbleForDriver(d);
            }

            function innerArcCircleMouseout(d, i) {
                showF1Intro();
                d3.selectAll(".inner-circle").attr("opacity", config.circleFillOpacity);
                d3.selectAll(".outer-circle").attr("opacity", config.circleFillOpacity);
                updateDriverInfocardOnMouseout(d, i);
            }



            function outerArcCircleClick(d, i) {
                if (Object.keys(selectedDriverInfo).length == 4 || d.driverId in selectedDriverInfo) {

                    d3.selectAll(".driver-bubble").filter(function(p) {
                        return p.driverId == d.driverId
                    }).attr("fill", function() {
                        return "white";
                    });

                    d3.selectAll(".driver-text").filter(function(p) {
                        return p.driverId == d.driverId
                    }).attr("fill", "black");

                    if (d.driverId in selectedDriverInfo) {
                        $scope.removeDriverFromCompareList(d.driverId);
                    }

                    $timeout(function(){$scope.$apply();});
                    return;
                }

                /* console.log("is the code not coming here");*/
                $scope.selectedDriverInfo[d.driverId] = {
                    driver: d,
                    name: driver_id_name_mapping[d.driverId],
                    inputOrder: compareOrder++
                };
                selectedDriverInfo = $scope.selectedDriverInfo;
                /*console.log("im here with selecteddriverinfo");
                console.log(selectedDriverInfo);*/
                /* console.log("ehjfbrejhf");
                 console.log($scope.selectedDriverInfo);*/


                $scope.showCompareView = Object.keys(selectedDriverInfo).length > 0;
                $timeout(function(){$scope.$apply();});


                randomElement = comparisonColorsForDrivers.randomElement();
                driver_id_color_mapping[d.driverId] = randomElement;

                /* console.log(comparisonColorsForDrivers);
                 console.log(driver_id_color_mapping);*/
                var index = comparisonColorsForDrivers.indexOf(randomElement);
                if (index > -1) {
                    comparisonColorsForDrivers.splice(index, 1);
                }

                d3.selectAll(".driver-text").filter(function(p) {
                    return p.driverId == d.driverId
                }).attr("fill", "white");

                d3.selectAll(".driver-bubble").filter(function(p) {
                    return p.driverId == d.driverId
                }).attr("fill", function() {
                    return randomElement;
                });

            }

            $scope.click_compare = function(chartTimeGroup) {
                $scope.showTimeseriesCharts=true;

                $('.compare_button').removeClass("clicked");

                if (chartTimeGroup === 'era') {
                    $('#compare-button-era').addClass("clicked");
                } else if (chartTimeGroup === 'year') {
                    $('#compare-button-year').addClass("clicked");
                } else if (chartTimeGroup === 'race') {
                    $('#compare-button-race').addClass("clicked");
                }

                $timeout(function(){
                    $scope.$apply();
                    renderDetailedPlots(Object.keys(selectedDriverInfo), chartTimeGroup);
                });
            };

            $scope.removeDriverFromCompareList = function(driverId) {
                comparisonColorsForDrivers.push(driver_id_color_mapping[driverId]);
                delete(selectedDriverInfo[driverId]);
                delete(driver_id_color_mapping[driverId]);
                // console.log(comparisonColorsForDrivers);

                d3.selectAll(".driver-bubble").filter(function(p) {
                    return p.driverId == driverId
                }).attr("fill", "white");

                d3.selectAll(".driver-text").filter(function(p) {
                    return p.driverId == driverId
                }).attr("fill", "black");

                $scope.showCompareView = Object.keys(selectedDriverInfo).length > 0;
                if(Object.keys(selectedDriverInfo).length == 0){
                    $scope.showTimeseriesCharts = false;
                }                
                $timeout(function(){$scope.$apply();});

            };

            function outerArcCircleMouseover(d, i) {

                updateDriverInfocardOnMouseover(d, i);
                d3.selectAll(".inner-circle").attr("opacity", function(p) {
                    if (p.driverId == d.driverId) {
                        return config.circleFillOpacitySelected;
                    } else if (driver_id_color_mapping[p.driverId] !== undefined) {
                        return config.circleFillOpacitySelected;
                    } else
                        return config.circleFillOpacityUnselected;
                });
                d3.selectAll(".outer-circle").attr("opacity", function(p) {
                    if (p.driverId == d.driverId) {
                        return config.circleFillOpacitySelected;
                    } else if (driver_id_color_mapping[p.driverId] !== undefined) {
                        return config.circleFillOpacitySelected;
                    } else
                        return config.circleFillOpacityUnselected;
                });

                showFeatureBubbleForDriver(d);
            }

            function outerArcCircleMouseout(d, i) {
                showF1Intro();
                d3.selectAll(".inner-circle").attr("opacity", config.circleFillOpacity);
                d3.selectAll(".outer-circle").attr("opacity", config.circleFillOpacity);
                updateDriverInfocardOnMouseout(d, i);
            }

            function searchDriver(driverList) {
                d3.selectAll(".inner-circle circle")
                    .attr("stroke", function(p) {
                        var name = p.forename + " " + p.surname;
                        return driverList.indexOf(name) !== -1 ? config.circleStrokeColorSelected : config.circleStrokeColorUnselected
                    })
                    .attr("stroke-width", function(p) {
                        var name = p.forename + " " + p.surname;
                        return driverList.indexOf(name) !== -1 ? "1px" : null
                    });

                d3.selectAll(".inner-circle text")
                    .attr("fill", function(p) {
                        var name = p.forename + " " + p.surname;
                        return driverList.indexOf(name) !== -1 ? config.circleStrokeColorSelected : config.circleStrokeColorUnselected
                    })

                d3.selectAll(".outer-circle circle")
                    .attr("stroke", function(p) {
                        var name = p.forename + " " + p.surname;
                        return driverList.indexOf(name) !== -1 ? config.circleStrokeColorSelected : config.circleStrokeColorUnselected
                    })
                    .attr("stroke-width", function(p) {
                        var name = p.forename + " " + p.surname;
                        return driverList.indexOf(name) !== -1 ? "1px" : null
                    });

                d3.selectAll(".outer-circle text")
                    .attr("fill", function(p) {
                        var name = p.forename + " " + p.surname;
                        return driverList.indexOf(name) !== -1 ? config.circleStrokeColorSelected : config.circleStrokeColorUnselected
                    })
            }

            function showF1Intro() {

                row1Data = [{ key: "Continents", value: 6 }, { key: "Countries", value: 30 }, {
                    key: "Venues",
                    value: 53
                }, { key: "Tracks", value: 39 }];
                row2Data = [{ key: "Seasons", value: 42 }, { key: "Races", value: 711 }, {
                    key: "Constructors",
                    value: 82
                }, { key: "Drivers", value: 312 }];
                drawFeatureBubbles(row1Data, row2Data);

                d3.select("#infocardImg").attr("xlink:href", "data/images/F1_Vision-ColorOnWhite.png")
                d3.select(".infocard-circle").style("fill", "url(#infocardImgContainer)");

                var htmlstr = "<h3>Formula 1</h3><h4>1977 - 2018</h4>";
                d3.selectAll(".infocard-table tbody").remove();
                d3.select(".infocard-table").append('tbody')
                    .append('tr')
                    .append('td')
                    .style("color", config.svgTextColor)
                    .html(htmlstr);
            }

            initSVG(width, height);

            return {
                initSVG: initSVG,
                update: update,
                isRendered: isRendered,
                configure: configure,
                searchDriver: searchDriver
            };
        };


        function loadNewDataset() {
            $scope.showCompareView = false;
            $timeout(function(){$scope.$apply();});
            f1DashboardInstance.update(globalConfig, nested_data);
        }


        function renderData(data) {

            data.map(function(d) {
                try {
                    Object.keys(d).forEach(function(k) {
                        if (!isNaN(d[k])) {
                            d[k] = parseFloat(d[k]);
                        }
                    });

                    d.initials = (d.forename.charAt(0) + d.surname.charAt(0)).toUpperCase();

                    if (!(d.driverId in driver_id_name_mapping)) {
                        name = d.forename + " " + d.surname;

                        driver_id_initials_mapping[d.driverId] = d.initials;
                        driver_id_name_mapping[d.driverId] = name;
                        driver_name_id_mapping[name] = d.driverId;
                        ranking_mapping[id] = {};
                        // $('<option />', { value: name, text: name }).appendTo($('#searchDriver'));
                    }

                } catch (err) {

                }
            });


            rawData = JSON.parse(JSON.stringify(data));

            // GOAT OVERALL
            goatOverallDataList = d3v4.nest()
                .key(function(d) {
                    return d.driverId;
                })
                .rollup(function(a) {
                    return d3v4.max(a, function(d) {
                        return d.rank
                    })
                })
                .entries(data)
                .filter(function(p) {
                    return p.value != 0
                })
                .sort(function(a, b) {
                    return d3.ascending(a.value, b.value)
                });

            // console.log(goatYearWiseDataList);
            // console.log(goatEraWiseDataList);

            nested_data = d3.nest()
                .key(function(d) {
                    return d.year;
                })
                .entries(data);

            f1DashboardInstance = F1Dashboard('#eras', width, height);
            f1DashboardInstance.update(globalConfig, nested_data);

        }



        $(document).ready(function() {


            var yearDataUrl = DATA_URL + "year/year_f1.csv";
            var raceDataUrl = DATA_URL + "raceId/raceId_f1.csv";
            var eraDataUrl = DATA_URL + "era/era_f1.csv";
            var circuitYearUrl = DATA_URL + "circuit_winners.csv";
            var careerUrl = DATA_URL + "driver-career.csv";

            setTimeout(function () {
                $('#goat').fadeIn("slow", "linear", function () {
                    $('#goat').remove();
                    $('#findout').fadeIn("show","linear",function(){
                        $("#box").animate({
                            width: "100%"
                        }, {
                            duration: 2000,
                            easing: "linear",
                            step: function(x) {
                                /*$("#demo").text(Math.round(x * 100 / 400)  + "%");*/
                            },
                            complete: function () {
                                $('#findout').remove();
                                $('#box').remove();
                                $('.loading-animation').remove();
                            }
                        });
                    });
                })
            }, 3000);

            var f1YearStatsUrl = DATA_URL + "counterbyyear.csv";
            var f1EraStatsUrl = DATA_URL + "counterbyera.csv";

            d3.csv(yearDataUrl, function(yearData) {
                d3.csv(f1YearStatsUrl, function(f1YearStatsData) {
                    d3.csv(f1EraStatsUrl, function(f1EraStatsData) {
                        d3.csv(raceDataUrl, function(raceData) {
                            d3.csv(eraDataUrl, function(eraData) {
                                d3.csv(circuitYearUrl, function(circuitData) {
                                    d3.csv(careerUrl, function(careerData) {
                                        d3.csv("data/second_dial_features.csv", function(data) {
                                            d3.csv("data/driver_teams.csv", function(teams) {

                                                yearData = yearData.filter(function(d){
                                                    return parseInt(d.year)>=1977;
                                                })

                                                mainDict = {};
                                                driverPoints = d3v4.nest().key(function(d) {
                                                    return d.driverId
                                                }).key(function(d) {
                                                    return d.era
                                                }).rollup(function(v) {
                                                    var g = d3v4.max(v, function(d) {
                                                            return parseInt(d[feature_display_mapping["Points"]]);
                                                        });

                                                    v.forEach(function(f){
                                                        if(parseInt(f["points_sum"]) == parseInt(g)){
                                                            if(!(f.driverId in mainDict)){
                                                                mainDict[f.driverId] = {};
                                                            }
                                                            mainDict[f.driverId][parseInt(f.era)] = parseInt(f.year);
                                                            return parseInt(f.year);
                                                        }
                                                    });
                                                }).object(yearData);

                                                masterf1YearStats = d3v4.nest().key(function(d) {
                                                    return d.year
                                                }).rollup(function(v) {
                                                    return v[0]
                                                }).object(f1YearStatsData);

                                                masterf1EraStats = d3v4.nest().key(function(d) {
                                                    return d.era
                                                }).rollup(function(v) {
                                                    return v[0]
                                                }).object(f1EraStatsData);

                                                teamsData = d3v4.nest().key(function(d) {
                                                    return d.driverId
                                                }).rollup(function(v) {
                                                    return v[0]
                                                }).object(teams);

                                                masterCareerData = d3v4.nest().key(function(d) {
                                                    return d.driverId
                                                }).rollup(function(v) {
                                                    return v[0]
                                                }).object(careerData);

                                                circuitData = circuitData.filter(function(d) {
                                                    return parseInt(d.year) >= 1977;
                                                })

                                                masterCircuitData = d3v4.nest().key(function(d) {
                                                        return d.year
                                                    })
                                                    .object(circuitData);

                                                data.forEach(function(item) {
                                                    Object.keys(item).forEach(function(key) {
                                                        item[key] = isNaN(item[key]) ? item[key] : parseFloat(item[key]);
                                                    });
                                                });
                                                f1YearsInformation = d3v4.nest()
                                                    .key(function(d) {
                                                        return d.year;
                                                    })
                                                    .rollup(function(v) {
                                                        return v[0]
                                                    })
                                                    .object(data);

                                                f1YearsInformation[2019] = JSON.parse(JSON.stringify(f1YearsInformation[2018]));
                                                f1YearsInformation[2019]["year"] = 2019;
                                                f1YearsInformation[2019]["overall_processed"] = 10;

                                                renderData(yearData);
                                                masterYearData = yearData;
                                                masterRaceData = raceData;
                                                masterEraData = eraData;
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        function getStack(key, id) {
            if (key == "Races") {
                return id;
            } else {
                return undefined;
            }
        }

        function seriesType(key) {
            if (key == "Races") {
                return "normal";
            } else if (key == "Wins") {
                return "percent"
            } else {
                return undefined;
            }
        }

        function chartType(key) {
            if (key == "Races") {
                return "column";
            } else if (key == "Wins") {
                return "column"
            } else {
                return "line";
            }
        }

        AllCharts = {};

        function renderDetailedPlots(driverIds, chartTimeGroup) {
            var features = Object.keys(feature_display_mapping);
            features.push("position")
            features.forEach(function(key) {
                if (key != "Overall") {
                    if ($("#" + feature_display_mapping[key]).highcharts()) {
                        AllCharts[key].destroy();
                    }
                    AllCharts[key] = new Highcharts.chart(feature_display_mapping[key], {

                        title: {
                            text: ""
                        },
                        tooltip: {
                            shared: true,
                            positioner: function(labelWidth, labelHeight, point) {
                                var tooltipX = point.plotX;
                                var tooltipY = 0;
                                return {
                                    x: tooltipX,
                                    y: tooltipY
                                }
                            }
                        },

                        chart: {
                            backgroundColor: config.svgBackgroundColor,
                            width: $("#" + feature_display_mapping[key]).parent().width(),
                            height: 500,
                            spacingTop: 25,
                            zoomType: 'x',
                            style: {
                                fontFamily: 'F1 Font',
                                color: "#fff"
                            },
                            type: chartType(key)
                        },
                        legend: {
                            layout: 'vertical',
                            itemMarginBottom: 8,
                            align: 'right',
                            verticalAlign: 'top',
                            itemStyle: {
                                fontFamily: 'F1 Font',
                                color: '#A0A0A0'
                            },
                            itemHoverStyle: {
                                color: '#FFF'
                            },
                            itemHiddenStyle: {
                                color: '#444'
                            }
                        },

                        loading: {
                            labelStyle: {
                                color: 'white'
                            },
                            style: {
                                backgroundColor: 'transparent'
                            }
                        },
                        subtitle: {
                            floating: true,
                            text: null
                        },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                day: '%Y-%m-%d' //ex- 01 Jan 2016
                            }
                        },
                        yAxis: {
                            lineWidth: 0,
                            gridLineColor: 'transparent',
                            minorGridLineWidth: 0,
                            title: {
                                text: key,
                                style: {
                                    fontFamily: 'F1 Font',
                                    color: "#fff"
                                }
                            }
                        },
                        plotOptions: {
                            line: {
                                marker: {
                                    enabled: false
                                }
                            },
                        },
                        series: [],

                    });

                    AllCharts[key].showLoading();
                    driverIds.forEach(function(id) {

                        if (chartTimeGroup == "race") {
                            renderingData = JSON.parse(JSON.stringify(masterRaceData));
                        } else if (chartTimeGroup == "year") {
                            renderingData = JSON.parse(JSON.stringify(masterYearData));
                        } else if (chartTimeGroup == "era") {
                            renderingData = JSON.parse(JSON.stringify(masterEraData));
                        }

                        timeseries_data = d3.nest()
                            .key(function(d) {
                                return d.driverId
                            })
                            .entries(renderingData)
                            .filter(function(d) {
                                return d.key == id;
                            });

                        timeseries_data_array = [];
                        timeseries_data[0].values.forEach(function(d) {

                            if (chartTimeGroup == "race") {
                                time = moment(d.date, "YYYY-MM-DD").format("x");
                            } else if (chartTimeGroup == "year") {
                                time = moment(d.year, "YYYY").format("x");
                            } else if (chartTimeGroup == "era") {
                                time = moment(d.era, "YYYY").format("x");
                            }

                            timeseries_data_array.push([parseInt(time), parseFloat(d[feature_display_mapping[key]])]);
                        });

                        sorted_timeseries_data_array = timeseries_data_array.sort(function(a, b) {
                            return a[0] - b[0];
                        });

                        AllCharts[key].addSeries({
                            color: driver_id_color_mapping[id],
                            name: driver_id_name_mapping[id],
                            stacking: seriesType(key),
                            stack: getStack(key, id),
                            data: sorted_timeseries_data_array,
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                radius: 0.5
                            }

                        }, false);

                    });
                    setTimeout(function() {
                        AllCharts[key].redraw();
                        AllCharts[key].hideLoading();
                    }, 3000);
                }
            });
        }
    }])
    .filter("toArray", function() {
        return function(obj) {
            var result = [];
            angular.forEach(obj, function(val, key) {
                result.push(val);
            });
            return result;
        };
    });