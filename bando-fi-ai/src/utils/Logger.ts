interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  metadata?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep only the last 1000 logs

  constructor() {
    // Load any previous logs from localStorage if available
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const storedLogs = localStorage.getItem('bandoFiLogs');
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        this.logs = parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (e) {
      console.warn('Failed to load logs from localStorage:', e);
    }
  }

  private saveLogs() {
    try {
      // Keep only the last maxLogs entries
      const logsToSave = this.logs.slice(-this.maxLogs);
      localStorage.setItem('bandoFiLogs', JSON.stringify(logsToSave));
    } catch (e) {
      console.warn('Failed to save logs to localStorage:', e);
    }
  }

  info(message: string, metadata?: any) {
    this.addLog('info', message, metadata);
  }

  warn(message: string, metadata?: any) {
    this.addLog('warn', message, metadata);
  }

  error(message: string, metadata?: any) {
    this.addLog('error', message, metadata);
  }

  debug(message: string, metadata?: any) {
    this.addLog('debug', message, metadata);
  }

  private addLog(level: 'info' | 'warn' | 'error' | 'debug', message: string, metadata?: any) {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      metadata
    };

    this.logs.push(logEntry);

    // Output to console as well
    switch (level) {
      case 'info':
        console.info(`[INFO] ${message}`, metadata);
        break;
      case 'warn':
        console.warn(`[WARN] ${message}`, metadata);
        break;
      case 'error':
        console.error(`[ERROR] ${message}`, metadata);
        break;
      case 'debug':
        console.debug(`[DEBUG] ${message}`, metadata);
        break;
    }

    this.saveLogs();
  }

  getLogs(): LogEntry[] {
    return [...this.logs]; // Return a copy
  }

  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('bandoFiLogs');
    } catch (e) {
      console.warn('Failed to clear logs from localStorage:', e);
    }
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

const logger = new Logger();
export default logger;