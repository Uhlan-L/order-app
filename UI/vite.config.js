import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // 프로덕션 빌드 최적화
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild', // esbuild 사용 (기본값, 더 빠르고 안정적)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    // 빌드 실패 시 더 자세한 정보 출력
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  }
})

