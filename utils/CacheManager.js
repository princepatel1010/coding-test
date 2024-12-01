const Redis = require("ioredis");
const config = require("../config/config");
const { DEFAULT_CACHE_EXPIRY } = require("../constants");

class CacheManager {
  /**
   * Create a new CacheManager instance
   * @param {Object} options - Configuration options for Redis and caching
   */
  constructor(options = {}) {
    const defaultConfig = {
      ...config.redisConfig,
      keyPrefix: "app:",
      defaultTTL: DEFAULT_CACHE_EXPIRY,
    };

    this.config = { ...defaultConfig, ...options };

    this.redis = new Redis({
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      keyPrefix: this.config.keyPrefix,
    });

    this._setupEventListeners();
  }

  /**
   * Set up Redis client event listeners
   * @private
   */
  _setupEventListeners() {
    this.redis.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    this.redis.on("connect", () => {
      console.log("Connected to Redis successfully");
    });
  }

  /**
   * Generate a standardized cache key
   * @param {string} namespace - Namespace for the cache key
   * @param {string} key - Specific key identifier
   * @returns {string} Formatted cache key
   */
  _generateKey(namespace, key) {
    return `${namespace}:${key}`;
  }

  /**
   * Cache a value with optional expiration
   * @param {string} namespace - Cache namespace
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} [ttl] - Time to live in seconds
   * @returns {Promise<void>}
   */
  async set(namespace, key, value, ttl) {
    const fullKey = this._generateKey(namespace, key);
    const expiration = ttl || this.config.defaultTTL;

    try {
      // Serialize complex objects
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(fullKey, expiration, serializedValue);
    } catch (error) {
      console.error(`Cache set error for key ${fullKey}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve a cached value
   * @param {string} namespace - Cache namespace
   * @param {string} key - Cache key
   * @returns {Promise<*|null>} Cached value or null
   */
  async get(namespace, key) {
    const fullKey = this._generateKey(namespace, key);

    try {
      const cachedValue = await this.redis.get(fullKey);
      return cachedValue ? JSON.parse(cachedValue) : null;
    } catch (error) {
      console.error(`Cache get error for key ${fullKey}:`, error);
      return null;
    }
  }

  /**
   * Delete a cached value
   * @param {string} namespace - Cache namespace
   * @param {string} key - Cache key
   * @returns {Promise<number>} Number of keys deleted
   */
  async delete(namespace, key) {
    const fullKey = this._generateKey(namespace, key);

    try {
      return await this.redis.del(fullKey);
    } catch (error) {
      console.error(`Cache delete error for key ${fullKey}:`, error);
      throw error;
    }
  }

  /**
   * Clear all cache entries for a specific namespace
   * @param {string} namespace - Cache namespace to clear
   * @returns {Promise<void>}
   */
  async clearNamespace(namespace) {
    try {
      const keys = await this.redis.keys(
        `${this.config.keyPrefix}${namespace}:*`
      );
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error(`Error clearing namespace ${namespace}:`, error);
      throw error;
    }
  }

  /**
   * Cached function executor with memoization
   * @param {string} namespace - Cache namespace
   * @param {string} key - Cache key
   * @param {Function} fn - Function to execute and cache
   * @param {number} [ttl] - Time to live in seconds
   * @returns {Promise<*>} Function result
   */
  async memoize(namespace, key, fn, ttl) {
    const cachedResult = await this.get(namespace, key);
    if (cachedResult !== null) {
      return cachedResult;
    }

    try {
      const result = await fn();
      await this.set(namespace, key, result, ttl);
      return result;
    } catch (error) {
      console.error(`Memoization error for ${namespace}:${key}:`, error);
      throw error;
    }
  }

  /**
   * Close the Redis connection
   * @returns {Promise<void>}
   */
  async close() {
    await this.redis.quit();
  }
}

module.exports = new CacheManager();
