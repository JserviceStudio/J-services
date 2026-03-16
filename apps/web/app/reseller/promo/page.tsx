import { WorkspacePlaceholder } from '@/components/ui/workspace-placeholder';

export default function ResellerPromoRoute() {
  return (
    <WorkspacePlaceholder
      kicker="Reseller sales"
      title="Promo"
      description="Zone dediee aux codes promo, assets commerciaux et diffusion par produit."
      points={['promo assets', 'campaign kits', 'shareable product cards']}
    />
  );
}
