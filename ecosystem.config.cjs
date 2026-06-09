// PM2 process configuration for the CO/ACTION AI Hub API.
// A single fork-mode Node process running the bundled ESM server, with logs
// written under ./logs.
module.exports = {
  apps: [
    {
      name: "coaction-labs-hub",
      script: "server/dist/server.mjs",
      cwd: "D:\\LabsHub",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      // Load runtime vars from D:\LabsHub\.env (cwd) via Node's built-in flag.
      node_args: "--enable-source-maps --env-file=.env",
      env: {
        NODE_ENV: "production",
        // Trust the AWS RDS root CA so Aurora TLS verifies (rejectUnauthorized).
        NODE_EXTRA_CA_CERTS: "D:\\LabsHub\\certs\\rds-global-bundle.pem",
      },
      out_file: "logs/coaction-labs-hub-out.log",
      error_file: "logs/coaction-labs-hub-error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
