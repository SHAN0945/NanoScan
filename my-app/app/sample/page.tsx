'use client'

import React, { useState } from 'react';

const NanoScanUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); // Reset results for new upload
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch('https://shan0945-nanoscan-api.hf.space', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.status === 'success') {
        setResult(data.prediction);
      } else {
        alert("Detection failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400">NanoScan</h1>
      <p className="mb-8 text-slate-400">AI-Powered PCB Defect Detection</p>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-slate-700 p-6 rounded-lg w-full max-w-md text-center">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="hidden" 
          id="pcb-upload"
        />
        <label htmlFor="pcb-upload" className="cursor-pointer block p-4 bg-slate-800 rounded hover:bg-slate-700 transition">
          {preview ? "Change Image" : "Select PCB Image"}
        </label>
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="mt-8 relative border-4 border-cyan-500/30 rounded-lg overflow-hidden max-w-lg">
          <img src={preview} alt="PCB Preview" className="w-full h-auto" />
          {loading && <div className="absolute inset-0 bg-cyan-500/20 animate-pulse flex items-center justify-center font-bold">SCANNING...</div>}
        </div>
      )}

      {/* Results Section */}
      <button 
        onClick={handleUpload}
        disabled={loading || !image}
        className="mt-6 px-8 py-3 bg-cyan-600 rounded-full font-bold hover:bg-cyan-500 disabled:opacity-50 transition"
      >
        {loading ? "Processing..." : "Run NanoScan"}
      </button>

      {result && (
        <div className="mt-8 p-6 bg-slate-800 border-l-4 border-green-500 rounded w-full max-w-md">
          <h3 className="text-xl font-bold text-green-400">Detection Result</h3>
          <p className="text-2xl mt-2 capitalize">{result.label}</p>
          <p className="text-sm text-slate-400 mt-1">Defect ID: {result.id}</p>
        </div>
      )}
    </div>
  );
};

export default NanoScanUpload;