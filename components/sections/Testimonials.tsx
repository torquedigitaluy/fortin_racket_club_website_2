import { getTestimonios } from "@/lib/testimonios";
import TestimonialsCarousel from "./TestimonialsCarousel";

/**
 * Server wrapper: trae los testimonios y delega el slider al cliente.
 */
export default async function Testimonials() {
  const testimonios = await getTestimonios();
  return <TestimonialsCarousel testimonios={testimonios} />;
}
