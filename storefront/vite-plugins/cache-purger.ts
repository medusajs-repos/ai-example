import { Plugin } from 'vite';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

/**
 * Plugin to purge static server function cache when files change only in development mode
 */
export function cachePurgerPlugin(): Plugin {
  return {
    name: 'cache-purger',
    configureServer(server) {
      const clearStaticServerCache = () => {
        const cacheDir = join(process.cwd(), 'dist', '__tsr', 'staticServerFnCache');
        if (existsSync(cacheDir)) {
          try {
            rmSync(cacheDir, { recursive: true, force: true });
            console.log('Cleared static server function cache');
          } catch (error) {
            console.warn('Failed to clear cache:', error);
          }
        }
      };

      // Watch for changes in data files and route files
      const watchPatterns = [
        'src**/*',
      ];

      watchPatterns.forEach(pattern => {
        server.watcher.add(pattern);
      });

      // Clear cache when watched files change
      server.watcher.on('change', (file) => {
        const shouldClearCache = watchPatterns.some(pattern => {
          const normalizedPattern = pattern.replace('**/*', '');
          return file.includes(normalizedPattern);
        });

        if (shouldClearCache) {
          console.log(`File changed: ${file}`);
          clearStaticServerCache();
        }
      });

      // Clear cache on server start
      clearStaticServerCache();
    }
  };
}
