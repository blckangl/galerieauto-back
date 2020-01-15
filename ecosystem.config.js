module.exports = {
  apps : [{
    name: 'galerieapicraken',
    script: 'dist/index.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      SERVER_PORT:8080,
      OVERNIGHT_JWT_SECRET:"mYSecretKeyElite",
      OVERNIGHT_JWT_EXP:"10h"

    },
    env_production: {
      NODE_ENV: 'production',
      SERVER_PORT:8080,
      OVERNIGHT_JWT_SECRET:"mYSecretKeyElite",
      OVERNIGHT_JWT_EXP:"10h"
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
