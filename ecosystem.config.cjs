module.exports = {
  apps: [
    {
      name: "globalyouthfoundation",
      script: "./dist/server.cjs",
      cwd: "/home/globalyouthfoundation1/htdocs/globalyouthfoundation.in",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3040
      }
    }
  ]
};
