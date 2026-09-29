// QR code téléchargeable pour chaque vitrine (utile à imprimer, mettre dans
// une vidéo, sur un packaging...). Généré au build, en SVG (net à toute
// taille, fichier léger). Accessible depuis le pied de page du site.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import QRCode from 'qrcode';

export const getStaticPaths: GetStaticPaths = async () => {
  const vitrines = (await getCollection('vitrines')).sort((a, b) => a.data.order - b.data.order);
  const home = vitrines[0];
  if (!home) return [];

  return vitrines.map((v) => ({
    params: { vitrine: v.id },
    props: { path: v.id === home.id ? '/' : `/${v.id}`, id: v.id },
  }));
};

export const GET: APIRoute = async ({ props, site }) => {
  const target = new URL(props.path, site).href;
  const svg = await QRCode.toString(target, { type: 'svg', margin: 1, width: 512 });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': `attachment; filename="qr-${props.id}.svg"`,
    },
  });
};
