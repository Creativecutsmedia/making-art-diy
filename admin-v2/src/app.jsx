// Root App — state, routing, theme, language
const { useState, useEffect } = React;

function App() {
  const [page, setPage] = useState(() => localStorage.getItem('mad_page') || 'dashboard');
  const [params, setParams] = useState({});
  const [lang, setLang] = useState(() => localStorage.getItem('mad_lang') || 'da');
  const [theme, setTheme] = useState(() => localStorage.getItem('mad_theme') || 'dark');
  const [cmdOpen, setCmdOpen] = useState(false);

  const { t } = useI18n(lang);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('mad_theme', theme);
    localStorage.setItem('mad_lang', lang);
    localStorage.setItem('mad_page', page);
  }, [theme, lang, page]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navigate = (p, ps = {}) => {
    setPage(p);
    setParams(ps);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <PageDashboard t={t} lang={lang} navigate={navigate} />;
      case 'products': return <PageProducts t={t} lang={lang} navigate={navigate} />;
      case 'add_product': return <PageProductEdit t={t} lang={lang} navigate={navigate} params={{ new: true }} />;
      case 'edit_product': return <PageProductEdit t={t} lang={lang} navigate={navigate} params={params} />;
      case 'orders': return <PageOrders t={t} lang={lang} navigate={navigate} />;
      case 'refunds': return <PageRefunds t={t} lang={lang} />;
      case 'discounts': return <PageDiscounts t={t} lang={lang} />;
      case 'customers': return <PageCustomers t={t} lang={lang} />;
      case 'stats': return <PageStats t={t} lang={lang} />;
      case 'activity_log': return <PageActivityLog t={t} lang={lang} />;
      case 'newsletter': return <PageNewsletter t={t} lang={lang} />;
      case 'shipping': return <PageShipping t={t} lang={lang} />;
      case 'email_templates': return <PageEmailTemplates t={t} lang={lang} />;
      case 'integrations': return <PageIntegrations t={t} lang={lang} />;
      case 'settings': return <PageSettings t={t} lang={lang} />;
      default: return <PageDashboard t={t} lang={lang} navigate={navigate} />;
    }
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={(p) => navigate(p)} t={t} />
      <main>
        <Topbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} t={t} onOpenCmd={() => setCmdOpen(true)} />
        {renderPage()}
      </main>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} t={t} lang={lang} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
