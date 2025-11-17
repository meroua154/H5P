// app/api/h5p/list/route.ts

import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

export const dynamic = "force-dynamic"; // Pour désactiver le cache et toujours lister à jour

interface H5PModule {
  moduleId: string;
  metadata: Record<string, any>;
  uploadDate: string;
}

export async function GET() {
  try {
    const modulesDir = path.join(process.cwd(), 'public', 'h5p-modules');

    let moduleIds: string[] = [];
    try {
      const dirents = await readdir(modulesDir, { withFileTypes: true });
      moduleIds = dirents
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        // Aucun module encore uploadé
        return NextResponse.json({ success: true, modules: [] });
      }
      throw e;
    }

    const modules: H5PModule[] = [];

    for (const id of moduleIds) {
      const metadataPath = path.join(modulesDir, id, 'metadata.json');

      try {
        const metadataFile = await readFile(metadataPath, 'utf8');
        const metadataJson = JSON.parse(metadataFile);

        modules.push({
          moduleId: metadataJson.moduleId,
          metadata: metadataJson.metadata,
          uploadDate: metadataJson.uploadDate,
        });
      } catch (error) {
        console.error(`❌ Erreur lecture metadata pour module ${id}:`, error);
        // Continue avec les autres modules
      }
    }

    return NextResponse.json({
      success: true,
      modules,
    });

  } catch (error) {
    console.error('❌ Erreur serveur list modules H5P:', error);
    return NextResponse.json(
      { error: 'Erreur interne serveur.' },
      { status: 500 }
    );
  }
}
