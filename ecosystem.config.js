module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: 'plusboard',
            script: '/plusboard/production/server/index.js',
            env: {
                NODE_CONF: 'production',
            },
        },
        {
            name: 'billboard',
            script: '/plusboard/development/server/index.js',
            env: {
                NODE_CONF: 'stage',
            },
        }
    ],
    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        production: {
            user: 'root',
            host: 'localhost',
            ref: 'origin/master',
            repo: 'git@github.com:guness/billboard-server.git',
            path: '/plusboard/production',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js plusboard',
            env: {
                NODE_CONF: 'production'
            }
        },
        stage: {
            user: 'root',
            host: 'localhost',
            ref: 'origin/development',
            repo: 'git@github.com:guness/billboard-server.git',
            path: '/plusboard/development',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js billboard',
            env: {
                NODE_CONF: 'stage'
            }
        }
    }
};

