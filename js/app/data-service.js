angular
    .module('vroom-vroom')
    .service('DataService', ['$http', 'DATA_URL', function($http, DATA_URL) {

        this.getData = function() {
            var url = DATA_URL + "year/lap_time_statistics_for_drivers.csv";
            d3.csv(url, function(data) {
                return data;
            });
        }
    }]);