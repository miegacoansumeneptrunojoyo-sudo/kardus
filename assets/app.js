(() => {
  "use strict";
  const STORAGE_KEY = "rekapUangKardus.transactions.v1";
  const $ = (id) => document.getElementById(id);
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const shortMonths = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const money = (n) => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0);
  const dateText = (s) => { if(!s) return "—"; const [y,m,d]=s.split("-"); return `${d}/${m}/${y}`; };
  const localDateISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  let transactions = load();
  let currentPage = 1;
  const pageSize = 10;
  let toastTimer;

  function load(){ try { const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"); if(!Array.isArray(x))return []; return x.filter(t=>t&&typeof t.id==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)&&typeof t.description==="string"&&["Pemasukan","Pengeluaran"].includes(t.type)&&Number.isSafeInteger(Number(t.amount))&&Number(t.amount)>0).map(t=>({...t,amount:Number(t.amount),note:String(t.note||""),createdAt:Number(t.createdAt)||Date.now()})); } catch { return []; } }
  function save(){ try { localStorage.setItem(STORAGE_KEY,JSON.stringify(transactions)); return true; } catch { notify("Data gagal disimpan. Penyimpanan browser mungkin penuh; segera ekspor/cadangkan data."); return false; } }
  function uid(){ return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`); }
  function sorted(){ return [...transactions].sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt-a.createdAt); }
  function totals(list=transactions){ return list.reduce((a,t)=>{a.income+=t.type==="Pemasukan"?t.amount:0;a.expense+=t.type==="Pengeluaran"?t.amount:0;return a;},{income:0,expense:0}); }
  function balanceById(){ let balance=0; const asc=[...transactions].sort((a,b)=>a.date.localeCompare(b.date)||a.createdAt-b.createdAt); const map={}; for(const t of asc){balance += t.type==="Pemasukan"?t.amount:-t.amount;map[t.id]=balance;} return map; }
  function notify(message){ const el=$("toast"); el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2800); }
  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function typeBadge(t){return `<span class="category ${t==="Pemasukan"?"in":"out"}">${t}</span>`;}
  function renderRows(list, withActions=false){const balances=balanceById();return list.map(t=>`<tr><td>${dateText(t.date)}</td><td><strong>${esc(t.description)}</strong>${t.note?`<div style="color:#8793a3;font-size:10px;margin-top:4px">${esc(t.note)}</div>`:""}</td><td>${typeBadge(t.type)}</td><td class="right ${t.type==="Pemasukan"?"amount-in":""}">${t.type==="Pemasukan"?money(t.amount):"—"}</td><td class="right ${t.type==="Pengeluaran"?"amount-out":""}">${t.type==="Pengeluaran"?money(t.amount):"—"}</td><td class="right"><strong>${money(balances[t.id]||0)}</strong></td>${withActions?`<td class="action-cell"><button class="action-btn" data-edit="${t.id}">Edit</button><button class="action-btn delete" data-delete="${t.id}">Hapus</button></td>`:""}</tr>`).join("");}
  function renderDashboard(){
    const all=totals();$("total-income").textContent=money(all.income);$("total-expense").textContent=money(all.expense);$("total-balance").textContent=money(all.income-all.expense);
    const year=Number($("chart-year").value)||new Date().getFullYear();const list=transactions.filter(t=>t.date.startsWith(`${year}-`));const total=totals(list);
    $("summary-count").textContent=list.length;$("summary-income").textContent=money(total.income);$("summary-expense").textContent=money(total.expense);$("summary-balance").textContent=money(total.income-total.expense);
    const recent=sorted().slice(0,5);$("recent-body").innerHTML=renderRows(recent);$("recent-empty").classList.toggle("hidden",recent.length>0);
    const data=months.map((_,i)=>{const m=String(i+1).padStart(2,"0");const a=transactions.filter(t=>t.date.startsWith(`${year}-${m}-`));return totals(a);});
    const max=Math.max(1,...data.flatMap(d=>[d.income,d.expense]));
    $("chart").innerHTML=data.map((d,i)=>`<div class="chart-month" title="${months[i]}: pemasukan ${money(d.income)}, pengeluaran ${money(d.expense)}"><div class="bar income-bar" style="height:${Math.max(d.income?2:0,d.income/max*100)}%" aria-label="Pemasukan ${money(d.income)}"></div><div class="bar expense-bar" style="height:${Math.max(d.expense?2:0,d.expense/max*100)}%" aria-label="Pengeluaran ${money(d.expense)}"></div><label>${shortMonths[i]}</label></div>`).join("");
  }
  function renderTransactions(){
    const q=$("search-input").value.trim().toLowerCase(),type=$("type-filter").value,month=$("date-filter").value;
    let list=sorted().filter(t=>(!q||(t.description+" "+(t.note||"")).toLowerCase().includes(q))&&(type==="all"||t.type===type)&&(!month||t.date.startsWith(month)));
    const pages=Math.max(1,Math.ceil(list.length/pageSize));currentPage=Math.min(currentPage,pages);const start=(currentPage-1)*pageSize;const page=list.slice(start,start+pageSize);
    $("transactions-body").innerHTML=renderRows(page,true);$("transactions-empty").classList.toggle("hidden",list.length>0);
    $("result-count").textContent=`${list.length} transaksi`; $("page-info").textContent=`${currentPage} / ${pages}`;$("prev-page").disabled=currentPage<=1;$("next-page").disabled=currentPage>=pages;
  }
  function renderReport(){
    const year=Number($("report-year").value)||new Date().getFullYear();const list=transactions.filter(t=>t.date.startsWith(`${year}-`));const t=totals(list);
    $("report-income").textContent=money(t.income);$("report-expense").textContent=money(t.expense);$("report-balance").textContent=money(t.income-t.expense);
    $("report-body").innerHTML=months.map((m,i)=>{const mm=String(i+1).padStart(2,"0");const items=list.filter(x=>x.date.startsWith(`${year}-${mm}-`));const z=totals(items);return `<tr><td><strong>${m}</strong></td><td class="right">${items.length}</td><td class="right amount-in">${money(z.income)}</td><td class="right amount-out">${money(z.expense)}</td><td class="right"><strong>${money(z.income-z.expense)}</strong></td></tr>`;}).join("");
  }
  function renderAll(){renderDashboard();renderTransactions();renderReport();}
  function setView(name){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${name}`));document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));$("page-title").textContent=({dashboard:"Dashboard Keuangan",transactions:"Transaksi Keuangan",reports:"Laporan Keuangan"})[name]||"Rekap Uang Kardus";if(name==="transactions")renderTransactions();if(name==="reports")renderReport();window.scrollTo({top:0,behavior:"smooth"});}
  function populateYears(){const years=new Set([new Date().getFullYear()]);transactions.forEach(t=>years.add(Number(t.date.slice(0,4))));const opts=[...years].sort((a,b)=>b-a).map(y=>`<option value="${y}">${y}</option>`).join("");["chart-year","report-year"].forEach(id=>{$(id).innerHTML=opts;});}
  function openForm(id=null){$("transaction-form").reset();$("transaction-id").value="";$("transaction-date").value=localDateISO();$("transaction-type").value="Pemasukan";$("dialog-title").textContent=id?"Edit Transaksi":"Tambah Transaksi";if(id){const t=transactions.find(x=>x.id===id);if(!t)return;$("transaction-id").value=t.id;$("transaction-date").value=t.date;$("transaction-description").value=t.description;$("transaction-type").value=t.type;$("transaction-amount").value=t.amount;$("transaction-note").value=t.note||"";} const dialog=$("transaction-dialog");if(typeof dialog.showModal==="function"){if(!dialog.open)dialog.showModal();}else{dialog.setAttribute("open","");dialog.style.display="block";}}
  function closeForm(){const dialog=$("transaction-dialog");if(typeof dialog.close==="function"&&dialog.open)dialog.close();else{dialog.removeAttribute("open");dialog.style.display="none";}}
  function saveForm(e){e.preventDefault();const id=$("transaction-id").value,date=$("transaction-date").value,description=$("transaction-description").value.trim(),type=$("transaction-type").value,amount=Number($("transaction-amount").value),note=$("transaction-note").value.trim();if(!date||!description||!Number.isFinite(amount)||amount<=0){notify("Lengkapi data dan masukkan nominal lebih dari 0.");return;}if(id){transactions=transactions.map(t=>t.id===id?{...t,date,description,type,amount,note,updatedAt:Date.now()}:t);notify("Transaksi berhasil diperbarui.");}else{transactions.push({id:uid(),date,description,type,amount,note,createdAt:Date.now()});notify("Transaksi berhasil disimpan.");}save();populateYears();renderAll();closeForm();}
  function deleteTransaction(id){const t=transactions.find(x=>x.id===id);if(!t)return;if(!confirm(`Hapus transaksi "${t.description}"? Tindakan ini tidak dapat dibatalkan.`))return;transactions=transactions.filter(x=>x.id!==id);save();populateYears();renderAll();notify("Transaksi dihapus.");}
  function csvCell(v){return `"${String(v??"").replace(/"/g,'""')}"`;}
  function downloadCsv(rows,filename){const csv="\uFEFF"+rows.map(r=>r.map(csvCell).join(";")).join("\r\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);}
  function exportAll(){const bal=balanceById();const rows=[["Tanggal","Keterangan","Kategori","Pemasukan (Rp)","Pengeluaran (Rp)","Sisa Uang (Rp)","Catatan"],...transactions.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.createdAt-b.createdAt).map(t=>[dateText(t.date),t.description,t.type,t.type==="Pemasukan"?t.amount:"",t.type==="Pengeluaran"?t.amount:"",bal[t.id]||0,t.note||""])];downloadCsv(rows,"rekap-uang-kardus.csv");}
  function exportReport(){const year=Number($("report-year").value)||new Date().getFullYear();const list=transactions.filter(t=>t.date.startsWith(`${year}-`));const rows=[["Laporan Rekap Uang Kardus",year],[],["Bulan","Jumlah Transaksi","Pemasukan (Rp)","Pengeluaran (Rp)","Selisih (Rp)"],...months.map((m,i)=>{const mm=String(i+1).padStart(2,"0"),items=list.filter(t=>t.date.startsWith(`${year}-${mm}-`)),z=totals(items);return [m,items.length,z.income,z.expense,z.income-z.expense];})];downloadCsv(rows,`laporan-uang-kardus-${year}.csv`);}
  function downloadJson(){const payload={app:"Sistem Rekap Uang Kardus",schemaVersion:1,exportedAt:new Date().toISOString(),transactions};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`cadangan-uang-kardus-${localDateISO()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify("File cadangan berhasil dibuat. Simpan di tempat aman.");}
  function restoreJson(file){if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(String(reader.result||""));const incoming=Array.isArray(data)?data:data.transactions;if(!Array.isArray(incoming))throw new Error("Format cadangan tidak dikenali.");const clean=incoming.map(t=>{if(!t||typeof t!=="object"||!/^\d{4}-\d{2}-\d{2}$/.test(String(t.date||""))||!String(t.description||"").trim()||!["Pemasukan","Pengeluaran"].includes(t.type)||!Number.isSafeInteger(Number(t.amount))||Number(t.amount)<=0)throw new Error("Ada data transaksi yang tidak valid.");return {id:String(t.id||uid()),date:String(t.date),description:String(t.description).trim().slice(0,120),type:t.type,amount:Number(t.amount),note:String(t.note||"").slice(0,300),createdAt:Number(t.createdAt)||Date.now(),...(t.updatedAt?{updatedAt:Number(t.updatedAt)}:{})};});if(!confirm(`Pulihkan ${clean.length} transaksi dari file cadangan? Data saat ini akan DIGANTI. Cadangkan data saat ini terlebih dahulu jika diperlukan.`))return;const previous=transactions;transactions=clean;if(!save()){transactions=previous;return;}populateYears();renderAll();notify(`Berhasil memulihkan ${clean.length} transaksi.`);}catch(err){notify(err.message||"File cadangan tidak dapat dibaca.");}finally{$("restore-file").value="";}};reader.onerror=()=>{notify("File tidak dapat dibaca.");$("restore-file").value="";};reader.readAsText(file);}
  // Delegated fallback: ensure the Add Transaction action works even after mobile layout changes.
  document.addEventListener("click", (event) => {
    const button = event.target.closest("#add-transaction, #quick-add, [data-action=\"add-transaction\"]");
    if (!button) return;
    event.preventDefault();
    try { openForm(); } catch (error) { console.error("Gagal membuka form transaksi:", error); notify("Form belum bisa dibuka. Muat ulang halaman dan coba lagi."); }
  }, true);
  document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.goto)));
  ["quick-add","add-transaction"].forEach(id=>{const el=$(id);if(el)el.addEventListener("click",()=>openForm());});
  $("close-dialog").addEventListener("click",closeForm);$("cancel-dialog").addEventListener("click",closeForm);$("transaction-form").addEventListener("submit",saveForm);
  $("transactions-body").addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(edit)openForm(edit.dataset.edit);if(del)deleteTransaction(del.dataset.delete);});
  ["search-input","type-filter","date-filter"].forEach(id=>$(id).addEventListener("input",()=>{currentPage=1;renderTransactions();}));
  $("prev-page").addEventListener("click",()=>{currentPage--;renderTransactions();});$("next-page").addEventListener("click",()=>{currentPage++;renderTransactions();});
  $("chart-year").addEventListener("change",renderDashboard);$("report-year").addEventListener("change",renderReport);const globalExport=$("export-btn");if(globalExport)globalExport.addEventListener("click",exportAll);$("report-export").addEventListener("click",exportReport);
  const backupBtn=$("backup-btn"),restoreBtn=$("restore-btn"),restoreFile=$("restore-file");if(backupBtn)backupBtn.addEventListener("click",downloadJson);if(restoreBtn&&restoreFile)restoreBtn.addEventListener("click",()=>restoreFile.click());if(restoreFile)restoreFile.addEventListener("change",e=>restoreJson(e.target.files&&e.target.files[0]));
  populateYears();renderAll();
})();
