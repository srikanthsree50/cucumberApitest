const {Given, When, Then} = require('cucumber');
const got = require('got');
const assert = require('assert').strict;

var accessToken = '60199351399fccbd15dd00e689b559a9916423fed086c23b8e33c6bf86cc80ea';
var baseUrl = 'https://gorest.co.in/public-api/users';
var apiResponse;

Given(/^user with email "([^"]*)" does not exist$/, async function (email) {
    let getResponse = await got.get(baseUrl + '?email=' + email);
    let jsonResp = JSON.parse(getResponse.body);
    assert.equal(jsonResp.data.length, 0);
});
When(/^request to create a user is sent with the following properties:$/, async function (dataTable) {
    let postData = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        json: dataTable.rowsHash()
    };
    apiResponse = await got.post(baseUrl, postData);
    assert.equal(apiResponse.statusCode, 200);
});
Then(/^response code is (\d+)$/, function (code) {
    let jsonResp = JSON.parse(apiResponse.body);
    assert.equal(jsonResp.code, code);
});
Then(/^user with email "([^"]*)" exists$/, async function (email) {
    let getResponse = await got.get(baseUrl + '?email=' + email);
    let jsonResp = JSON.parse(getResponse.body);
    assert.equal(jsonResp.data[0].email, email);
});
Then(/^new user with email "([^"]*)" is not created$/, async function (email) {
    let getResponse = await got.get(baseUrl + '?email=' + email);
    let jsonResp = JSON.parse(getResponse.body);
    assert.equal(jsonResp.data.length, 1);
});
Given(/^user with email "([^"]*)" has the following properties:$/, async function (email, dataTable) {
    let userProperties = dataTable.rowsHash();
    let getResponse = await got.get(baseUrl + '?email=' + email);
    let jsonResp = JSON.parse(getResponse.body);
    assert.equal(jsonResp.data[0].gender, userProperties.gender);
    assert.equal(jsonResp.data[0].status, userProperties.status);
});

When(/^request to update user with email "([^"]*)" is sent with the following properties:$/, async function (email, dataTable) {
    let patchData = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        json: dataTable.rowsHash()
    };
    let getResponse = await got.get(baseUrl + '?email=' + email);
    let id = JSON.parse(getResponse.body).data[0].id;
    apiResponse = await got.patch(baseUrl + '/' + id, patchData);
    assert.equal(JSON.parse(apiResponse.body).code, 200);
});
When(/^request to create user post for user with email "([^"]*)" is sent with the following properties:$/, async function (email, dataTable) {
    let userPostData = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        json: dataTable.rowsHash()
    };
    let getResponse = await got.get(baseUrl + '?email=' + email);
    let id = JSON.parse(getResponse.body).data[0].id;
    apiResponse = await got.post(baseUrl + '/' + id + '/posts', userPostData);
    assert.equal(JSON.parse(apiResponse.body).code, 201);
});
Then(/^post for user with email "([^"]*)" exists$/, async function (email) {
    let getResponse = await got.get(baseUrl + '?email=' + email);
    let id = JSON.parse(getResponse.body).data[0].id;
    let userPostResponse = await got.get(baseUrl + '/' + id + '/posts');
    assert.equal(JSON.parse(userPostResponse.body).data.length, 1);
});
When(/^request to delete user with email "([^"]*)" is sent$/, async function (email) {
    let getResponse = await got.get(baseUrl + '?email=' + email);
    let id = JSON.parse(getResponse.body).data[0].id;
    let deleteData = {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    };
    apiResponse = await got.delete(baseUrl + '/' + id, deleteData);
    assert.equal(JSON.parse(apiResponse.body).code, 204);
});