(function (root) {
  var LC = { JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219', 'C++': '#f34b7d', C: '#aaaaaa', 'C#': '#178600', Go: '#00ADD8', Rust: '#dea584', PHP: '#4F5D95', Ruby: '#701516', Kotlin: '#A97BFF', Swift: '#F05138', Dart: '#00B4AB', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', 'Jupyter Notebook': '#DA5B0B', Vue: '#41b883', SCSS: '#c6538c' };
  var THEMES = {
    sunset: { bg1: '#2b1055', bg2: '#d4507a', tx: '#ffffff', dim: '#ffd9e6', acc: '#ffc371', card: 'rgba(255,255,255,.12)' },
    ocean: { bg1: '#06283d', bg2: '#1363df', tx: '#ffffff', dim: '#bcd7ff', acc: '#47b5ff', card: 'rgba(255,255,255,.1)' },
    forest: { bg1: '#0b2b1e', bg2: '#2e7d4f', tx: '#f2fff6', dim: '#bfe8cd', acc: '#a8f0a0', card: 'rgba(255,255,255,.1)' },
    mono: { bg1: '#111111', bg2: '#2a2a2a', tx: '#f4f4f4', dim: '#a0a0a0', acc: '#ffffff', card: 'rgba(255,255,255,.08)' },
    paper: { bg1: '#fbf7ef', bg2: '#f0e6d2', tx: '#2b2418', dim: '#7a6c52', acc: '#c2410c', card: 'rgba(0,0,0,.05)' }
  };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k' : String(n); }
  function stats(user, repos) {
    var own = repos.filter(function (r) { return !r.fork; }), stars = 0, langs = {}, forks = 0;
    own.forEach(function (r) { stars += r.stargazers_count || 0; forks += r.forks_count || 0; if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    var tot = 0, arr = Object.keys(langs).map(function (k) { tot += langs[k]; return [k, langs[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 5);
    var top = own.slice().sort(function (a, b) { return b.stargazers_count - a.stargazers_count; })[0];
    return { name: user.name || user.login, login: user.login, bio: user.bio || '', repos: user.public_repos, followers: user.followers, following: user.following, stars: stars, forks: forks, langs: arr.map(function (x) { return { name: x[0], pct: Math.round(x[1] / tot * 100) }; }), top: top ? { name: top.name, stars: top.stargazers_count } : null, since: (user.created_at || '').slice(0, 4), avatar: null };
  }
  function trunc(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function svg(st, themeName, opt) {
    opt = opt || {};
    var t = THEMES[themeName] || THEMES.sunset, W = 495, H = 195, id = 'g' + Math.abs(hash(st.login));
    var bar = '', x = 24, y = 160, w = 447, leg = '', lx = 24;
    st.langs.forEach(function (l, i) {
      var bw = Math.max(4, w * l.pct / 100), c = LC[l.name] || t.acc;
      bar += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="8" fill="' + c + '"/>'; x += bw;
    });
    st.langs.slice(0, 4).forEach(function (l) {
      var c = LC[l.name] || t.acc;
      leg += '<circle cx="' + (lx + 4) + '" cy="182" r="4" fill="' + c + '"/><text x="' + (lx + 12) + '" y="186" font-size="10.5" fill="' + t.dim + '">' + esc(l.name) + ' ' + l.pct + '%</text>'; lx += 14 + l.name.length * 6.4 + 34;
    });
    var cells = [['Stars', fmt(st.stars)], ['Repos', fmt(st.repos)], ['Followers', fmt(st.followers)], ['Forks', fmt(st.forks)]], cx = '';
    cells.forEach(function (c, i) {
      var px = 24 + i * 112;
      cx += '<rect x="' + px + '" y="98" width="100" height="46" rx="10" fill="' + t.card + '"/><text x="' + (px + 12) + '" y="120" font-size="19" font-weight="700" fill="' + t.tx + '">' + c[1] + '</text><text x="' + (px + 12) + '" y="136" font-size="10" fill="' + t.dim + '">' + c[0] + '</text>';
    });
    var av = st.avatar ? '<clipPath id="' + id + 'c"><circle cx="50" cy="48" r="26"/></clipPath><image href="' + st.avatar + '" x="24" y="22" width="52" height="52" clip-path="url(#' + id + 'c)"/><circle cx="50" cy="48" r="26" fill="none" stroke="' + t.acc + '" stroke-width="2"/>' : '<circle cx="50" cy="48" r="26" fill="' + t.acc + '"/><text x="50" y="57" font-size="26" font-weight="700" text-anchor="middle" fill="' + t.bg1 + '">' + esc((st.name || '?')[0].toUpperCase()) + '</text>';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" font-family="Segoe UI,Ubuntu,Helvetica,Arial,sans-serif" role="img" aria-label="GitHub card for ' + esc(st.login) + '">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + t.bg1 + '"/><stop offset="1" stop-color="' + t.bg2 + '"/></linearGradient><clipPath id="' + id + 'r"><rect width="' + W + '" height="' + H + '" rx="16"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + 'r)"><rect width="' + W + '" height="' + H + '" fill="url(#' + id + ')"/><circle cx="440" cy="20" r="90" fill="' + t.acc + '" opacity=".12"/>' +
      av + '<text x="90" y="44" font-size="21" font-weight="700" fill="' + t.tx + '">' + esc(trunc(st.name, 24)) + '</text><text x="90" y="62" font-size="12" fill="' + t.acc + '">@' + esc(st.login) + (st.since ? ' · since ' + esc(st.since) : '') + '</text>' +
      '<text x="90" y="80" font-size="11" fill="' + t.dim + '">' + esc(trunc(st.bio || (st.top ? 'Top repo: ' + st.top.name + ' (' + st.top.stars + ' stars)' : ''), 62)) + '</text>' +
      cx + '<rect x="24" y="160" width="447" height="8" rx="4" fill="' + t.card + '"/><g clip-path="url(#' + id + 'b)">' + bar + '</g>' + leg + '</g>' +
      '<clipPath id="' + id + 'b"><rect x="24" y="160" width="447" height="8" rx="4"/></clipPath></svg>';
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  var api = { stats: stats, svg: svg, THEMES: THEMES };
  if (typeof module !== 'undefined') module.exports = api; else root.ProfileCard = api;
})(this);
