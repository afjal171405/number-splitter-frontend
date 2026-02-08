import React, { useState } from 'react';
import axios from 'axios';
import {
  FileSpreadsheet, Download, UploadCloud, CheckCircle2,
  AlertCircle, LayoutDashboard, History, PhoneCall, Zap, RotateCcw
} from 'lucide-react';

// CHANGE THIS TO YOUR SERVER IP OR DOMAIN
const BACKEND_URL = "http://202.51.1.164:80/process-excel";

function App() {
  const [file, setFile] = useState(null);
  const [columnName, setColumnName] = useState('Mobile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setFile(null);
    setColumnName('Mobile');
    setMessage('');
    setStatus(null);
    setLoading(false);
    setResetKey(prev => prev + 1);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first");

    setLoading(true);
    setMessage("Processing data...");
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('column_name', columnName);

    try {
      const response = await axios.post(BACKEND_URL, formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Split_Numbers_${new Date().getTime()}.zip`);
      document.body.appendChild(link);
      link.click();

      setStatus('success');
      setMessage("Success! Download started. Resetting in 3s...");
      setTimeout(() => handleReset(), 3000);

    } catch (err) {
      setStatus('error');
      setMessage("Error: Backend unreachable or Column Name wrong.");
      setLoading(false);
    }
  };

  return (
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
        <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
          <div className="p-8 flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg"><Zap size={24} /></div>
            <h1 className="text-xl font-bold tracking-tight">TeleSplit Admin</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-lg">
              <LayoutDashboard size={20}/><span className="font-semibold text-sm">Excel Splitter</span>
            </div>
          </nav>
          <div className="p-6 border-t border-slate-800 text-center">
            <button onClick={handleReset} className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest">
              <RotateCcw size={14} /> Force Reset
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto">
            <header className="mb-10">
              <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Number Splitter</h2>
              <p className="text-slate-500 mt-2 text-lg font-medium">Split NTC, Ncell, and SmartCell spreadsheets.</p>
            </header>

            <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
              <form onSubmit={handleUpload} className="space-y-8">
                <div className="max-w-md">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 uppercase tracking-wide">
                    <PhoneCall size={16} className="text-indigo-500" /> Excel Column Name
                  </label>
                  <input
                      type="text"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none text-lg"
                      value={columnName}
                      onChange={(e) => setColumnName(e.target.value)}
                  />
                </div>

                <div className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all ${file ? 'border-green-400 bg-green-50/30' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'}`}>
                  <input key={resetKey} type="file" accept=".xlsx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                  <div className="flex flex-col items-center">
                    {file ? (
                        <><div className="bg-green-100 p-5 rounded-full mb-4"><CheckCircle2 className="text-green-600" size={48} /></div>
                          <p className="text-xl font-bold">{file.name}</p></>
                    ) : (
                        <><div className="bg-indigo-100 p-5 rounded-full mb-4"><UploadCloud className="text-indigo-600" size={48} /></div>
                          <p className="text-xl font-bold uppercase">Click to Upload File</p></>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" disabled={loading || !file} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-black text-xl transition-all shadow-xl ${loading || !file ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}>
                    {loading ? 'Processing...' : 'Process and Split'}
                    {!loading && <Download size={24} />}
                  </button>
                  <button type="button" onClick={handleReset} className="px-8 py-5 rounded-2xl text-slate-500 font-bold border-2 border-slate-100 hover:bg-slate-50 transition-all flex items-center gap-2">
                    <RotateCcw size={20} /> Reset
                  </button>
                </div>
              </form>

              {message && (
                  <div className={`mt-8 p-6 rounded-2xl flex items-center gap-4 border-2 ${status === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {status === 'error' ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
                    <p className="font-bold text-lg">{message}</p>
                  </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
}

export default App;