AWS Data Lake SDK
=================

This project provides an SDK for the Data Lake Solution provided by the AWS Solutions Builder group. An introduction to their solution is available [here](https://aws.amazon.com/answers/big-data/data-lake-solution/ "AWS Data Lake introduction"). Detailed documentation for their solution is available [here](http://docs.awssolutionsbuilder.com/data-lake/ "AWS Data Lake documentation").

This SDK follows the pattern of commands provided in the [Data Lake CLI] (http://docs.awssolutionsbuilder.com/data-lake/cli/cli-getting-started/ "AWS Data Lake CLI") in order to make it easy to transition between the two tools when interacting with a data lake.

## Usage

### Install

```
$ npm install --save aws-data-lake-sdk
```

### Require
``` javascript
const Datalake = require('aws-data-lake-sdk');
```

### Configure an API object
``` javascript
// The config to create a Datalake object requires the following properties
// An API Access Key can be created in the Administration->Users section
// An API Secret Access Key can be created in the My Account->Profile section
// The Data Lake API Endpoint URL can be found in the My Account->Profile section
const datalakeConfig = {
  accessKey: 'my-access-key',
  secretAccessKey: 'my-secret-access-key',
  apiEndpointHost: 'my-api-endpoint'
};

const package = new Datalake.Package(datalakeConfig);
const metadata = new Datalake.Metadata(datalakeConfig);
const cart = new Datalake.Cart(datalakeConfig);
```

**Use case 1: Search the data lake** Search the data lake for packages based on a keyword search of the package name, description, and metadata tags.
``` javascript
const package = new Datalake.Package(datalakeConfig);

package.search({
  terms: 'weather atlanta'
}).then(searchResults => {
  console.log('Search results: ');
  console.log(JSON.stringify(searchResults));

  // {
  //   Items: [{
  //     updated_at: "2017-08-04T12:45:00Z",
  //     package_id: "abcd123ty",
  //     created_at: "2017-08-04T12:45:00Z",
  //     deleted: false,
  //     owner: "datalake_owner",
  //     description: "Weather in Atlanta. Collected 2017-08-04T12:45:00Z.",
  //     name: "Weather in Atlanta",
  //     metadata: [
  //       { value: "weather", tag: "data" },
  //       { value: "atlanta", tag: "location" }]
  //   },
  //   {
  //     updated_at: "2017-08-04T12:46:00Z",
  //     package_id: "abcd456ur",
  //     deleted: false,
  //     created_at: "2017-08-04T12:46:00Z",
  //     owner: "datalake_owner",
  //     description: "Weather in Atlanta. Collected 2017-08-04T12:46:00Z",
  //     name: "Weather in Atlanta",
  //     metadata: [
  //       { value: "weather", tag: "data" },
  //       { value: "atlanta", tag: "location" }]
  //   }]
  // }
});
```

**Use case 2: Create a Package** Create a package in the data lake. A package must be created before adding data files to the data lake.
``` javascript
// The config to create a Datalake object requires the following properties
// An API Access Key can be created in the Administration->Users section
// An API Secret Access Key can be created in the My Account->Profile section
// The Data Lake API Endpoint URL can be found in the My Account->Profile section
const datalakeConfig = {
  accessKey: 'my-access-key',
  secretAccessKey: 'my-secret-access-key',
  apiEndpointHost: 'my-api-endpoint'
};

const package = new Datalake.Package(datalakeConfig);

// Create a package
package.createPackage({
  packageName: 'Sample Package',
  packageDescription: 'Sample package created using package.createPackage(...)',
  metadata: [
    { tag: 'first-tag', value: 'first-value' }
  ]
}).then(response => {
  console.log(response);

  // {
  //   package_id: "abcd098ty",
  //   created_at: "2017-08-07T18:30:00Z",
  //   updated_at: "2017-08-07T18:30:00Z",
  //   owner: "datalake_admin",
  //   name: "Sample Package",
  //   description: "Sample package created using package.createPackage(...)",
  //   deleted: false
  // }
});
```

**Use case 3: Add a file to a Package** Create a dataset containing a data file inside a package in the data lake. A package can contain 0 or more datasets, with each dataset containing a single file.
``` javascript
const fs = require('fs');
const package = new Datalake.Package(datalakeConfig);
var fileName = 'new-data-file.zip';

var stats = fs.lstatSync(fileName);
var readableStreamFromFileSystem = fs.createReadStream(fileName);

package.uploadPackageDataset({
  packageId: 'abcd098ty',
  fileName: fileName,
  fileSize: stats.size,
  fileStream: readableStreamFromFileSystem,
  contentType: 'application/zip'
}).then(data => {
  console.log('New dataset information: ');
  console.log(JSON.stringify(data));

  // {
  //   Items: [{
  //     updated_at: "2017-08-07T18:30:00Z",
  //     package_id: "abcd098ty",
  //     created_at: "2017-08-07T18:30:00Z",
  //     s3_bucket: "data-lake-us-east-1-012345678901",
  //     content_type: "application/zip",
  //     created_by: "datalake_admin",
  //     dataset_id: "ABC123xyz",
  //     owner: "datalake_admin",
  //     name: "new-data-file.zip",
  //     s3_key: "ABC123xyz/1504794600000/new-data-file.zip",
  //     type: "dataset"
  //   }],
  //   Count: 1,
  //   ScannedCount: 1
  // }
});
```

**Use case 4: Describe a Package** Get the descriptive information about a specific package in the data lake.
``` javascript
const package = new Datalake.Package(datalakeConfig);

package.describePackage({
  packageId: 'abcd098ty'
}).then(response => {
  console.log('Description results: ');
  console.log(JSON.stringify(response));

  // {
  //   Item: {
  //     updated_at: "2017-08-03T15:30:00Z",
  //     package_id: "abcd098ty",
  //     deleted: false,
  //     created_at: "2017-08-03T15:30:00Z",
  //     owner: "datalake_owner",
  //     description: "Sample package created by unit test",
  //     name: "Sample package"
  //   }
  // }
});
```

**Use case 5: Update a Package** Update the information describing a package in the data lake.
``` javascript
const package = new Datalake.Package(datalakeConfig);

package.updatePackage({
  packageId: 'abcd098ty',
  packageName: 'Sample package v2',
  packageDescription: 'A new description for the sample package.'
}).then(response => {
  console.log('Update results: ');
  console.log(JSON.stringify(response));

  // {
  //   Item: {
  //     updated_at: "2017-08-03T15:35:00Z",
  //     package_id: "abcd098ty",
  //     deleted: false,
  //     created_at: "2017-08-03T15:30:00Z",
  //     owner: "datalake_owner",
  //     description: "A new description for the sample package.",
  //     name: "Sample package v2"
  //   }
  // }
});
```

**Use case 6: Delete a Package** Delete a package in the data lake based on the packageId.
``` javascript
const package = new Datalake.Package(datalakeConfig);

package.deletePackage({
  packageId: 'abcd098ty'
}).then(deleteResponse => {
  console.log('Delete results: ');
  console.log(JSON.stringify(deleteResponse));

  // { }
});
```

**Use case 7: Get a list of all Datasets in a Package**
``` javascript
const package = new Datalake.Package(datalakeConfig);

package.describePackageDatasets({
  packageId: 'abcd098ty'
}).then(response => {
  console.log('Describe datasets results: ');
  console.log(JSON.stringify(response));

  // {
  //   Items: [{
  //     updated_at: "2017-08-07T18:30:00Z",
  //     package_id: "abcd098ty",
  //     created_at: "2017-08-07T18:30:00Z",
  //     s3_bucket: "data-lake-us-east-1-012345678901",
  //     content_type: "application/zip",
  //     created_by: "datalake_admin",
  //     dataset_id: "ABC123xyz",
  //     owner: "datalake_admin",
  //     name: "new-data-file.zip",
  //     s3_key: "ABC123xyz/1504794600000/new-data-file.zip",
  //     type: "dataset"
  //   }, {
  //     updated_at: "2017-08-07T18:35:00Z",
  //     package_id: "abcd098tu",
  //     created_at: "2017-08-07T18:35:00Z",
  //     s3_bucket: "data-lake-us-east-1-012345678901",
  //     content_type: "application/zip",
  //     created_by: "datalake_admin",
  //     dataset_id: "ABC123xyz",
  //     owner: "datalake_admin",
  //     name: "other-data-file.zip",
  //     s3_key: "ABC123wyz/1504794700000/other-data-file.zip",
  //     type: "dataset"
  //   }],
  //   Count: 2,
  //   ScannedCount: 2
  // }
});
```

**Use case 8: Describe a Dataset in a Package**
``` javascript
const package = new Datalake.Package(datalakeConfig);

package.describePackageDataset({
  packageId: 'abcd098ty',
  datasetId: 'ABC123xyz'
}).then(response => {
  console.log('Describe dataset results: ');
  console.log(JSON.stringify(response));

  // {
  //   Items: [{
  //     updated_at: "2017-08-07T18:30:00Z",
  //     package_id: "abcd098ty",
  //     created_at: "2017-08-07T18:30:00Z",
  //     s3_bucket: "data-lake-us-east-1-012345678901",
  //     content_type: "application/zip",
  //     created_by: "datalake_admin",
  //     dataset_id: "ABC123xyz",
  //     owner: "datalake_admin",
  //     name: "new-data-file.zip",
  //     s3_key: "ABC123xyz/1504794600000/new-data-file.zip",
  //     type: "dataset"
  //   }],
  //   Count: 1,
  //   ScannedCount: 1
  // }
});
```

**Use case 9: Delete a Dataset** Delete a dataset and the file contained inside of it from a package and the data lake.
``` javascript
const package = new Datalake.Package(datalakeConfig);

package.deletePackageDataset({
  packageId: 'abcd098ty',
  datasetId: 'xyz098qwe'
}).then(deleteResponse => {
  console.log('Delete results: ');
  console.log(JSON.stringify(deleteResponse));

  // { }
});
```

**Use case 10: Get a list of all required Metadata fields** Get a list of all tags set up on the Governance tab of the Administration->Settings page of the data lake.
``` javascript
const metadata = new Datalake.Metadata(datalakeConfig);

metadata.describeRequiredMetadata().then(response => {
  console.log('Required metadata: ');
  console.log(JSON.stringify(response));

  // {
  //   Items: [{
  //     updated_at: "2017-08-03T15:19:00Z",
  //     created_at: "2017-08-03T15:19:00Z",
  //     setting_id: "lkjh234so",
  //     type: "governance",
  //     setting: {
  //       tag: "first-tag",
  //       governance: "Required"
  //     }
  //   }, {
  //     updated_at: "2017-08-03T15:20:00Z",
  //     created_at: "2017-08-03T15:20:00Z",
  //     setting_id: "qwe678mnb",
  //     type: "governance",
  //     setting: {
  //       tag: "second-tag",
  //       governance: "Optional"
  //     }
  //   }]
  // }
});
```

**Use case 11: Get metadata tags on a Package** Get a list of metadata tags applied to a Package.
``` javascript
const metadata = new Datalake.Metadata(datalakeConfig);

// Get metadata for a package
var currentMetadata = null;
metadata.describeMetadata({ packageId: 'ABC123xyz' }).then(data => {
  console.log('Current metadata is: ');
  console.log(JSON.stringify(data));

  // {
  //   package_id: "ABC123xyz",
  //   metadata_id: "DEF456rst",
  //   created_at: "2017-08-07T18:30:00Z",
  //   created_by: "datalake_admin",
  //   metadata: [{
  //     tag: "format",
  //     value: "zip"
  //   }]
  // }
});
```

**Use case 12: Create metadata tags on a Package** Add metadata tags to a Package in the data lake. To update metadata tags, first retrieve the current tags, update/delete/add to the tags array and then use createMetadata(...) to update the metadata tags associated with the Package.
``` javascript
const metadata = new Datalake.Metadata(datalakeConfig);

// Get metadata for a package
var newTags = [];
newTags.push({ tag: 'a-new-tag', value: 'new-value' });
metadata.createMetadata({ 
    packageId: 'abcd098ty',
    metadata: newTags
}).then(response => {
  console.log('Current metadata is: ');
  console.log(JSON.stringify(response));

  // {
  //   package_id: "abcd098ty",
  //   metadata_id: "DEF456rsu",
  //   created_at: "2017-08-07T18:30:00Z",
  //   created_by: "datalake_admin",
  //   metadata: [{
  //     tag: "a-new-tag",
  //     value: "new-value"
  //   }]
  // }
});
```

## AWS Data Lake Solution

You can find a guide the AWS Data Lake solution released by the AWS Solutions Builder group at:

[http://docs.awssolutionsbuilder.com/data-lake/](http://docs.awssolutionsbuilder.com/data-lake/ "AWS Data Lake documentation")

## Implemented Actions

### Package
* Search
* Create
* Describe
* Update
* Delete
* Dataset Upload
* Dataset Delete
* Dataset Describe
* Datasets Describe

### Metadata
* Describe Required Metadata
* Create Metadata
* Describe Metadata

### Cart (Incomplete)
* Describe Cart
* Add Item
* Describe Item
* Remove Item
* Checkout
