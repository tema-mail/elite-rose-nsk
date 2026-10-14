import { useMemo, useState } from 'preact/hooks';
import ProductEditor, { type AdmProduct, type AdmPart } from './ProductEditor';
import CsvImport from './CsvImport';

// Раздел «Товары» админки по образцу магазина Тильды: разделы слева, таблица товаров, поиск,
// массовые действия, «Добавить товар», «Импорт/Экспорт CSV». Демо – без сохранения на сервер.

const fmt = (n: number | null) => (n == null ? '–' : n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽');

export default function ProductsAdmin({ items, parts, base }: { items: AdmProduct[]; parts: AdmPart[]; base: string }) {
  const [list, setList] = useState(items);
  const [part, setPart] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('site');
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [edit, setEdit] = useState<AdmProduct | null>(null);
  const [csv, setCsv] = useState(false);
  const [toast, setToast] = useState('');

  const say = (t: string) => { setToast(t); setTimeout(() => setToast(''), 3200); };
  const title = (id: string) => parts.find((p) => p.id === id)?.title ?? id;

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    let out = list.filter((p) => (part === 'all' || (part === 'hidden' ? !p.visible : p.parts.includes(part))) && (!s || p.title.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s)));
    if (sort === 'price-asc') out = [...out].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === 'price-desc') out = [...out].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === 'name') out = [...out].sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    return out;
  }, [list, part, q, sort]);

  const allOn = shown.length > 0 && shown.every((p) => sel.has(p.id));
  const toggle = (id: string) => { const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); setSel(n); };
  const blank = (): AdmProduct => ({ id: '', title: '', sku: '', price: null, priceOld: null, qty: '', mark: '', descr: '', text: '', images: [], parts: part !== 'all' && part !== 'hidden' ? [part] : [], path: '', visible: true, seoTitle: '', seoDescr: '', weight: '', size: '' });

  const save = (p: AdmProduct) => {
    if (!p.title.trim()) return say('Укажите название товара');
    if (p.id) setList(list.map((x) => (x.id === p.id ? p : x)));
    else setList([{ ...p, id: `new-${Date.now()}`, path: '/catalog' }, ...list]);
    setEdit(null);
    say('Сохранено в демо – после перезагрузки страницы вернётся как было');
  };
  const bulk = (fn: (p: AdmProduct) => AdmProduct, msg: string) => { setList(list.map((p) => (sel.has(p.id) ? fn(p) : p))); setSel(new Set()); say(msg); };

  return (
    <div class="pa">
      <aside class="pa__side">
        <p class="pa__cap">Разделы</p>
        <button class={part === 'all' ? 'on' : ''} onClick={() => setPart('all')}>Все товары<span>{list.length}</span></button>
        {parts.map((pt) => (
          <button class={part === pt.id ? 'on' : ''} onClick={() => setPart(pt.id)}>{pt.title}<span>{list.filter((p) => p.parts.includes(pt.id)).length}</span></button>
        ))}
        <button class={part === 'hidden' ? 'on' : ''} onClick={() => setPart('hidden')}>Скрытые<span>{list.filter((p) => !p.visible).length}</span></button>
        <button class="pa__addpart" onClick={() => say('Демо: разделы добавим вместе с сохранением товаров')}>+ Добавить раздел</button>
      </aside>

      <section class="pa__main">
        <div class="tools">
          <h1>{part === 'all' ? 'Все товары' : part === 'hidden' ? 'Скрытые товары' : title(part)} <span class="muted" style="font-size:15px;font-weight:400">{shown.length}</span></h1>
          <input type="search" placeholder="Название или артикул" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
          <select value={sort} onChange={(e) => setSort((e.target as HTMLSelectElement).value)} aria-label="Сортировка">
            <option value="site">Как на сайте</option><option value="name">По названию</option>
            <option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option>
          </select>
          <button class="btn" onClick={() => setCsv(true)}>⇪ Импорт CSV</button>
          <a class="btn" href={`${base}/admin/products.csv`} download>⇩ Экспорт CSV</a>
          <button class="btn primary" onClick={() => setEdit(blank())}>+ Добавить товар</button>
        </div>

        {sel.size > 0 && (
          <div class="pa__bulk">
            <b>Выбрано: {sel.size}</b>
            <button class="btn" onClick={() => bulk((p) => ({ ...p, visible: false }), 'Скрыто с сайта (демо)')}>Скрыть</button>
            <button class="btn" onClick={() => bulk((p) => ({ ...p, visible: true }), 'Опубликовано (демо)')}>Показать</button>
            <select class="btn" onChange={(e) => { const v = (e.target as HTMLSelectElement).value; if (v) bulk((p) => ({ ...p, parts: p.parts.includes(v) ? p.parts : [...p.parts, v] }), `Добавлено в раздел «${title(v)}» (демо)`); }}>
              <option value="">Добавить в раздел…</option>{parts.map((pt) => <option value={pt.id}>{pt.title}</option>)}
            </select>
            <button class="btn ghost" style="color:#b0333f" onClick={() => say('Демо: удаление подключим вместе с сохранением')}>Удалить</button>
            <button class="btn ghost" onClick={() => setSel(new Set())}>Снять выбор</button>
          </div>
        )}

        <div class="pt">
          <div class="pt__head">
            <label><input type="checkbox" checked={allOn} onChange={() => setSel(allOn ? new Set() : new Set(shown.map((p) => p.id)))} aria-label="Выбрать все" /></label>
            <span></span><span>Товар</span><span>Разделы</span><span>Цена</span><span>Остаток</span><span>На сайте</span>
          </div>
          {shown.map((p) => (
            <div class={`pt__row${sel.has(p.id) ? ' is-sel' : ''}${p.visible ? '' : ' is-off'}`} onClick={() => setEdit(p)}>
              <label onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={sel.has(p.id)} onChange={() => toggle(p.id)} aria-label={`Выбрать ${p.title}`} /></label>
              {p.images[0] ? <img class="thumb" src={`${base}${p.images[0]}-480.webp`} alt="" loading="lazy" /> : <span class="thumb" />}
              <div><span class="pname">{p.title}</span><span class="muted pt__sku">{p.sku || 'без артикула'}{p.mark && <i class="pt__mark">{p.mark}</i>}</span></div>
              <div>{p.parts.map((id) => <span class="chip">{title(id)}</span>)}</div>
              <div class="pt__price"><b>{fmt(p.price)}</b>{p.priceOld && <s>{fmt(p.priceOld)}</s>}</div>
              <span class="muted">{p.qty || '∞'}</span>
              <label class="sw" onClick={(e) => e.stopPropagation()} title={p.visible ? 'Скрыть с сайта' : 'Показать на сайте'}>
                <input type="checkbox" checked={p.visible} onChange={() => setList(list.map((x) => (x.id === p.id ? { ...x, visible: !x.visible } : x)))} /><span />
              </label>
            </div>
          ))}
          {shown.length === 0 && <p class="muted" style="padding:28px;text-align:center">Ничего не найдено</p>}
        </div>
      </section>

      {edit && <ProductEditor product={edit} parts={parts} base={base} onClose={() => setEdit(null)} onSave={save} />}
      {csv && <CsvImport base={base} onClose={() => setCsv(false)} />}
      {toast && <div class="pa__toast" role="status">{toast}</div>}
    </div>
  );
}
