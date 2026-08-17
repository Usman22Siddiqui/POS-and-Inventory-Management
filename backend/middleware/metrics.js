/**
 * Native Prometheus Metrics Exporter
 * Tracks HTTP request counts, durations, status codes, and active transactions
 * without requiring heavy external dependencies.
 */

const metrics = {
  httpRequestsTotal: {},
  httpRequestDurationSeconds: {
    sum: 0,
    count: 0,
    buckets: { 0.05: 0, 0.1: 0, 0.25: 0, 0.5: 0, 1: 0, 2.5: 0, 5: 0, '+Inf': 0 },
  },
  posTransactionsTotal: 0,
  posRevenueTotal: 0,
};

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds + nanoseconds / 1e9;

    const route = req.route ? req.baseUrl + req.route.path : req.path;
    const method = req.method;
    const statusCode = res.statusCode;

    const key = `method="${method}",route="${route}",status="${statusCode}"`;
    metrics.httpRequestsTotal[key] = (metrics.httpRequestsTotal[key] || 0) + 1;

    metrics.httpRequestDurationSeconds.sum += duration;
    metrics.httpRequestDurationSeconds.count += 1;

    for (const bucket of Object.keys(metrics.httpRequestDurationSeconds.buckets)) {
      if (bucket === '+Inf' || duration <= parseFloat(bucket)) {
        metrics.httpRequestDurationSeconds.buckets[bucket] += 1;
      }
    }
  });

  next();
};

const trackTransaction = (amount) => {
  metrics.posTransactionsTotal += 1;
  metrics.posRevenueTotal += parseFloat(amount) || 0;
};

const getPrometheusMetrics = () => {
  const mem = process.memoryUsage();
  const uptime = process.uptime();

  let output = `# HELP http_requests_total Total number of HTTP requests made.\n# TYPE http_requests_total counter\n`;
  for (const [labels, count] of Object.entries(metrics.httpRequestsTotal)) {
    output += `http_requests_total{${labels}} ${count}\n`;
  }

  output += `\n# HELP http_request_duration_seconds HTTP request latency in seconds.\n# TYPE http_request_duration_seconds histogram\n`;
  for (const [le, count] of Object.entries(metrics.httpRequestDurationSeconds.buckets)) {
    output += `http_request_duration_seconds_bucket{le="${le}"} ${count}\n`;
  }
  output += `http_request_duration_seconds_sum ${metrics.httpRequestDurationSeconds.sum.toFixed(4)}\n`;
  output += `http_request_duration_seconds_count ${metrics.httpRequestDurationSeconds.count}\n`;

  output += `\n# HELP pos_transactions_total Total number of completed POS sales transactions.\n# TYPE pos_transactions_total counter\n`;
  output += `pos_transactions_total ${metrics.posTransactionsTotal}\n`;

  output += `\n# HELP pos_revenue_total_dollars Total gross revenue processed in USD.\n# TYPE pos_revenue_total_dollars counter\n`;
  output += `pos_revenue_total_dollars ${metrics.posRevenueTotal.toFixed(2)}\n`;

  output += `\n# HELP process_resident_memory_bytes Resident memory size in bytes.\n# TYPE process_resident_memory_bytes gauge\n`;
  output += `process_resident_memory_bytes ${mem.rss}\n`;

  output += `\n# HELP process_heap_used_bytes Process heap memory used in bytes.\n# TYPE process_heap_used_bytes gauge\n`;
  output += `process_heap_used_bytes ${mem.heapUsed}\n`;

  output += `\n# HELP process_uptime_seconds Process uptime in seconds.\n# TYPE process_uptime_seconds gauge\n`;
  output += `process_uptime_seconds ${uptime.toFixed(2)}\n`;

  return output;
};

module.exports = {
  metricsMiddleware,
  trackTransaction,
  getPrometheusMetrics,
};
