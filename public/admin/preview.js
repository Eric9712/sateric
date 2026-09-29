// Aperçu en direct (Listes d'idées / Shoppable Photos) qui ressemble au
// vrai site pendant la saisie, au lieu de la liste de champs par défaut.
// Le plus utile : les pastilles s'affichent à leur position réelle, pour
// repérer immédiatement une position mal saisie avant d'enregistrer.
// API Sveltia : CMS.React (pas window.React), pas de JSX (pas de build ici).
(function () {
  const h = CMS.React.createElement;

  function formatPrice(n) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
  }

  function ProductCard({ product }) {
    if (!product) return null;
    return h(
      'div',
      { style: { border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', width: 120, display: 'inline-block', margin: 4, verticalAlign: 'top', fontFamily: 'sans-serif' } },
      product.image && h('img', { src: product.image, style: { width: '100%', height: 100, objectFit: 'cover', background: '#f5f5f5' } }),
      h(
        'div',
        { style: { padding: 6 } },
        product.badge && h('div', { style: { fontSize: 9, fontWeight: 700, color: '#fff', background: '#111', padding: '2px 4px', borderRadius: 4, display: 'inline-block', marginBottom: 4 } }, product.badge),
        h('div', { style: { fontSize: 11, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 } }, product.title || '(sans titre)'),
        h('div', { style: { fontSize: 12, fontWeight: 700, color: '#c2255f' } }, typeof product.price === 'number' ? formatPrice(product.price) : '')
      )
    );
  }

  function ListPreview({ entry }) {
    const data = entry.getIn(['data']).toJS();
    const products = data.products || [];
    const subIdeas = data.subIdeas || [];
    return h(
      'div',
      { style: { fontFamily: 'sans-serif', padding: 16 } },
      h('h2', { style: { fontSize: 18, fontWeight: 800 } }, (data.icon || '') + ' ' + (data.tabLabel || data.title || '(titre)')),
      data.description && h('p', { style: { color: '#666', fontSize: 13 } }, data.description),
      products.length > 0 && h('div', null, products.map((p, i) => h(ProductCard, { key: i, product: p }))),
      subIdeas.map((sub, i) =>
        h(
          'div',
          { key: i, style: { marginTop: 16 } },
          h('h3', { style: { fontSize: 14, fontWeight: 700 } }, sub.title),
          h('div', null, (sub.products || []).map((p, j) => h(ProductCard, { key: j, product: p })))
        )
      )
    );
  }

  CMS.registerPreviewTemplate('lists', ListPreview);

  function PhotoPreview({ entry }) {
    const data = entry.getIn(['data']).toJS();
    const hotspots = data.hotspots || [];
    return h(
      'div',
      { style: { fontFamily: 'sans-serif', padding: 16 } },
      h('h2', { style: { fontSize: 18, fontWeight: 800 } }, data.title || '(titre)'),
      h(
        'div',
        { style: { position: 'relative', width: '100%', maxWidth: 400, borderRadius: 16, overflow: 'hidden', background: '#f5f5f5' } },
        data.image && h('img', { src: data.image, style: { width: '100%', display: 'block' } }),
        hotspots.map((hp, i) =>
          h(
            'div',
            {
              key: i,
              title: hp.title,
              style: {
                position: 'absolute',
                left: Math.min(94, Math.max(6, hp.x || 0)) + '%',
                top: Math.min(94, Math.max(6, hp.y || 0)) + '%',
                transform: 'translate(-50%, -50%)',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid #c2255f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#c2255f',
                fontSize: 16,
              },
            },
            '+'
          )
        )
      ),
      h(
        'ul',
        { style: { marginTop: 12, paddingLeft: 18, fontSize: 12 } },
        hotspots.map((hp, i) => h('li', { key: i }, (hp.title || '(sans titre)') + ' — ' + (typeof hp.price === 'number' ? formatPrice(hp.price) : '')))
      )
    );
  }

  CMS.registerPreviewTemplate('photos', PhotoPreview);
})();
