import SEO from '@/components/common/SEO/SEO'
import HomeHero from '@/components/sections/HomeHero/HomeHero'
import DorLideranca from '@/components/sections/DorLideranca/DorLideranca'
import DiagnosticoGratuito from '@/components/sections/DiagnosticoGratuito/DiagnosticoGratuito'
import SobreFacilitador from '@/components/sections/SobreFacilitador/SobreFacilitador'
import DepoimentosCases from '@/components/sections/DepoimentosCases/DepoimentosCases'
import FAQ from '@/components/sections/FAQ/FAQ'
import CTAFinal from '@/components/sections/CTAFinal/CTAFinal'
import { trackMeta, MetaEvent } from '@/lib/metaPixel'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // ViewContent: visita à landing page principal (PageView já vem do base code)
    trackMeta(MetaEvent.VIEW_CONTENT, { content_name: 'Home — Mentoria de Liderança', content_type: 'home' })
  }, [])

  return (
    <>
      <SEO
        titulo="Diagnóstico de Liderança Presencial Gratuito"
        descricao="Transforme a liderança de sua empresa de 50 a 200 funcionários. Evite a microgestão, reduza o turnover e alinhe a gerência. Diagnóstico presencial de 90min com Mauro Gambini."
        canonical="/"
      />
      <HomeHero />
      <DorLideranca />
      <DiagnosticoGratuito />
      <SobreFacilitador />
      <DepoimentosCases />
      <FAQ />
      <CTAFinal />
    </>
  )
}
