module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: 'plusboard',
            script: './server/index.js',
            env: {
                NODE_CONF: 'production',
            },
        },
        {
            name: 'billboard',
            script: './server/index.js',
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
            user: 'node',
            host: '212.83.163.1',
            ref: 'origin/master',
            repo: 'git@github.com:guness/billboard-server.git',
            key: '/root/.ssh/id_rsa.pub',
            path: '/plusboard/production',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js',
            env: {
                NODE_CONF: 'production'
            }
        },
        stage: {
            user: 'node',
            host: '5.189.145.208',
            ref: 'origin/master',
            repo: 'git@github.com:guness/billboard-server.git',
            key: '/root/.ssh/id_rsa.pub',
            path: '/plusboard/development',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js',
            env: {
                NODE_CONF: 'stage'
            }
        }
    }
};

