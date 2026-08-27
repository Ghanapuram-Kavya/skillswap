// ============================================================================
// SkillSwap - CognoDB / Neo4j Graph Database Driver Configuration
// ============================================================================

const neo4j = require('neo4j-driver');
require('dotenv').config();

let driver = null;
let isConnected = false;
let connectionError = null;

const uri = process.env.COGNODB_URI || process.env.NEO4J_URI || 'bolt://localhost:7687';
const username = process.env.COGNODB_USERNAME || process.env.NEO4J_USERNAME || 'cognodb';
const password = process.env.COGNODB_PASSWORD || process.env.NEO4J_PASSWORD || '';

function initDriver() {
  if (driver) return driver;

  if (!password && !process.env.COGNODB_URI) {
    console.log('ℹ️  No live COGNODB_URI / COGNODB_PASSWORD configured in .env. Active mode: High-Fidelity In-Memory Graph Engine.');
    return null;
  }

  try {
    driver = neo4j.driver(
      uri,
      neo4j.auth.basic(username, password),
      {
        maxConnectionLifetime: 3 * 60 * 60 * 1000,
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 5000,
        disableLosslessIntegers: true
      }
    );
    return driver;
  } catch (err) {
    connectionError = err.message;
    console.warn('⚠️  Failed to create Neo4j driver instance:', err.message);
    return null;
  }
}

async function verifyConnection() {
  const d = initDriver();
  if (!d) {
    isConnected = false;
    return { connected: false, mode: 'IN_MEMORY_FALLBACK', error: 'No live CognoDB credentials configured' };
  }

  try {
    const serverInfo = await d.getServerInfo();
    isConnected = true;
    connectionError = null;
    console.log(`✅ Connected to CognoDB Cloud Database (${serverInfo.agent || serverInfo.address})`);
    return { connected: true, mode: 'COGNODB_CLOUD', agent: serverInfo.agent, address: serverInfo.address };
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    console.warn(`⚠️  CognoDB Connection Failed: ${err.message}. Active fallback: In-Memory Graph Engine.`);
    return { connected: false, mode: 'IN_MEMORY_FALLBACK', error: err.message };
  }
}

function getSession(mode = neo4j.session.READ) {
  const d = initDriver();
  if (!d) return null;
  return d.session({ defaultAccessMode: mode });
}

function closeDriver() {
  if (driver) {
    return driver.close();
  }
  return Promise.resolve();
}

module.exports = {
  initDriver,
  verifyConnection,
  getSession,
  closeDriver,
  getIsConnected: () => isConnected,
  getConnectionError: () => connectionError,
  getConfig: () => ({
    uri: uri ? uri.replace(/\/\/[^@]*@/, '//***@') : null,
    username,
    hasPassword: Boolean(password)
  })
};
