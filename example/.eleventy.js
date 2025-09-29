// Example site configuration extending the Neo-Brutalist theme
const themeConfig = require('neo-brutalist-11ty-theme/.eleventy.js');

module.exports = function (eleventyConfig) {
  // Apply the theme configuration
  themeConfig(eleventyConfig);

  // Override input/output directories for example
  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '../src/_includes',
      data: '../src/_data'
    }
  };
};
