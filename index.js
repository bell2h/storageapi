const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('storageapi.sr-cloud.com');
});

app.get('/endpoints', (req, res) => {
  var ENDPOINTS = {
    sel: {
        region: "seoul",
        description: "Seoul Region",
        console: "https://storage.sel.sr-cloud.com",
        s3: "https://s3.sel.sr-cloud.com"
      },
    sel_t1: {
        region: "seoul-t1",
        description: "Seoul-T1 Region",
        console: "https://storage.sel-t1.sr-cloud.com",
        s3: "https://s3.sel-t1.sr-cloud.com"
      },
    swn: {
        region: "suwon",
        description: "Suwon Region",
        console: "https://storage.swn.sr-cloud.com",
        s3: "https://s3.swn.sr-cloud.com"
    },
    NO_REGION: "no region",
    NO_SERVICE: "no service"
  };

  var region = req.query.region;
  var service = req.query.service;
  var urn = req.query.urn;
  var SEOUL = ["sel", "seoul", "Seoul", "SEOUL"];
  var SEOUL_T1 = ["sel-t1", "seoul-t1", "Seoul-T1", "SEOUL-T1"];
  console.log(region + ":" + service);

  var response;
  var code = 200;
  if (urn) {
      // urn:sel:storage:bucket:{bucketname}
      console.log(urn);
      var urnArray = urn.split(":");
      if (urnArray.length > 4) {
          var region = urnArray[1];
          var service = urnArray[2];
          var resource = urnArray[3];
          var bucketname = urnArray[4];
          if (service != "storage" || resource != "bucket") {
              response = {
                  error: "invalid urn error"
              };
              code = 400;
          } else {
            if (region == SEOUL[0]) {
                response = {
                    console: (ENDPOINTS.sel.console + "/bucketdetail/" + bucketname),
                    s3: (ENDPOINTS.sel.s3 + "/" + bucketname)
                };
            } else if (region == SEOUL_T1[0]) {
                response = {
                    console: (ENDPOINTS.sel_t1.console + "/bucketdetail/" + bucketname),
                    s3: (ENDPOINTS.sel_t1.s3 + "/" + bucketname)
                };
            } else {
                response = {
                    error: ENDPOINTS.NO_REGION
                };
                code = 404;
            }
          }
      } else {
          response = {
              error: "urn format error"
          };
          code = 400;
      } 
  } else if (region) {
      if (SEOUL.indexOf(region) != -1)  {
          if (service) {
              if (service == 'console') {
                  response = {
                      console: ENDPOINTS.sel.console
                  };
              } else if (service == 's3') {
                  response = {
                      s3: ENDPOINTS.sel.s3
                  };
              } else {
                  response = {
                      error: ENDPOINTS.NO_SERVICE
                  };
                  code = 404;
              }
          } else {
              response = ENDPOINTS.sel;
          }
      } else if (SEOUL_T1.indexOf(region) != -1)  {
          if (service) {
              if (service == 'console') {
                  response = {
                      console: ENDPOINTS.sel_t1.console
                  };
              } else if (service == 's3') {
                  response = {
                      s3: ENDPOINTS.sel_t1.s3
                  };
              } else {
                  response = {
                      error: ENDPOINTS.NO_SERVICE
                  };
                  code = 404;
              }
          } else {
              response = ENDPOINTS.sel_t1;
          }
      } else {
          response = {
              error: ENDPOINTS.NO_REGION
          };
          code = 404;
      }
        
  } else {
      response = {
          endpoints: [
              ENDPOINTS.sel
          ]
      };
  }
  res.status(code).json(response);
});

app.listen(3000, () => {
  console.log('StorageAPI listening on port 3000');
});
