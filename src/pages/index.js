import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

import Graph1 from './../../static/img/graph-icon-1.svg';
import Graph2 from './../../static/img/graph-icon-2.svg';
import Graph3 from './../../static/img/graph-icon-3.svg';
import Graph4 from './../../static/img/graph-icon-4.svg';
import Graph5 from './../../static/img/graph-icon-5.svg';
import Graph6 from './../../static/img/graph-icon-6.svg';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <div className={clsx('hero', styles.heroBanner)}>

      <Graph1 className={clsx(styles.graph, styles.graph1)} />
      <Graph2 className={clsx(styles.graph, styles.graph2)} />
      <Graph3 className={clsx(styles.graph, styles.graph3)} />
      <Graph4 className={clsx(styles.graph, styles.graph4)} />
      <Graph5 className={clsx(styles.graph, styles.graph5)} />
      <Graph6 className={clsx(styles.graph, styles.graph6)} />

      <div className={clsx("container", styles.content)}>

        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/intro">
            Get Started
          </Link>
        </div>
        <div className={styles.githubLogo}>
          <a href={"https://github.com/fenos/dqlx"}>
            <img src={require('../../static/img/github-icon.png').default} />
          </a>
          {/*<iframe src="https://ghbtns.com/github-btn.html?user=fenos&repo=dqlx&type=star&count=true&size=large"*/}
          {/*        frameBorder="0" scrolling="0" width="170" height="30" title="GitHub">*/}
          {/*</iframe>*/}
        </div>

          <img src={require('../../static/img/gopher_head.png').default} className={styles.gopher}/>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A Query Builder for Dgraph"
    >
      <HomepageHeader />
    </Layout>
  );
}
