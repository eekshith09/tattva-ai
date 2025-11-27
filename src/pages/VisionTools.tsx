import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, LoadingSkeleton } from '../components/Common';

// ⭐ FIXED IMPORT — forces Vite to load the correct file
import { ToolType, type NoteStructure } from "../types";


import { mockOCR, mockImageToNotes } from '../services/mockAI';
import { Upload, FileText, Download, Scan } from 'lucide-react';

const FileUpload = ({ onFileSelect, label }: { onFileSelect: (f: File) => void, label: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
        ${dragActive ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-purple-400'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600">
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-200">{label}</p>
          <p className="text-sm text-slate-500 mt-1">or drag and drop PNG, JPG</p>
        </div>
      </div>
    </div>
  );
};

export const OCRTool = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { addHistoryItem, showToast } = useApp();

  const handleProcess = async (file: File) => {
    setImage(URL.createObjectURL(file));
    setLoading(true);
    setText('');
    try {
      const result = await mockOCR(file);
      setText(result);
      addHistoryItem({
  type: ToolType.OCR,
  title: "OCR Extraction",
  summary: result.substring(0, 50) + "..."
});

      showToast('Text extracted successfully!');
    } catch {
      showToast('Extraction failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Scan className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold">OCR Scanner</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <FileUpload onFileSelect={handleProcess} label="Upload Image for OCR" />
          {image && (
            <Card className="p-2 overflow-hidden">
              <img src={image} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
            </Card>
          )}
        </div>

        <Card className="min-h-[400px]">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Extracted Text
          </h3>
          {loading ? (
            <LoadingSkeleton rows={8} />
          ) : text ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {text}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Upload an image to see text here.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export const ImageToNotesTool = () => {
  const [image, setImage] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const { addHistoryItem, showToast } = useApp();

  const handleProcess = async (file: File) => {
    setImage(URL.createObjectURL(file));
    setLoading(true);
    try {
      const result = await mockImageToNotes(file);
      setNotes(result);
      addHistoryItem({ type: ToolType.IMAGE_TO_NOTES, input: result.heading, output: 'Structured notes generated' });
      showToast('Notes generated successfully!');
    } catch {
      showToast('Failed to generate notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Image to Notes</h2>
        <p className="text-slate-500">Turn lecture slides or whiteboard photos into structured study notes.</p>
      </div>

      {!image ? (
        <div className="max-w-xl mx-auto">
          <FileUpload onFileSelect={handleProcess} label="Upload Slide/Whiteboard" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-2 sticky top-24">
              <img src={image} alt="Source" className="w-full rounded-lg mb-4" />
              <Button onClick={() => { setImage(null); setNotes(null); }} variant="secondary" className="w-full">
                Upload New
              </Button>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              {loading ? (
                <div className="space-y-6">
                  <LoadingSkeleton rows={2} />
                  <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />
                  <LoadingSkeleton rows={4} />
                  <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />
                  <LoadingSkeleton rows={3} />
                </div>
              ) : notes ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{notes.heading}</h1>
                    <Button variant="ghost" className="text-purple-600">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Core Concepts</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                      {notes.subpoints.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">Key Definitions</h3>
                    <div className="space-y-2">
                      {notes.definitions.map((def, i) => (
                        <div key={i}>
                          <span className="font-semibold text-purple-900 dark:text-purple-200">{def.term}</span>
                          <span className="text-purple-800 dark:text-purple-300 ml-2">{def.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
