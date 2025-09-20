module.exports = {
  apps: [
    {
      name: 'lwc-next-dev',
      script: 'server.mjs',
      cwd: '/Volumes/Works/github-biennguyen13/lwc-next',
      instances: 2, // 2 instances cho development, 'max' cho production
      exec_mode: 'cluster', // Cluster mode cho load balancing
      
      // Sticky session cho Socket.IO
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
        INSTANCE_ID: 0,
        DEV_CLUSTER: true
      },
      
      // Development mode specific
      env_dev_cluster: {
        NODE_ENV: 'development',
        PORT: 4000,
        INSTANCE_ID: 0,
        DEV_CLUSTER: true
      },
      
      // Production with max instances
      env_production_max: {
        NODE_ENV: 'production',
        PORT: 4000,
        INSTANCE_ID: 0,
        MAX_INSTANCES: true
      },
      // Logging
      log_file: './logs/combined-dev.log',
      out_file: './logs/out-dev.log',
      error_file: './logs/error-dev.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart
      watch: false, // Tắt watch trong production
      max_memory_restart: '4G',
      
      // Development watch mode
      watch_options: {
        usePolling: true,
        interval: 1000
      },
      
      // Health check
      min_uptime: '10s',
      max_restarts: 10,
      
      // Socket.IO specific
      kill_timeout: 5000,
      listen_timeout: 3000
    },
    
    // Production config với max instances
    {
      name: 'lwc-next',
      script: 'server.mjs',
      cwd: '/Volumes/Works/github-biennguyen13/lwc-next',
      // instances: 'max', // Sử dụng tất cả CPU cores
      instances: 2, // 2 instances cho development, 'max' cho production
      exec_mode: 'cluster',
      
      // Sticky session cho Socket.IO
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        INSTANCE_ID: 0
      },
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart
      watch: false,
      max_memory_restart: '1G',
      
      // Health check
      min_uptime: '10s',
      max_restarts: 10,
      
      // Socket.IO specific
      kill_timeout: 5000,
      listen_timeout: 3000
    }
  ]
}
