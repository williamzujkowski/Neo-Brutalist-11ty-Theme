const fs = require('fs');

module.exports = function(eleventyConfig) {
  
  // Add plugins
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  const navigation = require("@11ty/eleventy-navigation");
  
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(navigation);

  // Pass through copy for static assets
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "/robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "/CNAME" }); // For custom domain

  // Watch targets
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  // Collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/*.md")
      .sort((a, b) => b.data.order - a.data.order);
  });

  // Filters
  eleventyConfig.addFilter("dateReadable", date => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  eleventyConfig.addFilter("randomColor", () => {
    const colors = ['var(--electric-blue)', 'var(--hot-pink)', 'var(--acid-green)', 'var(--cyber-yellow)', 'var(--deep-purple)'];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  eleventyConfig.addFilter("limit", (array, limit) => {
    return array.slice(0, limit);
  });

  // Shortcodes
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  
  eleventyConfig.addShortcode("serviceCard", function(icon, title, description) {
    return `
      <div class="service-card">
        <span class="service-icon">${icon}</span>
        <h3 class="service-name">${title}</h3>
        <p class="service-desc">${description}</p>
      </div>
    `;
  });

  eleventyConfig.addPairedShortcode("glitchText", function(content) {
    return `<span class="glitch" data-text="${content}">${content}</span>`;
  });

  // Nunjucks Configuration
  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: false,
    autoescape: false
  });

  // Global data
  eleventyConfig.addGlobalData("generated", () => {
    let now = new Date();
    return now.toISOString();
  });

  // Markdown configuration
  const markdownIt = require("markdown-it");
  const markdownItAttrs = require("markdown-it-attrs");
  
  const markdownOptions = {
    html: true,
    breaks: true,
    linkify: true
  };
  
  const markdownLib = markdownIt(markdownOptions).use(markdownItAttrs);
  eleventyConfig.setLibrary("md", markdownLib);

  // BrowserSync configuration
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');
        
        browserSync.addMiddleware("*", (req, res) => {
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      }
    },
    ui: false,
    ghostMode: false
  });

  // Return configuration
  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],
    
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    
    // GitHub Pages URL structure
    pathPrefix: process.env.PATHPREFIX || "/"
  };
};
