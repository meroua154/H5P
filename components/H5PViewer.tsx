// components/H5PViewer.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface H5PViewerProps {
  moduleId: string;
}

export default function H5PViewer({ moduleId }: H5PViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewerUrl, setViewerUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!moduleId) return;
    initViewer();
  }, [moduleId]);

  const initViewer = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. S'assurer que le viewer existe
      const extractRes = await fetch(`/api/h5p/extract/${moduleId}`);
      if (!extractRes.ok) {
        const errorData = await extractRes.json();
        throw new Error(errorData.error || 'Erreur extraction');
      }

      // 2. Récupérer l'URL du viewer depuis Blob
      const blobRes = await fetch(`/api/h5p/blob-url?moduleId=${moduleId}`);
      if (!blobRes.ok) {
        throw new Error('Impossible de récupérer l\'URL du viewer');
      }

      const blobData = await blobRes.json();
      
      // Construire l'URL du viewer
      const viewerBlobUrl = `${blobData.baseUrl.replace('/content', '')}/viewer.html`;
      
      console.log('🎬 URL Viewer:', viewerBlobUrl);
      
      setViewerUrl(viewerBlobUrl);
      setLoading(false);

    } catch (err: any) {
      console.error('❌ Erreur initialisation H5P:', err);
      setError(err.message || 'Erreur inconnue');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-xl">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600">Préparation du contenu H5P...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-xl">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-2 font-semibold">Erreur de chargement</p>
        <p className="text-gray-600 text-sm mb-4">{error}</p>
        <button 
          onClick={initViewer} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-white border rounded-xl shadow-inner overflow-hidden">
      <iframe
        ref={iframeRef}
        src={viewerUrl}
        className="w-full h-full border-0"
        title="H5P Content Viewer"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}