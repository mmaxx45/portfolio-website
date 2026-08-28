export const excuses = [
  "Es hat auf `localhost` funktioniert. Ich schwöre.",
  "Das ist kein Bug, das ist eine undokumentierte Race Condition mit Charakter.",
  "Caddy hat zu schnell geroutet, die Datenbank war emotional noch nicht bereit.",
  "Die Java Virtual Machine hat kurz meditiert (Garbage Collection läuft).",
  "Debian hat den Port nicht freigegeben, weil es 02:30 Uhr ist und der Kernel schlafen will.",
  "Eigentlich lief der Code, aber jemand hat ein Semikolon schief angeguckt.",
  "Der Docker Container hat Heimweh nach dem vorherigen Hetzner-Cluster.",
  "DNS braucht 24 Stunden zum Propagieren. Komm morgen wieder.",
  "Ein verwaister Docker Build Cache hat gerade die SSD gefüllt.",
  "Ich habe den Stack Overflow Post von 2012 exakt so kopiert, keine Ahnung warum es fehlschlägt.",
  "Das liegt an den Sonnenstürmen auf den Bitflips im DDR4-RAM.",
  "Reboot und alles wird gut. Drück einfach den roten Notfall-Button oben.",
  "Der Code läuft eigentlich perfekt – die Realität ist nur noch nicht synchronisiert.",
  "Ein Docker Container hat den gesamten RAM gefressen und schläft jetzt."
];

export const javaPrefixes = [
  'Abstract', 'Default', 'Enterprise', 'Dynamic', 'ThreadSafe', 'Asynchronous', 
  'Reactive', 'Transactional', 'Singleton', 'Distributed', 'Configurable', 'ClusterManager'
];

export const javaMiddles = [
  'BeanFactory', 'ProxyHandler', 'ServiceManager', 'ContextResolver', 
  'DispatcherServlet', 'SecurityInterceptor', 'ConnectionPool', 'EventPublisher', 'BufferManager'
];

export const javaSuffixes = [
  'FactoryBean', 'StrategyProvider', 'AdvisorImpl', 'DelegateHandler', 
  'RegistrySupport', 'ConfigurationHelper', 'ManagerFacade', 'ProtocolListener'
];

export function generateJavaClassName() {
  const p = javaPrefixes[Math.floor(Math.random() * javaPrefixes.length)];
  const m = javaMiddles[Math.floor(Math.random() * javaMiddles.length)];
  const s = javaSuffixes[Math.floor(Math.random() * javaSuffixes.length)];
  return `${p}${m}${s}`;
}
