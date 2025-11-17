// app/h5p/page.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  Upload,
  AlertCircle,
  Loader2,
  FileCheck,
  Play,
  Trash2,
  ArrowLeft,
  Download
} from 'lucide-react';
import H5PViewer from '@/components/H5PViewer';

interface H5PModule {
  moduleId: string;
  metadata?: { title?: string };
  uploadDate: string;
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [modules, setModules] = useState<H5PModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadModules();
    }
  }, [mounted]);

  // --- Charger les modules ---
  const loadModules = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/h5p/list');
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      if (data.success) setModules(data.modules || []);
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // --- Upload H5P ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.h5p')) {
      setError('Veuillez sélectionner un fichier .h5p valide');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('h5p', file);

      const res = await fetch('/api/h5p/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload échoué');
      }

      await loadModules();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // --- Suppression ---
  const handleDelete = async (moduleId?: string) => {
    console.log('🗑️ Tentative de suppression pour moduleId:', moduleId);

    if (!moduleId) {
      alert('Module invalide ou ID manquant');
      return;
    }

    if (!confirm(`Voulez-vous vraiment supprimer ce module ?\n\nID: ${moduleId}`)) {
      return;
    }

    try {
      const url = `/api/h5p/delete?moduleId=${encodeURIComponent(moduleId)}`;
      console.log('🌐 URL de suppression:', url);

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Réponse status:', res.status);

      const textResponse = await res.text();
      console.log('📄 Réponse brute:', textResponse.substring(0, 200));

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        console.error('❌ Impossible de parser la réponse JSON');
        throw new Error('Réponse du serveur invalide (HTML au lieu de JSON)');
      }

      if (!res.ok) {
        throw new Error(data.error || `Erreur HTTP ${res.status}`);
      }

      if (data.success) {
        console.log(`✅ Module supprimé: ${moduleId}`);
        
        if (selectedModule === moduleId) {
          setSelectedModule(null);
        }
        
        await loadModules();
      } else {
        throw new Error(data.error || 'Suppression échouée');
      }
    } catch (err: any) {
      console.error('❌ Erreur suppression:', err);
      setError(`Erreur lors de la suppression: ${err.message}`);
      alert(`Erreur: ${err.message}`);
    }
  };

  // --- Téléchargement ---
  const handleDownload = (moduleId: string) => {
    if (!moduleId) return;
    window.location.href = `/h5p-modules/${moduleId}/content.h5p`;
  };

  // ⚠️ IMPORTANT: Ne rien rendre tant que le composant n'est pas monté
  if (!mounted) {
    return null;
  }

  // --- Vue détail module ---
  if (selectedModule) {
    const module = modules.find(m => m.moduleId === selectedModule);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedModule(null)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la liste
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {module?.metadata?.title || 'Module H5P'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Uploadé le {module?.uploadDate ? new Date(module.uploadDate).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>
              <button
                onClick={() => handleDownload(selectedModule)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
            </div>

            <H5PViewer moduleId={selectedModule} />
          </div>
        </div>
      </div>
    );
  }

  // --- Liste des modules et upload ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Gestionnaire H5P</h1>
          <p className="text-gray-600 text-lg">Uploadez et visualisez vos modules H5P interactifs</p>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 bg-indigo-50 hover:bg-indigo-100 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              {uploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-3" />
                  <span className="text-lg font-medium text-gray-700">Upload en cours...</span>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-indigo-600 mb-3" />
                  <span className="text-lg font-medium text-gray-700 mb-2">
                    Cliquez pour uploader un fichier .h5p
                  </span>
                  <span className="text-sm text-gray-500">Le contenu sera visualisable directement</span>
                </>
              )}
              <input 
                type="file" 
                accept=".h5p" 
                onChange={handleUpload} 
                disabled={uploading} 
                className="hidden" 
              />
            </label>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Liste modules */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Mes modules ({modules.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun module uploadé pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module) => (
                <div 
                  key={module.moduleId} 
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <FileCheck className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {module.metadata?.title || `Module ${module.moduleId}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Uploadé le {new Date(module.uploadDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedModule(module.moduleId)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Visualiser
                      </button>
                      <button
                        onClick={() => handleDelete(module.moduleId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={!module.moduleId}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}