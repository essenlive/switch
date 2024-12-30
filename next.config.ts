import type { NextConfig } from 'next'
import { getDailyString } from "@/lib/utils";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/julie',
        destination: '/g?c=11111311142241124343244112441431123141311413221112441431134421111244143111141111&cs=8x10',
        permanent: true,
      },
      {
        source: '/daily',
        destination: `/g?s=${getDailyString()}&cs=6x8`,
        permanent: true,
      },
    ]
  },
}

export default nextConfig