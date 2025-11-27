import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, LoadingSkeleton } from '../components/Common';
import { mockSummarizeText, mockYouTubeSummary, mockChatQuery } from '../services/mockAI';
import { ToolType } from '../types';
import { Copy, Check, Video, MessageSquare } from 'lucide-react';

export const TextSummarizer = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addHistoryItem, showToast } = useApp();

  const handleSummarize = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const result = await mockSummarizeText(text);
      setSummary(result);
      addHistoryItem({
        type: ToolType.TEXT_SUMMARIZER,
        title: `Summary: ${text.substring(0, 20)}...`,
        summary: result
      });
      showToast('Summary generated successfully!');
    } catch (err) {
      showToast('Error generating summary', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Text Summarizer</h2>
        <p className="text-slate-500">Paste your article, essay, or notes below to get a concise summary.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here (min 20 characters)..."
            className="w-full h-64 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-purple-500 resize-none text-sm leading-relaxed"
          />
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-slate-500">{text.length} characters</span>
            <Button onClick={handleSummarize} isLoading={loading} disabled={text.length < 20}>
              Summarize
            </Button>
          </div>
        </Card>

        <Card className="relative">
          <div className="absolute top-4 right-4">
            {summary && (
              <button 
                onClick={handleCopy}
                className="p-2 text-slate-500 hover:text-purple-600 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>
          
          <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">AI Output</h3>
          
          {loading ? (
            <LoadingSkeleton rows={6} />
          ) : summary ? (
            <div className="prose dark:prose-invert text-sm max-w-none whitespace-pre-line">
              {summary}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
              Output will appear here...
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export const YouTubeSummarizer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; summary: string; keyLearnings: string[] } | null>(null);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const { addHistoryItem, showToast } = useApp();

  const handleSummarize = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await mockYouTubeSummary(url);
      setResult(res);
      addHistoryItem({
        type: ToolType.YOUTUBE_SUMMARIZER,
        title: res.title,
        summary: res.summary
      });
      showToast('Video processed successfully!');
    } catch (e) {
      showToast('Invalid YouTube URL', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!chatQuery) return;
    setChatLoading(true);
    const ans = await mockChatQuery(chatQuery);
    setChatResponse(ans);
    setChatLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full mb-2">
          <Video className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold">YouTube Summarizer</h2>
        <p className="text-slate-500">Get summaries, key takeaways, and chat with any video instantly.</p>
        
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube Link (e.g. https://youtube.com/watch?v=...)"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-red-500 outline-none shadow-sm"
          />
          <Button onClick={handleSummarize} isLoading={loading} className="bg-red-600 hover:bg-red-700 text-white">
            Analyze
          </Button>
        </div>
      </div>

      {loading && (
        <Card className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 w-3/4 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 w-full rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 w-full rounded"></div>
        </Card>
      )}

      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <h3 className="text-xl font-bold mb-3">{result.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{result.summary}</p>
              
              <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-3">Key Learnings</h4>
              <ul className="space-y-2">
                {result.keyLearnings.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200">
              <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-semibold">Ask a Question</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  placeholder="Ask about the video..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <Button onClick={handleAsk} isLoading={chatLoading} variant="secondary" className="w-full text-xs">
                  Ask AI
                </Button>
                {chatResponse && (
                  <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700">
                    {chatResponse}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};