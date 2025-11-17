// app/api/h5p/extract/[id]/route.ts

import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Template viewer HTML
const VIEWER_TEMPLATE = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>H5P Viewer</title>
  <link rel="stylesheet" href="https://unpkg.com/h5p-standalone@3.7.3/dist/styles/h5p.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: sans-serif; background: #f9fafb; padding: 20px; }
    #h5p-container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 20px; min-height: 500px; }
    .loading { text-align: center; padding: 60px 20px; }
    .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #6366f1; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .error { text-align: center; padding: 40px; color: #ef4444; background: #fee; border-radius: 8px; }
  </style>
</head>
<body>
  <div id="h5p-container">
    <div class="loading">
      <div class="spinner"></div>
      <p style="color: #6366f1; font-size: 16px;">Chargement du contenu H5P...</p>
    </div>
  </div>
  <script src="https://unpkg.com/h5p-standalone@3.7.3/dist/main.bundle.js"></script>
  <script>
    const moduleId = '\${id}';
    
    // Récupérer l'URL de base depuis Vercel Blob
    async function getBaseUrl() {
      try {
        const metaRes = await fetch('/api/h5p/blob-url?moduleId=' + moduleId);
        const metaData = await metaRes.json();
        return metaData.baseUrl;
      } catch (e) {
        console.error('Erreur récupération URL:', e);
        return null;
      }
    }
    
    async function loadH5P() {
      const container = document.getElementById('h5p-container');
      
      try {
        const baseUrl = await getBaseUrl();
        if (!baseUrl) throw new Error('URL de base introuvable');
        
        console.log('🚀 Chargement H5P depuis:', baseUrl);
        
        await new Promise(resolve => {
          if (typeof H5PStandalone !== 'undefined') resolve();
          else setTimeout(resolve, 500);
        });
        
        container.innerHTML = '<div id="h5p-player" style="width: 100%;"></div>';
        
        const options = {
          h5pJsonPath: baseUrl + '/content',
          frameJs: 'https://unpkg.com/h5p-standalone@3.7.3/dist/frame.bundle.js',
          frameCss: 'https://unpkg.com/h5p-standalone@3.7.3/dist/styles/h5p.css',
        };
        
        const element = document.getElementById('h5p-player');
        new H5PStandalone.H5P(element, options);
        
        console.log('✅ H5P chargé avec succès');
      } catch (error) {
        console.error('❌ Erreur:', error);
        container.innerHTML = \`
          <div class="error">
            <h3>❌ Erreur de chargement</h3>
            <p>\${error.message}</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">Réessayer</button>
          </div>
        \`;
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadH5P);
    } else {
      loadH5P();
    }
  </script>
</body>
</html>`;

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    
    console.log('📦 Extraction demandée pour:', id);

    // Vérifier si viewer.html existe déjà dans Blob
    const { blobs } = await list({
      prefix: `h5p-modules/${id}/viewer.html`,
    });

    if (blobs.length > 0) {
      console.log('✅ Viewer déjà extrait');
      return NextResponse.json({ 
        success: true, 
        alreadyExtracted: true 
      });
    }

    // Créer et uploader viewer.html
    const viewerHtml = VIEWER_TEMPLATE.replace(/\\\$\{id\}/g, id);
    
    await put(`h5p-modules/${id}/viewer.html`, viewerHtml, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'text/html',
    });

    console.log('✅ Viewer créé dans Blob');

    return NextResponse.json({ 
      success: true, 
      extracted: true 
    });

  } catch (error: any) {
    console.error('❌ Erreur extraction:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}