/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.80952380952381, "KoPercent": 0.19047619047619047};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7702380952380953, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9825, 500, 1500, "get booking by id"], "isController": false}, {"data": [0.9633333333333334, 500, 1500, "partial update booking using patch"], "isController": false}, {"data": [0.9775, 500, 1500, "update booking using put"], "isController": false}, {"data": [0.255, 500, 1500, "login"], "isController": false}, {"data": [0.9675, 500, 1500, "delete booking"], "isController": false}, {"data": [0.2808333333333333, 500, 1500, "get booking ids"], "isController": false}, {"data": [0.965, 500, 1500, "createBooking"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4200, 8, 0.19047619047619047, 725.1978571428587, 261, 16356, 299.0, 1878.3000000000006, 2450.6499999999987, 3835.0, 173.09594460929773, 986.8918700930391, 50.54266351384768], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["get booking by id", 600, 0, 0.0, 310.7483333333333, 261, 1315, 284.0, 312.9, 361.94999999999993, 961.7600000000002, 29.00091836241481, 26.024925685146695, 5.664241867659142], "isController": false}, {"data": ["partial update booking using patch", 600, 0, 0.0, 341.05333333333306, 263, 2087, 289.0, 379.9, 840.6999999999996, 928.9300000000001, 28.971511347175277, 26.063986298889425, 8.798964872042491], "isController": false}, {"data": ["update booking using put", 600, 0, 0.0, 326.6533333333334, 263, 1491, 290.0, 361.9, 444.7999999999997, 956.97, 28.978507606858248, 26.093485872977542, 14.234559888915722], "isController": false}, {"data": ["login", 600, 8, 1.3333333333333333, 1847.9116666666673, 1048, 16356, 1454.5, 3083.8, 3791.0999999999894, 5381.6900000000005, 30.30149992424625, 22.9711409777284, 7.397827129942932], "isController": false}, {"data": ["delete booking", 600, 0, 0.0, 333.5883333333334, 262, 1358, 288.0, 400.39999999999964, 820.0, 920.9300000000001, 28.956131460836833, 21.331393875778197, 6.4189861734472276], "isController": false}, {"data": ["get booking ids", 600, 0, 0.0, 1571.0199999999995, 525, 5783, 1409.0, 2799.0, 3227.5499999999993, 4299.510000000001, 28.65192684208013, 996.8588739643523, 3.8333144310204865], "isController": false}, {"data": ["createBooking", 600, 0, 0.0, 345.4100000000004, 261, 1838, 289.0, 352.0, 1011.0, 1094.8400000000001, 33.04510657046869, 30.587807044115216, 15.005834526628849], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 5,017 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 12.5, 0.023809523809523808], "isController": false}, {"data": ["The operation lasted too long: It took 5,550 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 12.5, 0.023809523809523808], "isController": false}, {"data": ["The operation lasted too long: It took 5,351 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 12.5, 0.023809523809523808], "isController": false}, {"data": ["The operation lasted too long: It took 7,978 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 12.5, 0.023809523809523808], "isController": false}, {"data": ["The operation lasted too long: It took 16,356 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 12.5, 0.023809523809523808], "isController": false}, {"data": ["The operation lasted too long: It took 5,808 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 12.5, 0.023809523809523808], "isController": false}, {"data": ["The operation lasted too long: It took 5,458 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 12.5, 0.023809523809523808], "isController": false}, {"data": ["The operation lasted too long: It took 5,382 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 12.5, 0.023809523809523808], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4200, 8, "The operation lasted too long: It took 5,017 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 5,550 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 5,351 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 7,978 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 16,356 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["login", 600, 8, "The operation lasted too long: It took 5,017 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 5,550 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 5,351 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 7,978 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 16,356 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
