import { FeedSource, Region, Topic } from './types';

export const regions: { id: Region; label: string; description: string }[] = [
  { id: 'top10', label: '🔥 TOP 10', description: '' },
  {
    id: 'czechia',
    label: 'Česko',
    description: 'Česká politika, ekonomika, bezpečnost a byznys',
  },
  {
    id: 'world',
    label: 'Svět',
    description: 'Globální titulky a největší události dne',
  },
  {
    id: 'usa',
    label: 'USA',
    description: 'Bílý dům, Kongres, soudy, Fed a americká politika',
  },
  {
    id: 'europe',
    label: 'Evropa',
    description: 'EU, NATO, Ukrajina, Německo, Francie a energetika',
  },
  {
    id: 'asia',
    label: 'Asie',
    description: 'Čína, Tchaj-wan, Indie, Japonsko a Korejský poloostrov',
  },
];

export const topics: { id: Topic; label: string }[] = [
  { id: 'top', label: 'Top zprávy' },
  { id: 'politics', label: 'Politika' },
  { id: 'economy', label: 'Ekonomika' },
  { id: 'finance', label: 'Finance / trhy' },
  { id: 'war_security', label: 'Válka / bezpečnost' },
  { id: 'technology', label: 'Technologie / IT' },
  { id: 'marketing_media', label: 'Marketing / média' },
  { id: 'investigations', label: 'Investigativa' },
];

// Feedy jsou záměrně v konfiguraci, aby šly snadno upravovat bez zásahu do UI.
export const feeds: FeedSource[] = [
  {
    name: 'BBC World',
    region: 'world',
    topics: ['top', 'politics', 'war_security'],
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    paywall: 'ne',
  },
  {
    name: 'BBC Business',
    region: 'world',
    topics: ['economy', 'finance'],
    url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    paywall: 'ne',
  },
  {
    name: 'BBC Technology',
    region: 'world',
    topics: ['technology'],
    url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    paywall: 'ne',
  },
  {
    name: 'NYT World',
    region: 'world',
    topics: ['top', 'politics', 'war_security', 'investigations'],
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    paywall: 'pravděpodobně',
  },
  {
    name: 'NYT US',
    region: 'usa',
    topics: ['top', 'politics', 'investigations'],
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
    paywall: 'pravděpodobně',
  },
  {
    name: 'NYT Business',
    region: 'world',
    topics: ['economy', 'finance'],
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    paywall: 'pravděpodobně',
  },
  {
    name: 'Washington Post Politics',
    region: 'usa',
    topics: ['top', 'politics', 'investigations'],
    url: 'https://feeds.washingtonpost.com/rss/politics',
    paywall: 'pravděpodobně',
  },
  {
    name: 'Washington Post World',
    region: 'world',
    topics: ['top', 'politics', 'war_security'],
    url: 'https://feeds.washingtonpost.com/rss/world',
    paywall: 'pravděpodobně',
  },
  {
    name: 'Politico',
    region: 'usa',
    topics: ['top', 'politics'],
    url: 'https://www.politico.com/rss/politicopicks.xml',
    paywall: 'neznámé',
  },
  {
    name: 'iROZHLAS Svět',
    region: 'czechia',
    topics: ['top', 'politics', 'war_security'],
    url: 'https://www.irozhlas.cz/rss/irozhlas/section/svet',
    paywall: 'ne',
  },
  {
    name: 'iROZHLAS Ekonomika',
    region: 'czechia',
    topics: ['economy', 'finance'],
    url: 'https://www.irozhlas.cz/rss/irozhlas/section/ekonomika',
    paywall: 'ne',
  },
  {
    name: 'České noviny',
    region: 'czechia',
    topics: ['top', 'politics', 'economy'],
    url: 'https://www.ceskenoviny.cz/sluzby/rss/zpravy.php',
    paywall: 'ne',
  },

  {
    name: 'ProPublica',
    region: 'world',
    topics: ['investigations'],
    url: 'https://www.propublica.org/feeds/propublica/main',
    paywall: 'ne',
  },

  {
    name: 'Bellingcat',
    region: 'world',
    topics: ['investigations', 'war_security'],
    url: 'https://www.bellingcat.com/feed/',
    paywall: 'ne',
  },

  {
    name: 'Seznam Zprávy',
    region: 'czechia',
    topics: ['top', 'politics', 'economy'],
    url: 'https://www.seznamzpravy.cz/rss',
    paywall: 'ne',
  },

  {
    name: 'Aktuálně.cz',
    region: 'czechia',
    topics: ['top', 'politics', 'economy'],
    url: 'https://www.aktualne.cz/rss/',
    paywall: 'ne',
  },

  {
    name: 'Deník N',
    region: 'czechia',
    topics: ['politics', 'investigations'],
    url: 'https://denikn.cz/feed/',
    paywall: 'ano',
  },

  {
    name: 'HlídacíPes.org',
    region: 'czechia',
    topics: ['investigations', 'politics'],
    url: 'https://hlidacipes.org/feed/',
    paywall: 'ne',
  },

  {
    name: 'Lupa.cz',
    region: 'czechia',
    topics: ['technology', 'marketing_media'],
    url: 'https://www.lupa.cz/rss/clanky/',
    paywall: 'ne',
  },

  {
    name: 'Root.cz',
    region: 'czechia',
    topics: ['technology'],
    url: 'https://www.root.cz/rss/clanky/',
    paywall: 'ne',
  },

  {
    name: 'Politico Europe',
    region: 'europe',
    topics: ['top', 'politics', 'war_security'],
    url: 'https://www.politico.eu/feed/',
    paywall: 'ne',
  },

  {
    name: 'Euronews Europe',
    region: 'europe',
    topics: ['top', 'politics', 'economy', 'war_security'],
    url: 'https://www.euronews.com/rss?level=theme&name=news',
    paywall: 'ne',
  },

  {
    name: 'EUobserver',
    region: 'europe',
    topics: ['politics', 'economy'],
    url: 'https://euobserver.com/rss.xml',
    paywall: 'pravděpodobně',
  },

  {
    name: 'Nikkei Asia',
    region: 'asia',
    topics: ['top', 'economy', 'finance', 'technology'],
    url: 'https://asia.nikkei.com/rss/feed/nar',
    paywall: 'pravděpodobně',
  },

  {
    name: 'The Japan Times',
    region: 'asia',
    topics: ['top', 'politics', 'economy'],
    url: 'https://www.japantimes.co.jp/feed/',
    paywall: 'pravděpodobně',
  },

  {
    name: 'SCMP Asia',
    region: 'asia',
    topics: ['top', 'politics', 'economy', 'war_security'],
    url: 'https://www.scmp.com/rss/91/feed',
    paywall: 'pravděpodobně',
  },

  {
    name: 'NPR Politics',
    region: 'usa',
    topics: ['top', 'politics'],
    url: 'https://feeds.npr.org/1014/rss.xml',
    paywall: 'ne',
  },

  {
    name: 'AP News US',
    region: 'usa',
    topics: ['top', 'politics'],
    url: 'https://apnews.com/hub/us-news?output=rss',
    paywall: 'ne',
  },

  {
    name: 'CNN Politics',
    region: 'usa',
    topics: ['top', 'politics'],
    url: 'http://rss.cnn.com/rss/cnn_allpolitics.rss',
    paywall: 'ne',
  },

  {
    name: 'Deutsche Welle Europe',

    region: 'europe',

    topics: ['top', 'politics', 'economy', 'war_security'],

    url: 'https://rss.dw.com/xml/rss-en-eu',

    paywall: 'ne',
  },

  {
    name: 'France 24 Europe',

    region: 'europe',

    topics: ['top', 'politics', 'war_security'],

    url: 'https://www.france24.com/en/europe/rss',

    paywall: 'ne',
  },

  {
    name: 'The Guardian Europe',

    region: 'europe',

    topics: ['top', 'politics', 'war_security'],

    url: 'https://www.theguardian.com/world/europe-news/rss',

    paywall: 'ne',
  },

  {
    name: 'RFE/RL Europe',

    region: 'europe',

    topics: ['top', 'politics', 'war_security', 'investigations'],

    url: 'https://www.rferl.org/api/zrqiteuuir',

    paywall: 'ne',
  },
];
