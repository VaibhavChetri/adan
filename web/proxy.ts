import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 410 Gone for retired doorway content.
 * These were byte-identical, unlinked pages: 29 sector pages sharing one
 * content hash, and 3 unevidenced digital capability pages. A 301 would pass
 * their signal to the target and keep the liability; 410 removes them from the
 * index. vercel.json cannot express this - redirects are 3xx only.
 */
const GONE = new Set<string>([
  "/en-uk/digital/blockchain-advisory.html",
  "/en-uk/digital/internet-of-things-iot.html",
  "/en-uk/digital/products-and-solutions.html",
  "/en-uk/industries/advanced-electronics.html",
  "/en-uk/industries/agriculture.html",
  "/en-uk/industries/asset-wealth-management.html",
  "/en-uk/industries/banking-capital-markets.html",
  "/en-uk/industries/capital-projects-infrastructure.html",
  "/en-uk/industries/chemicals-polymers.html",
  "/en-uk/industries/energy-utilities.html",
  "/en-uk/industries/engineering-construction.html",
  "/en-uk/industries/financial-services.html",
  "/en-uk/industries/government-public-services.html",
  "/en-uk/industries/green-energy.html",
  "/en-uk/industries/healthcare-systems-services.html",
  "/en-uk/industries/hospitality-leisure.html",
  "/en-uk/industries/industrial-manufacturing.html",
  "/en-uk/industries/insurance.html",
  "/en-uk/industries/media-entertainment.html",
  "/en-uk/industries/metals-mining.html",
  "/en-uk/industries/oil-gas.html",
  "/en-uk/industries/pharma-life-sciences.html",
  "/en-uk/industries/private-equity-venture-capital.html",
  "/en-uk/industries/public-sector.html",
  "/en-uk/industries/real-estate.html",
  "/en-uk/industries/retail.html",
  "/en-uk/industries/semiconductors.html",
  "/en-uk/industries/social-sector.html",
  "/en-uk/industries/sovereign-investment-funds.html",
  "/en-uk/industries/technology.html",
  "/en-uk/industries/telecommunications.html",
  "/en-uk/industries/travel-transport-logistics.html"
]);

export function proxy(request: NextRequest) {
  if (GONE.has(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 410, statusText: 'Gone' });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/en-uk/industries/:path*', '/en-uk/digital/:path*'],
};
