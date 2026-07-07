module.exports = {
  apps: [
    {
      name: "back-fe",

      script: "npm",
      args: "run qa",

      cwd: "/home/migben/back-fe",

      autorestart: true,
      watch: false,

      env: {
        NODE_ENV: "development"
      },

      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};