AWS Data Lake SDK
=================

This project provides an SDK for the Data Lake Solution provided by the AWS Solutions Builder group. An introduction to their solution is available [here](https://aws.amazon.com/answers/big-data/data-lake-solution/ "AWS Data Lake introduction"). Detailed documentation for their solution is available [here](http://docs.awssolutionsbuilder.com/data-lake/ "AWS Data Lake documentation").

## Install

```
$ npm install --save aws-data-lake-sdk
```

## Usage

### Require
```
const Datalake = require('aws-data-lake-sdk');
```

### Create a Package
```
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
  //   package_id: "ABC123xyz",
  //   created_at: "2017-08-07T18:30:00Z",
  //   updated_at: "2017-08-07T18:30:00Z",
  //   owner: "datalake_admin",
  //   name: "Sample Package",
  //   description: "Sample package created using package.createPackage(...)",
  //   deleted: false
  // }
});
```

### Add a file to a Package
```
const fs = require('fs');
const package = new Datalake.Package(datalakeConfig);
var fileName = 'new-data-file.zip';

var stats = fs.lstatSync(fileName);
var readableStreamFromFileSystem = fs.createReadStream(fileName);

package.uploadPackageDataset({
  packageId: 'ABC123xyz',
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
  //     package_id: "MNO876fgh",
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

### Get & Update Metadata 
```
const metadata = new Datalake.Metadata(daalakeConfig);

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

  // add another tag to metadata
  return metadata.createMetadata({ 
    packageId: 'ABC123xyz',
    metadata: data.push({ tag: 'a-new-tag', value: 'new-value' })
  });
}).then(response => {
  console.log('Current metadata is: ');
  console.log(JSON.stringify(response));

  // {
  //   package_id: "ABC123xyz",
  //   metadata_id: "DEF456rsu",
  //   created_at: "2017-08-07T18:30:00Z",
  //   created_by: "datalake_admin",
  //   metadata: [{
  //     tag: "next-tag",
  //     value: "next-value"
  //   }, {
  //     tag: "format",
  //     value: "zip"
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