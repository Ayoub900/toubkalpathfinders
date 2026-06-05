import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site-data";

export default function SiteFooter() {
  return (
    <footer className="footer" data-screen-label="Footer">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <Image
              src="/logo.png"
              alt="Toubkal Pathfinders"
              className="logo"
              width={932}
              height={356}
              sizes="150px"
            />
            <p>
              Locally owned mountain specialists in the High Atlas of Morocco.
              We are not a general tour operator — we are dedicated exclusively
              to Mount Toubkal.
            </p>
          </div>
          <div className="foot-col">
            <h5>Toubkal Treks</h5>
            <a href="#adventures">2-Day Summit</a>
            <a href="#adventures">3-Day Summit</a>
            <a href="#adventures">4-Day Round</a>
            <a href="#adventures">5-Day Berber Villages</a>
            <a href="#adventures">6-Day Camping</a>
            <a href="#adventures">15-Day Traverse</a>
          </div>
          <div className="foot-col">
            <h5>Explore</h5>
            <a href="#adventures">Trail Running</a>
            <Link href="/contact">Private Adventures</Link>
            <a href="#mountain">The Mountain</a>
            <a href="#sustain">Sustainable Morocco</a>
            <a href="#reviews">Reviews</a>
          </div>
          <div className="foot-col">
            <h5>Company</h5>
            <a href="#team">About Us</a>
            <a href="#faq">Plan Your Trek</a>
            <a href="#faq">FAQ</a>
            <Link href="/contact">Contact</Link>
            <a href="/blog">Journal</a>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© 2026 TOUBKAL PATHFINDERS · SUSTAINABLE TOURISM IN MOROCCO</p>
          <div className="socials">
            <a href="#" aria-label="Instagram">◉</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href={`mailto:${SITE.email}`} aria-label="Email">✉</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
