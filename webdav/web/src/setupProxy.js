const { createProxyMiddleware } = require('http-proxy-middleware');
// const cors = require('cors');

module.exports = function(app) {
  app.use('/api',createProxyMiddleware({target: 'http://localhost:8888', changeOrigin: true,}));
  app.use('/webdav',createProxyMiddleware({target: 'http://localhost:8888', changeOrigin: true,}));
};