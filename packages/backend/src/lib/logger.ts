/**
 * Production-ready logger for Vortex Protocol
 * Replaces console.log with structured logging
 */

import { config } from './config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

/**
 * Format log entry as JSON for production, pretty for development
 */
function formatLog(entry: LogEntry): string {
  if (config.isProd) {
    return JSON.stringify(entry);
  }

  const levelColors: Record<LogLevel, string> = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[32m',  // green
    warn: '\x1b[33m',  // yellow
    error: '\x1b[31m', // red
  };

  const reset = '\x1b[0m';
  const color = levelColors[entry.level];
  
  let output = `${color}[${entry.level.toUpperCase()}]${reset} ${entry.timestamp} - ${entry.message}`;
  
  if (entry.data && Object.keys(entry.data).length > 0) {
    output += ` ${JSON.stringify(entry.data)}`;
  }
  
  return output;
}

/**
 * Create a log entry
 */
function createLogEntry(level: LogLevel, message: string, data?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
  };
}

/**
 * Logger instance
 */
export const logger = {
  debug(message: string, data?: Record<string, unknown>): void {
    if (config.isDev) {
      const entry = createLogEntry('debug', message, data);
      console.debug(formatLog(entry));
    }
  },

  info(message: string, data?: Record<string, unknown>): void {
    const entry = createLogEntry('info', message, data);
    console.info(formatLog(entry));
  },

  warn(message: string, data?: Record<string, unknown>): void {
    const entry = createLogEntry('warn', message, data);
    console.warn(formatLog(entry));
  },

  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const errorData = error instanceof Error 
      ? { errorName: error.name, errorMessage: error.message, stack: config.isDev ? error.stack : undefined }
      : { error: String(error) };
    
    const entry = createLogEntry('error', message, { ...errorData, ...data });
    console.error(formatLog(entry));
  },

  /**
   * Log API request (for middleware)
   */
  request(method: string, path: string, status: number, durationMs: number, data?: Record<string, unknown>): void {
    const entry = createLogEntry('info', `${method} ${path}`, {
      status,
      duration: `${durationMs.toFixed(2)}ms`,
      ...data,
    });
    console.info(formatLog(entry));
  },
};

export default logger;

