module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/variables.scss";
          @import "@/util.scss";
        `,
      },
    },
  },
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
      "/ns-api": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
