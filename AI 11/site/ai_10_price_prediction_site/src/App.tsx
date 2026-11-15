import { useState, type ChangeEvent, type FormEvent } from 'react';
import { cities } from './cities';
import { getCityNameAZ } from './cityNamesAZ';
import { predict, type PredictIn } from './api';
import './App.css';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('az-AZ', { maximumFractionDigits: 0 }).format(value);

const initialForm: PredictIn = {
  bedrooms: 0,
  bathrooms: 0,
  sqm: 0,
  city: '',
};

type PredictionResult = { price: number; data: PredictIn };

function App() {
  const [formData, setFormData] = useState<PredictIn>(initialForm);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetFeedback = () => {
    setResult(null);
    setError(null);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: name === 'city' ? value : Number(value),
    }));
    resetFeedback();
  };

  const changeCount = (field: 'bedrooms' | 'bathrooms', delta: number) => {
    setFormData((previous) => ({
      ...previous,
      [field]: Math.max(0, previous[field] + delta),
    }));
    resetFeedback();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    const submittedData = { ...formData };

    try {
      const response = await predict(submittedData);
      if (
        typeof response.priceAZN !== 'number' ||
        !Number.isFinite(response.priceAZN) ||
        response.priceAZN < 0
      ) {
        throw new Error('Servis düzgün qiymət qaytarmadı.');
      }
      setResult({ price: response.priceAZN, data: submittedData });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Proqnoz zamanı xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Məkan — ana səhifə">
          MƏKAN<span>.</span>
        </a>
        <span className="header-center">DAŞINMAZ ƏMLAK / ANALİTİKA</span>
        <span className="header-index">AZ <i>/</i> 001</span>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> EV QİYMƏTLƏRİNİN AĞILLI TƏHLİLİ</div>
            <h1>Hər evin<br />bir <em>dəyəri</em><br />var.</h1>
            <p className="hero-description">
              Evinizin xüsusiyyətlərini daxil edin. Maşın öyrənməsi modeli ilə
              onun təxmini qiymətini kəşf edin.
            </p>
            <a className="hero-link" href="#estimate">Qiyməti öyrən <span aria-hidden="true">↗</span></a>
            <div className="hero-bottom"><span>01 / 03</span><span>ÖLÇ. TƏHLİL ET. KƏŞF ET.</span></div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-top-label"><span>FORM FOLLOWS VALUE</span><span>FIG. 01</span></div>
            <div className="architecture">
              <div className="architecture-sun" />
              <div className="building building-back" />
              <div className="building building-front">
                <div className="building-vertical" />
                <div className="building-window window-one" />
                <div className="building-window window-two" />
                <div className="building-door" />
              </div>
              <div className="building-stairs" />
              <div className="ground-line" />
            </div>
            <div className="art-caption"><span>YAŞAYIŞ MƏKANI</span><span>FORMA / DƏYƏR / MƏKAN</span></div>
          </div>
        </section>

        <section className="estimator" id="estimate">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> İNTERAKTİV QİYMƏTLƏNDİRMƏ</div>
              <h2>Gəlin evinizi<br /><em>tanıyaq.</em></h2>
            </div>
            <span className="section-number">/ 02</span>
          </div>

          <div className="estimator-grid">
            <form className="estimate-form" onSubmit={handleSubmit}>
              <div className="form-topline"><span>MƏKAN PARAMETRLƏRİ</span><span>01 — 04</span></div>
              <div className="field">
                <label htmlFor="city"><span className="field-index">01</span> Şəhər</label>
                <div className="select-wrap">
                  <select id="city" name="city" value={formData.city} onChange={handleChange} required>
                    <option value="" disabled>Şəhəri seçin</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{getCityNameAZ(city)}</option>
                    ))}
                  </select>
                  <span className="select-arrow" aria-hidden="true">↓</span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="sqm"><span className="field-index">02</span> Ümumi sahə</label>
                <div className="area-input-wrap">
                  <input id="sqm" name="sqm" type="number" min="1" step="0.01"
                    value={formData.sqm || ''} onChange={handleChange}
                    placeholder="Məsələn, 120" required />
                  <span className="area-unit">m²</span>
                </div>
              </div>

              <div className="counter-row">
                <div className="field counter-field">
                  <label htmlFor="bedrooms"><span className="field-index">03</span> Yataq otağı</label>
                  <div className="counter">
                    <button type="button" onClick={() => changeCount('bedrooms', -1)}
                      disabled={formData.bedrooms === 0 || loading} aria-label="Yataq otaqlarının sayını azalt">−</button>
                    <input id="bedrooms" name="bedrooms" type="number" min="0" step="1"
                      value={formData.bedrooms} onChange={handleChange} required />
                    <button type="button" onClick={() => changeCount('bedrooms', 1)}
                      disabled={loading} aria-label="Yataq otaqlarının sayını artır">+</button>
                  </div>
                </div>
                <div className="field counter-field">
                  <label htmlFor="bathrooms"><span className="field-index">04</span> Vanna otağı</label>
                  <div className="counter">
                    <button type="button" onClick={() => changeCount('bathrooms', -1)}
                      disabled={formData.bathrooms === 0 || loading} aria-label="Vanna otaqlarının sayını azalt">−</button>
                    <input id="bathrooms" name="bathrooms" type="number" min="0" step="1"
                      value={formData.bathrooms} onChange={handleChange} required />
                    <button type="button" onClick={() => changeCount('bathrooms', 1)}
                      disabled={loading} aria-label="Vanna otaqlarının sayını artır">+</button>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                <span>{loading ? 'Qiymət hesablanır...' : 'Evin dəyərini hesabla'}</span>
                <span className="submit-arrow" aria-hidden="true">↗</span>
              </button>
              {error && <p className="error-message" role="alert">{error}</p>}
              <p className="form-disclaimer">
                Nəticə statistik modelin proqnozudur. Rəsmi əmlak qiymətləndirməsi deyil.
              </p>
            </form>

            <aside className="estimate-preview" aria-live="polite">
              <div className="preview-header"><span>MƏKAN / ANALİZ</span><span>FIG. 02</span></div>
              <div className="floorplan">
                <div className="floorplan-top"><span>YAŞAYIŞ PLANI</span><span>ŞƏRTİ GÖRÜNÜŞ</span></div>
                <div className="floorplan-drawing">
                  <div className="plan-room plan-room-main">
                    <span>ÜMUMİ SAHƏ</span>
                    <strong>{formData.sqm > 0 ? `${formatPrice(formData.sqm)} m²` : '— m²'}</strong>
                  </div>
                  <div className="plan-room plan-room-bedroom">
                    <span>YATAQ OTAĞI</span><strong>{formData.bedrooms}</strong>
                  </div>
                  <div className="plan-room plan-room-bathroom">
                    <span>VANNA OTAĞI</span><strong>{formData.bathrooms}</strong>
                  </div>
                </div>
                <div className="plan-scale"><span>SCHEMATIC / NOT TO SCALE</span><span>↗ N</span></div>
              </div>

              <div className="preview-bottom">
                {result ? (
                  <div className="result-content" key={`${result.price}-${result.data.city}`}>
                    <span className="result-label">PROQNOZLAŞDIRILAN QİYMƏT</span>
                    <div className="result-price">{formatPrice(result.price)}<span>₼</span></div>
                    <div className="result-details">
                      <span>{getCityNameAZ(result.data.city)}</span>
                      <span>{formatPrice(result.data.sqm)} m²</span>
                    </div>
                    <div className="result-status"><span className="status-dot" /> MODEL PROQNOZU HAZIRDIR</div>
                  </div>
                ) : loading ? (
                  <div className="preview-placeholder">
                    <span className="preview-small">TƏHLİL APARILIR</span>
                    <div className="loading-indicator" />
                    <p>Model evinizin dəyərini hesablayır.</p>
                  </div>
                ) : (
                  <div className="preview-placeholder">
                    <span className="preview-small">TƏXMİNİ BAZAR DƏYƏRİ</span>
                    <div className="placeholder-price">— ₼</div>
                    <p>Parametrləri daxil edin və qiymətləndirməyə başlayın.</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span className="footer-brand">MƏKAN.</span>
        <span>EVİN DƏYƏRİNƏ BAŞQA BAXIŞ.</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default App;
