'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}`);
});