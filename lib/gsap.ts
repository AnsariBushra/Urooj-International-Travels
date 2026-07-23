import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Registering plugins is idempotent in GSAP, but we still guard with a
// module-level flag so this file can be imported from many components
// without re-registering on every Fast Refresh in dev.
let registered = false;

export function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  registered = true;
}

export { gsap, ScrollTrigger };
