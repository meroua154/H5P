// app/api/h5p/blob-url/route.ts

import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json(
        { error: 'moduleId manquant' },
        { status: 400 }
      );
    }

    // Récupérer les blobs du module
    const { blobs } = await list({
      prefix: `h5p-modules/${moduleId}/content/`,
      limit: 1
    });

    if (blobs.length === 0) {
      return NextResponse.json(
        { error: 'Module introuvable' },
        { status: 404 }
      );
    }

    // Extraire l'URL de base (sans le nom du fichier)
    const firstBlobUrl = blobs[0].url;
    const baseUrl = firstBlobUrl.substring(0, firstBlobUrl.lastIndexOf('/content/') + 8);

    return NextResponse.json({
      success: true,
      baseUrl,
      moduleId
    });

  } catch (error: any) {
    console.error('❌ Erreur blob-url:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}