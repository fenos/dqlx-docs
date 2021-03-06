/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'dqlx',
  tagline: 'A Query Builder for Dgraph',
  url: 'https://fenos.github.io',
  baseUrl: '/dqlx/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'fenos', // Usually your GitHub org/user name.
  projectName: 'dqlx', // Usually your repo name.
  themeConfig: {
    gtag: {
      trackingID: 'G-YSCRBK5HRD',
      // Optional fields.
      anonymizeIP: true, // Should IPs be anonymized?
    },
    navbar: {
      title: 'dqlx',
      // logo: {
      //   alt: 'My Site Logo',
      //   src: 'img/logo.svg',
      // },
      items: [
        {
          type: 'doc',
          docId: 'getting-started/intro',
          position: 'left',
          label: 'Docs',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/fenos/dqlx',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/docs/getting-started/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/fenos/dqlx',
            },
            {
              label: 'DGraph Community',
              href: 'https://discuss.dgraph.io/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            {
              label: 'GitHub',
              href: 'https://github.com/fenos/dqlx',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} fenos/dqlx`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/fenos/dqlx-docs/edit/master',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/fenos/dqlx-docs/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
