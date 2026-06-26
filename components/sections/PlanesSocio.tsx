import { getPlanes } from "@/lib/planes";
import PlanesSocioClient from "./PlanesSocioClient";

/**
 * Server wrapper: trae los planes y sus ventajas (matriz aplanada) y delega la
 * compra (Mercado Pago) al componente cliente.
 */
export default async function PlanesSocio() {
  const { features, planes } = await getPlanes();
  return <PlanesSocioClient features={features} planes={planes} />;
}
