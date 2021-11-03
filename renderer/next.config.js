module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "web";
    }

    return config;
  },
};
