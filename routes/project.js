/**
 * Created by sergio.rodriguez on 9/30/14.
 */
var express = require( 'express');
var mongoose = require( 'mongoose' );

var Project = mongoose.model( 'Project' );
var router = express.Router();

router.get( '/new', function(res, req) {
    "use strict";

});

router.post( '/new', function(res, req) {
    "use strict";

});

router.get( '/:id', function(res, req) {
    "use strict";

});

router.get( '/edit/:id', function(res, req) {
    "use strict";

});

router.post( '/edit/:id', function(res, req) {
    "use strict";

});

router.get( '/delete/:id', function(res, req) {
    "use strict";

});

router.post( '/delete/:id', function(res, req) {
    "use strict";

});

module.exports = router;