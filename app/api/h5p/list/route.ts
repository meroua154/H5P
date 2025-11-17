// app/api/h5p/list/route.ts

import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export const dynamic = "force-dynamic";

interface H5PModule {
  moduleId: string;
  metadata: Record<string, any>;
  uploadDate: string;
}

export async function GET() {
  try {
    // Lister tous les fichiers dans h5p-modules/
    const { blobs } = await list({
      prefix: 'h5p-modules/',
    });

    // Filtrer les metadata.json
    const metadataBlobs = blobs.filter(blob => 
      blob.pathname.endsWith('/metadata.json')
    );

    const modules: H5PModule[] = [];

    // Récupérer chaque metadata
    for (const blob of metadataBlobs) {
      try {
        const response = await fetch(blob.url);
        const metadataJson = await response.json();

        modules.push({
          moduleId: metadataJson.moduleId,
          metadata: metadataJson.metadata,
          uploadDate: metadataJson.uploadDate,
        });
      } catch (error) {
        console.error(`❌ Erreur lecture metadata ${blob.pathname}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      modules,
    });

  } catch (error: any) {
    console.error('❌ Erreur list modules:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur interne serveur.' },
      { status: 500 }
    );
  }
}