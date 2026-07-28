import { ImageResponse } from 'next/og'

export const alt = 'CVForge — build and analyze your CV locally'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const logoDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADPUlEQVR4nNWWS2hdVRSGv517bfOohQhW1FqhUREUnwM76KRSkApFUVEQqYgPEAdGC504EnQoONEqOBBEFHHWOolWRAQFoSqI4MAUCoKkWhC1tnrv/Ryc/5Cdm6SYNk11w2Hfux57rf9fa69z4P+81I7aOV/By1K/1zS4ep9695omoY6oRb3e+XVVZCNrkUAn+1tqXx2o+2vduQzeop9ST6q9JPG7uvlMWFgpZaWUIjANrAc6QAEmgKeiOzdlqNBfpv6a2r+tfpoyzKmTsVn9hlS72V9M8L56pXpP1Yx7a9vVDF7yTKo/BfEH0Y2rs0loVh1bdRYq9HsrtDuqeVDL99Q+qxG8RT+uHgn6L9qOz36Reiy6rzKiV6cZK/SPVigfbHWV/qVKf2dkZz8XgrCrfhuEP6ijFQMd52fDidh8HN+zY6FCd2+Fbt8wujaQ+m5sBuptSezMWahq/HkO/UW9OLoN6hb1cnUism25DarvDSe60uCdJHB7hf7V6CbUS21eQlvVTeq66NrBdFK9OmcsW4pFijh0acbuANgX1QB4PYE61dPNPhq/V2jG83rg6ZzRTR+trCfUJ4JG9Z1K3jKwKc8l6mil/zo+f6q7ThejWzmNlFIG6v3ATmALcAfQi92E+khY6wFjwHiYOQGcSr2NDGAdcEA9CMwB75dSZtpYw2jrD43DLlx9V74GQ/8/VK9o47Rxy1AS7esW9S5gD3ATsDUmvSDsAp8Bx4F+9DdGXypmvwe+BN4spRxaqgSLXhihcQBcABwEjuaQ7cBDMfsG+ASYjN2PwAPA5iS4HzgMbItsd+Qson6JBNrhM13RNxVZO2gOqR+pz6kvqDN5VF+O7XWV/5P12fVacC1SG2P4WJg4AMzG5Gj2HvAzsIGmEedorh3AkezfATM543GbK+hpEwBGSil9YBdwbZxfK6Wo3go8DJwCbgGOARfSzIC/gJuzT6tT6aU3csYNwM5SSt/lJqOZ2+p29beKvh02E+/fdrvq3+pGdXclO24zqhfcguGadIBrgOeDtANsBP4AnqXp+JbKwvxHaXs7GKJ5DHgmfqPAFE1DLyrFeVvLXcNa3k62Fb3VSim9pc5Kj/131j/SCxjIAydBxQAAAABJRU5ErkJggg=='

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px 72px',
          color: '#ededea',
          background:
            'radial-gradient(circle at 78% 88%, rgba(217, 116, 66, 0.34), transparent 34%), radial-gradient(circle at 20% 0%, rgba(185, 87, 37, 0.16), transparent 28%), linear-gradient(135deg, #0e0e10 0%, #181316 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img src={logoDataUri} width="46" height="46" alt="" />
          <span style={{ fontSize: '30px', fontWeight: 600 }}>CVForge</span>
          <span
            style={{
              marginLeft: '12px',
              padding: '8px 14px',
              border: '1px solid rgba(217, 116, 66, 0.38)',
              borderRadius: '999px',
              color: '#d97442',
              fontSize: '16px',
            }}
          >
            Local-first
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ maxWidth: '930px', fontSize: '66px', lineHeight: 1.04, fontWeight: 600, letterSpacing: '-2.5px' }}>
            Build and analyze your CV locally
          </div>
          <div style={{ maxWidth: '840px', color: '#b8b6b0', fontSize: '24px', lineHeight: 1.45 }}>
            Structured editing, reliable backup, PDF export, and transparent ATS-style improvement signals.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', padding: '13px 20px', border: '1px solid #2f2f36', borderRadius: '12px', background: 'rgba(22, 22, 26, 0.82)', fontSize: '18px' }}>
            Builder
          </div>
          <div style={{ color: '#85827a', fontSize: '20px' }}>+</div>
          <div style={{ display: 'flex', padding: '13px 20px', border: '1px solid rgba(217, 116, 66, 0.42)', borderRadius: '12px', background: 'rgba(22, 22, 26, 0.82)', fontSize: '18px' }}>
            Analyzer
          </div>
          <div style={{ marginLeft: 'auto', color: '#9a978f', fontSize: '17px' }}>
            No account · Browser-based · Open source
          </div>
        </div>
      </div>
    ),
    size,
  )
}
