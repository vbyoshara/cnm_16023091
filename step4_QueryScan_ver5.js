
/**
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
var AWS = require("aws-sdk");
var express = require('express');
var app = express();

AWS.config.update({
    region: "us-west-2",
    accessKeyId:"Viet",
    secretAccessKey: "123456",
    endpoint: "http://localhost:8001"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Querying for movies from 1992 - titles A-L, with genres and lead actor");
app.get('/', function (req, res) {
    res.set('Content-Type', 'text/html');
    var params = {
        TableName : "Movies",
        ProjectionExpression:"#yr, title, info.genres, info.actors[0]",
        KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
        ExpressionAttributeNames:{
            "#yr": "year"
        },
        ExpressionAttributeValues: {
            ":yyyy": 1992,
            ":letter1": "A",
            ":letter2": "L"
        }
    };
    var params2 = {
        TableName : "Movies",
        ProjectionExpression:"#yr, title, info.genres, info.actors[0]",
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames:{
            "#yr": "year"
        },
        ExpressionAttributeValues: {
            ":yyyy": 1991,
        }
    };


    docClient.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            var s = '<!DOCTYPE html><html><head></head><body>';
            s = s + '<div style="color: red">';
            data.Items.forEach(function(item) {
                // console.log(" -", item.year + ": " + item.title
                //     + " ... " + item.info.genres
                //     + " ... " + item.info.actors[0]);
                s += item.year + " - ";
                s += item.info.genres + "</br>";
            });
            s += "</div>";
            s = s + '</body></html>';
            res.write(s);
            res.end();
        }
    });



});

var server = app.listen(8083, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://localhost:8083", host, port)
})


