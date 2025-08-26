/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pindahkan output dan distDir ke sini (level atas)
  output: "export",
  distDir: "out",

  experimental: {
    // Hapus appDir, output, dan distDir dari sini.
    // `appDir: true` sudah tidak perlu lagi karena menjadi standar.
    outputFileTracingRoot: process.cwd(),
  },
}

module.exports = nextConfig